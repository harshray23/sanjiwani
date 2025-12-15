import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const options = {
      amount: body.amount * 100,
      currency: "INR",
      receipt: "receipt_order_1",
    };

    const order = await instance.orders.create(options);

    return NextResponse.json(order);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
