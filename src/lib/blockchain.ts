
import { ethers } from 'ethers';

/**
 * Sanjeevani Trust Layer Service
 * Interacts with Avalanche C-Chain Fuji Testnet to verify healthcare data.
 */

// ABI for the DataProof contract
const DATA_PROOF_ABI = [
  "function storeHash(string memory _hash) public",
  "function getRecords() public view returns (tuple(string hash, uint256 timestamp)[])",
  "event DataStored(address indexed sender, string hash, uint256 timestamp)"
];

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

/**
 * Client-side: Connect to user's MetaMask wallet
 */
export async function connectWallet() {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      
      const network = await provider.getNetwork();
      // Avalanche Fuji Chain ID is 43113
      if (network.chainId !== 43113n) {
        alert("Please switch your MetaMask network to Avalanche Fuji Testnet!");
        return null;
      }

      return { provider, address: accounts[0] };
    } catch (error) {
      console.error("Wallet connection failed", error);
      return null;
    }
  }
  return null;
}

/**
 * Client-side: Anchors data using MetaMask (good for manual updates like hospital beds)
 */
export async function anchorDataToAvalanche(data: any) {
  const connection = await connectWallet();
  if (!connection) throw new Error("No crypto wallet detected or incorrect network. Please use MetaMask on Avalanche Fuji.");

  const dataString = JSON.stringify(data);
  const hash = ethers.keccak256(ethers.toUtf8Bytes(dataString));

  try {
    const signer = await connection.provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DATA_PROOF_ABI, signer);

    const tx = await contract.storeHash(hash);
    const receipt = await tx.wait();

    return {
      hash,
      timestamp: new Date().toISOString(),
      network: "Avalanche Fuji C-Chain",
      txId: receipt.hash,
      verified: true
    };
  } catch (error: any) {
    console.error("Blockchain transaction failed:", error);
    throw new Error(error.reason || error.message || "Blockchain transaction failed.");
  }
}

/**
 * Server-side: Anchors data using a private key (for automated proofs like payment)
 */
export async function anchorPaymentServer(paymentData: { id: string, amount: number, email: string }) {
  const rpcUrl = process.env.AVAX_RPC || "https://api.avax-test.network/ext/bc/C/rpc";
  const privateKey = process.env.AVAX_PRIVATE_KEY;

  if (!privateKey) {
    console.warn("AVAX_PRIVATE_KEY is missing. Skipping real on-chain anchor.");
    return { hash: "mock-hash", txId: "mock-tx-hash-" + Date.now() };
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DATA_PROOF_ABI, wallet);

    // Create a deterministic hash of stable payment fields
    const paymentString = JSON.stringify({
      id: paymentData.id,
      amount: paymentData.amount,
      email: paymentData.email,
      timestamp: new Date().toISOString().split('T')[0] // Day accuracy for privacy
    });
    const hash = ethers.keccak256(ethers.toUtf8Bytes(paymentString));

    // Sign and send transaction
    const tx = await contract.storeHash(hash);
    const receipt = await tx.wait();

    return {
      hash,
      txId: receipt.hash,
      verified: true
    };
  } catch (error) {
    console.error("Server-side blockchain anchor failed:", error);
    throw error;
  }
}
