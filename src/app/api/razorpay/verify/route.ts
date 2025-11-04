
import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export async function POST(req: Request) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
  
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return NextResponse.json({ error: 'Razorpay key secret not configured.' }, { status: 500 });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = createHmac('sha256', keySecret)
    .update(body.toString())
    .digest('hex');
  
  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Payment is authentic. Here you could also save payment details to your database.
    return NextResponse.json({ status: 'success' });
  } else {
    return NextResponse.json({ status: 'failure' }, { status: 400 });
  }
}
