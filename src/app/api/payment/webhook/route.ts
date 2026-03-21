
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { anchorPaymentServer } from '@/lib/blockchain';
import { updateAppointmentWithProof, rewardUser } from '@/lib/data';

/**
 * Razorpay Webhook Handler
 * This route listens for successful payment events and anchors them to Avalanche.
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret || !signature) {
      return NextResponse.json({ error: "Missing webhook secret or signature" }, { status: 400 });
    }

    // 1. Verify Razorpay Signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const body = JSON.parse(rawBody);
    const event = body.event;

    // 2. Handle Successful Payment
    if (event === "payment.captured") {
      const payment = body.payload.payment.entity;
      
      console.log(`[Sanjeevani Webhook] Payment Captured: ${payment.id}`);

      // 3. Anchor cryptographic proof to Avalanche (Server-Side)
      const anchorResult = await anchorPaymentServer({
        id: payment.id,
        amount: payment.amount / 100, // paise to INR
        email: payment.email
      });

      // 4. Update Database (Mock)
      // Note: In a real app, you'd match the payment.notes.appointmentId to update the right record
      const appointmentId = payment.notes?.appointmentId;
      if (appointmentId) {
        await updateAppointmentWithProof(appointmentId, anchorResult.hash, anchorResult.txId);
        
        // 5. Reward user for a verified on-chain payment
        const userId = payment.notes?.userId;
        if (userId) {
            await rewardUser(userId, 'Payment Proof', 5, anchorResult.txId);
        }
      }

      console.log(`[Sanjeevani Trust Layer] Payment proof anchored: ${anchorResult.txId}`);
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("Webhook Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
