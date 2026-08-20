import { createHmac, timingSafeEqual } from "node:crypto";

type VerificationRequest = {
  razorpay_payment_id?: unknown;
  razorpay_subscription_id?: unknown;
  razorpay_signature?: unknown;
};

export async function POST(request: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return Response.json({ error: "Payment verification is not configured." }, { status: 503 });

  let body: VerificationRequest;
  try {
    body = (await request.json()) as VerificationRequest;
  } catch {
    return Response.json({ error: "Invalid verification request." }, { status: 400 });
  }

  const { razorpay_payment_id: paymentId, razorpay_subscription_id: subscriptionId, razorpay_signature: signature } = body;
  if (typeof paymentId !== "string" || typeof subscriptionId !== "string" || typeof signature !== "string") {
    return Response.json({ error: "Payment verification details are incomplete." }, { status: 400 });
  }

  const expected = createHmac("sha256", secret).update(`${paymentId}|${subscriptionId}`).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const signatureBuffer = Buffer.from(signature, "utf8");
  const verified = expectedBuffer.length === signatureBuffer.length && timingSafeEqual(expectedBuffer, signatureBuffer);
  if (!verified) return Response.json({ error: "Payment verification failed." }, { status: 400 });

  return Response.json({ verified: true });
}
