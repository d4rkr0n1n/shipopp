const PLANS: Record<string, { name: string; amount: number; priceId?: string }> = {
  launch: { name: "ShipOps Launch", amount: 89900, priceId: process.env.STRIPE_PRICE_LAUNCH },
  scale: { name: "ShipOps Scale", amount: 189900, priceId: process.env.STRIPE_PRICE_SCALE },
  mission: { name: "ShipOps Mission", amount: 349900, priceId: process.env.STRIPE_PRICE_MISSION },
};
export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const { plan: planId } = await request.json(); const plan = PLANS[planId];
  if (!plan) return Response.json({ error: "That plan does not exist." }, { status: 400 });
  if (!secret) return Response.json({ error: "Demo checkout is ready. Add your Stripe keys to accept live subscriptions." }, { status: 503 });
  const origin = new URL(request.url).origin;
  const params = new URLSearchParams({ mode: "subscription", success_url: `${origin}/?checkout=success`, cancel_url: `${origin}/#pricing`, "line_items[0][quantity]": "1" });
  if (plan.priceId) params.set("line_items[0][price]", plan.priceId); else { params.set("line_items[0][price_data][currency]", "usd"); params.set("line_items[0][price_data][unit_amount]", String(plan.amount)); params.set("line_items[0][price_data][recurring][interval]", "month"); params.set("line_items[0][price_data][product_data][name]", plan.name); }
  const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" }, body: params });
  const session = await stripeResponse.json();
  if (!stripeResponse.ok) return Response.json({ error: session.error?.message || "Unable to start checkout." }, { status: 502 });
  return Response.json({ url: session.url });
}
