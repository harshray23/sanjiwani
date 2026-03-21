
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
 * Check if MetaMask is installed
 */
export function isMetaMaskInstalled() {
  return typeof window !== 'undefined' && !!(window as any).ethereum;
}

/**
 * Client-side: Connect to user's MetaMask wallet
 */
export async function connectWallet() {
  if (typeof window === 'undefined') return null;

  const ethereum = (window as any).ethereum;
  if (!ethereum) {
    throw new Error("MetaMask is not installed. Please install the MetaMask extension from metamask.io to verify data on-chain.");
  }

  try {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(ethereum);
    
    const network = await provider.getNetwork();
    // Avalanche Fuji Chain ID is 43113
    if (Number(network.chainId) !== 43113) {
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xa869' }], // 43113 in hex
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xa869',
              chainName: 'Avalanche Fuji Testnet',
              nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
              rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
              blockExplorerUrls: ['https://testnet.snowtrace.io/']
            }],
          });
        } else {
          throw switchError;
        }
      }
    }

    return { provider, address: accounts[0] };
  } catch (error: any) {
    console.error("Wallet connection failed", error);
    throw new Error(error.message || "Failed to connect wallet.");
  }
}

/**
 * Client-side: Anchors data using MetaMask
 */
export async function anchorDataToAvalanche(data: any) {
  const connection = await connectWallet();
  if (!connection) throw new Error("Wallet connection failed.");

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
      txId: receipt?.hash,
      verified: true
    };
  } catch (error: any) {
    console.error("Blockchain transaction failed:", error);
    throw new Error(error.reason || error.message || "Blockchain transaction failed.");
  }
}

/**
 * Server-side: Anchors data using a private key
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

    const paymentString = JSON.stringify({
      id: paymentData.id,
      amount: paymentData.amount,
      email: paymentData.email,
      timestamp: new Date().toISOString().split('T')[0]
    });
    const hash = ethers.keccak256(ethers.toUtf8Bytes(paymentString));

    const tx = await contract.storeHash(hash);
    const receipt = await tx.wait();

    return {
      hash,
      txId: receipt?.hash,
      verified: true
    };
  } catch (error) {
    console.error("Server-side blockchain anchor failed:", error);
    throw error;
  }
}
