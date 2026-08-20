const PLAN_ENV_KEYS = {
  launch: "RAZORPAY_PLAN_LAUNCH",
  scale: "RAZORPAY_PLAN_SCALE",
  mission: "RAZORPAY_PLAN_MISSION",
} as const;

type PlanId = keyof typeof PLAN_ENV_KEYS;

function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && value in PLAN_ENV_KEYS;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  const plan = (body as { plan?: unknown })?.plan;
  if (!isPlanId(plan)) {
    return Response.json({ error: "That plan does not exist." }, { status: 400 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const planId = process.env[PLAN_ENV_KEYS[plan]];
  if (!keyId || !keySecret || !planId) {
    return Response.json({ error: "Razorpay checkout is not configured for this plan yet." }, { status: 503 });
  }

  try {
    const razorpayResponse = await fetch("https://api.razorpay.com/v1/subscriptions", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ plan_id: planId, total_count: 12, quantity: 1, customer_notify: 1, notes: { service: "ShipOps", plan } }),
      cache: "no-store",
    });
    const subscription = (await razorpayResponse.json()) as { id?: string; error?: { description?: string } };
    if (!razorpayResponse.ok || !subscription.id) {
      return Response.json({ error: subscription.error?.description || "Unable to start Razorpay checkout." }, { status: 502 });
    }
    return Response.json({ subscriptionId: subscription.id, keyId });
  } catch {
    return Response.json({ error: "Unable to reach Razorpay. Please try again." }, { status: 502 });
  }
}
