
import { ethers } from 'ethers';

/**
 * Sanjeevani Trust Layer Service (Server-Side Driven)
 * Interacts with Avalanche C-Chain Fuji Testnet using a server-side private key.
 */

const DATA_PROOF_ABI = [
  "function storeHash(string memory _hash) public",
  "function getRecords() public view returns (tuple(string hash, uint256 timestamp)[])",
  "event DataStored(address indexed sender, string hash, uint256 timestamp)"
];

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
const RPC_URL = process.env.AVAX_RPC || "https://api.avax-test.network/ext/bc/C/rpc";

/**
 * Validates if a string is a valid Ethereum private key (64 hex chars, optional 0x prefix)
 */
function isValidPrivateKey(key: string | undefined): boolean {
  if (!key) return false;
  const cleanKey = key.startsWith('0x') ? key.slice(2) : key;
  return /^[0-9a-fA-F]{64}$/.test(cleanKey);
}

/**
 * Anchors any data object to Avalanche Fuji using the server's private key.
 * This function is intended to be called from Server Actions or API Routes.
 */
export async function anchorDataToServerWallet(data: any) {
  const privateKey = process.env.AVAX_PRIVATE_KEY;

  // GRACEFUL FALLBACK: If the key is missing, a placeholder, or invalid hex
  if (!isValidPrivateKey(privateKey)) {
    console.warn("AVAX_PRIVATE_KEY is missing or invalid. Simulating on-chain anchor for demo.");
    const dataString = JSON.stringify(data);
    const hash = ethers.keccak256(ethers.toUtf8Bytes(dataString));
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      hash,
      txId: "simulated-tx-" + Math.random().toString(36).substring(7),
      network: "Avalanche Fuji (Simulated)",
      timestamp: new Date().toISOString(),
      simulated: true,
      message: "Running in Demo Mode. Add a valid AVAX_PRIVATE_KEY to .env for live transactions."
    };
  }

  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(privateKey!, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DATA_PROOF_ABI, wallet);

    const dataString = JSON.stringify(data);
    const hash = ethers.keccak256(ethers.toUtf8Bytes(dataString));

    // Optional: Check balance before attempting
    const balance = await provider.getBalance(wallet.address);
    if (balance === 0n) {
        throw new Error("Server wallet has 0 AVAX. Please fund it using the Fuji Faucet.");
    }

    const tx = await contract.storeHash(hash);
    const receipt = await tx.wait();

    return {
      hash,
      txId: receipt?.hash,
      network: "Avalanche Fuji C-Chain",
      timestamp: new Date().toISOString(),
      simulated: false
    };
  } catch (error: any) {
    console.error("Blockchain anchoring failed:", error);
    throw new Error(error.message || "Failed to anchor data to Avalanche.");
  }
}

/**
 * Legacy support for payment specific anchoring
 */
export async function anchorPaymentServer(paymentData: { id: string, amount: number, email: string }) {
    return anchorDataToServerWallet(paymentData);
}

/**
 * MetaMask utility - preserved for 'Connect Wallet' display in profile if needed, 
 * but no longer required for core features.
 */
export function isMetaMaskInstalled() {
  return typeof window !== 'undefined' && !!(window as any).ethereum;
}
