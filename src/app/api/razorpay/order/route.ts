import Razorpay from "razorpay";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const options = {
      amount: body.amount * 100, // amount in paise
      currency: "INR",
      receipt: receipt_${Date.now()},
    };

    const order = await instance.orders.create(options);
    return Response.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(JSON.stringify({ error: "Failed to create order" }), {
      status: 500,
    });
  }
}