import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const razorpay_order_id = formData.get("razorpay_order_id") as string;
    const razorpay_payment_id = formData.get("razorpay_payment_id") as string;
    const razorpay_signature = formData.get("razorpay_signature") as string;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // ✅ Verified payment
      return Response.redirect("https://yourwebsite.com/payment-success");
    } else {
      // ❌ Invalid signature
      return Response.redirect("https://yourwebsite.com/payment-failed");
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response("Verification failed", { status: 500 });
  }
}