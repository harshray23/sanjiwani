
import { NextResponse } from 'next/server';
import { anchorDataToServerWallet } from '@/lib/blockchain';

/**
 * Universal Blockchain Anchoring API
 * Allows the client to request an on-chain proof without needing MetaMask.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data } = body;

    if (!data) {
      return NextResponse.json({ error: "No data provided for anchoring" }, { status: 400 });
    }

    const result = await anchorDataToServerWallet(data);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Anchor Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
