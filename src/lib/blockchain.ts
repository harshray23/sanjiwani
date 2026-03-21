
import { ethers } from 'ethers';

/**
 * Sanjeevani Trust Layer Service
 * Interacts with Avalanche C-Chain Fuji Testnet to verify healthcare data.
 */

// ABI generated from Step 2
const DATA_PROOF_ABI = [
  "function storeHash(string memory _hash) public",
  "function getRecords() public view returns (tuple(string hash, uint256 timestamp)[])",
  "event DataStored(address indexed sender, string hash, uint256 timestamp)"
];

// This address should be updated after you run: npx hardhat run scripts/deploy.js --network fuji
// Defaulting to a placeholder or a pre-deployed instance for the demo
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

export async function connectWallet() {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    try {
      // Request account access
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      
      // Verify if we are on Avalanche Fuji (Chain ID: 43113)
      const network = await provider.getNetwork();
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
 * Anchors data to Avalanche C-Chain
 * This version uses the user's MetaMask for a visible, live demo experience.
 */
export async function anchorDataToAvalanche(data: any) {
  const connection = await connectWallet();
  if (!connection) throw new Error("No crypto wallet detected or incorrect network. Please install MetaMask and use Avalanche Fuji.");

  // Step 1: Create a hash of the current data state (tamper-proof fingerprint)
  const dataString = JSON.stringify(data);
  const hash = ethers.keccak256(ethers.toUtf8Bytes(dataString));

  console.log(`[Avalanche Trust Layer] Prepared hash for anchoring: ${hash}`);
  
  try {
    const signer = await connection.provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, DATA_PROOF_ABI, signer);

    // Step 2: Trigger live transaction
    const tx = await contract.storeHash(hash);
    
    // Step 3: Wait for block confirmation (Wait 1 block for Fuji speed)
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

export function getVerificationBadge(hash: string | null) {
  if (!hash) return null;
  return {
    label: "On-Chain Verified",
    network: "Avalanche",
    status: "Verified"
  };
}
