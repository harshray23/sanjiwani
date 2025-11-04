
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  const { amount } = await req.json();

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error("Razorpay API keys are not configured in environment variables.");
    return NextResponse.json({ error: 'Razorpay API keys not configured.' }, { status: 500 });
  }

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  const options = {
    amount: amount * 100, // amount in the smallest currency unit (paise)
    currency: 'INR',
    receipt: `receipt_order_${randomBytes(8).toString('hex')}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json({ orderId: order.id, keyId: keyId });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    // Provide a more specific error message if possible
    const errorMessage = (error instanceof Error) ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Failed to create Razorpay order.', details: errorMessage }, { status: 500 });
  }
}
