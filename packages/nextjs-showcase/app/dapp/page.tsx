'use client';

import { useState, useEffect, useRef } from 'react';
import { useAccount, useWalletClient } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers, BrowserProvider } from 'ethers';
import Link from 'next/link';

// Contract configuration
const CONTRACT_ADDRESS = '0x5bD92e11aDd45FC80Ef223038568Faba4302728B';
const CONTRACT_ABI = [
  'function submitFDV(bytes32 encryptedFDV, bytes proof) external',
  'function getComparisonResult() external view returns (bytes32)',
  'function hasSubmitted(address) external view returns (bool)',
];

// FHEVM configuration for Sepolia
const FHEVM_CONFIG = {
  chainId: 11155111,
  aclContractAddress: '0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D',
  kmsContractAddress: '0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A',
  inputVerifierContractAddress: '0xBBC1fFCdc7C316aAAd72E807D9b0272BE8F84DA0',
  verifyingContractAddressDecryption: '0x5D8BD78e2ea6bbE41f26dFe9fdaEAa349e077478',
  verifyingContractAddressInputVerification: '0x483b9dE06E4E4C7D35CCf5837A1668487406D955',
  gatewayChainId: 10901,
  relayerUrl: 'https://relayer.testnet.zama.org',
};

export default function DAppPage() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  
  const [fhevmInstance, setFhevmInstance] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [fdvInput, setFdvInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [canDecrypt, setCanDecrypt] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const isInitializingRef = useRef(false);

  // Initialize FHEVM
  useEffect(() => {
    if (!isConnected || !address || !walletClient || fhevmInstance || isInitializingRef.current) {
      return;
    }

    const initFhevm = async () => {
      isInitializingRef.current = true;
      setIsInitializing(true);
      setError(null);

      try {
        if (!(window as any).relayerSDK) {
          throw new Error('Relayer SDK not loaded');
        }

        // Initialize SDK
        await (window as any).relayerSDK.initSDK();

        // Create instance
        const instance = await (window as any).relayerSDK.createInstance({
          ...FHEVM_CONFIG,
          network: walletClient,
        });

        setFhevmInstance(instance);
        console.log('✅ FHEVM initialized successfully');
        
        // Note: Not checking hasSubmitted to allow multiple submissions for demo purposes
      } catch (e: any) {
        setError(e.message);
        console.error('❌ FHEVM init failed:', e);
        isInitializingRef.current = false;
      } finally {
        setIsInitializing(false);
      }
    };

    initFhevm();
  }, [isConnected, address, walletClient, fhevmInstance]);

  // Submit FDV
  const handleSubmitFDV = async () => {
    if (!fhevmInstance || !walletClient || !fdvInput) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const fdvValue = parseInt(fdvInput);
      if (isNaN(fdvValue) || fdvValue <= 0) {
        throw new Error('Please enter a valid FDV value');
      }

      // Create encrypted input
      const input = fhevmInstance.createEncryptedInput(CONTRACT_ADDRESS, address);
      input.add32(fdvValue);
      const encryptedInput = await input.encrypt();

      // Submit to contract
      const provider = new BrowserProvider(walletClient as any);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const tx = await contract.submitFDV(
        encryptedInput.handles[0],
        encryptedInput.inputProof
      );

      console.log('📤 Transaction submitted:', tx.hash);
      await tx.wait();
      console.log('✅ Transaction confirmed');

      setHasSubmitted(true);

      // Start countdown (10 seconds for permission sync)
      setCountdown(10);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanDecrypt(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e: any) {
      console.error('❌ Submit error:', e);
      setError(e.message || 'Failed to submit FDV');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Decrypt result
  const handleDecrypt = async () => {
    if (!fhevmInstance || !walletClient) return;

    setIsDecrypting(true);
    setError(null);

    try {
      const provider = new BrowserProvider(walletClient as any);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Get encrypted result
      const encryptedHandle = await contract.getComparisonResult();

      // Decrypt using userDecrypt
      const keypair = fhevmInstance.generateKeypair();
      const handleContractPairs = [
        { handle: encryptedHandle, contractAddress: CONTRACT_ADDRESS }
      ];
      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = "10";
      const contractAddresses = [CONTRACT_ADDRESS];

      const eip712 = fhevmInstance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimeStamp,
        durationDays
      );

      // Remove EIP712Domain for signing
      const typesWithoutDomain = { ...eip712.types };
      delete typesWithoutDomain.EIP712Domain;

      const signature = await signer.signTypedData(
        eip712.domain,
        typesWithoutDomain,
        eip712.message
      );

      console.log('🔓 Decrypting result...');
      const decryptedResults = await fhevmInstance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace("0x", ""),
        contractAddresses,
        address,
        startTimeStamp,
        durationDays
      );

      const decryptedValue = decryptedResults[encryptedHandle];
      // Convert BigInt to Number if necessary
      const numericResult = typeof decryptedValue === 'bigint' 
        ? Number(decryptedValue) 
        : Number(decryptedValue);
      console.log('✅ Decrypted result:', decryptedValue, '-> numeric:', numericResult);
      setResult(numericResult);
    } catch (e: any) {
      console.error('❌ Decrypt error:', e);
      setError(e.message || 'Failed to decrypt result');
    } finally {
      setIsDecrypting(false);
    }
  };

  // Render loading state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Link href="/" className="inline-block mb-8 text-purple-400 hover:text-purple-300">
            ← Back to Home
          </Link>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12">
            <h2 className="text-2xl font-bold text-white mb-6">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-8">Connect your wallet to start comparing valuations</p>
            <ConnectButton />
          </div>
        </div>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mx-auto mb-6"></div>
          <p className="text-white text-xl">Initializing FHEVM...</p>
          <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  // Main DApp UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-white text-2xl font-bold">ValuVault</span>
          </Link>
          <ConnectButton />
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-4 text-center">
            KOL Round Comparison
          </h1>
          <p className="text-gray-400 text-center mb-12">
            Submit your FDV and discover how it compares to the market benchmark
          </p>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="text-blue-400 text-2xl">ℹ️</div>
              <div>
                <p className="text-blue-300 font-semibold mb-2">How It Works</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Enter the FDV (Fully Diluted Valuation) you received from the project in millions. 
                  Your value will be encrypted and compared against the benchmark (100M) using FHE. 
                  You'll learn if your terms are above or below average - all while keeping your actual FDV private.
                </p>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            {!hasSubmitted ? (
              <>
                <label className="block text-white font-semibold mb-3">
                  Enter Your FDV (in millions)
                </label>
                <input
                  type="number"
                  value={fdvInput}
                  onChange={(e) => setFdvInput(e.target.value)}
                  placeholder="e.g., 80"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-6"
                  disabled={isSubmitting}
                />

                <button
                  onClick={handleSubmitFDV}
                  disabled={isSubmitting || !fdvInput}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </span>
                  ) : (
                    '🔐 Submit Encrypted FDV'
                  )}
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="text-green-400 text-5xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-white mb-2">FDV Submitted!</h3>
                  <p className="text-gray-400">Your valuation has been encrypted and stored on-chain</p>
                </div>

                {countdown > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 text-center">
                    <p className="text-amber-300">
                      ⏳ Syncing permissions... Please wait <span className="font-bold">{countdown}s</span>
                    </p>
                  </div>
                )}

                {canDecrypt && result === null && (
                  <button
                    onClick={handleDecrypt}
                    disabled={isDecrypting}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 disabled:opacity-50"
                  >
                    {isDecrypting ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Decrypting...
                      </span>
                    ) : (
                      '🔓 Decrypt Result'
                    )}
                  </button>
                )}

                {result !== null && (
                  <>
                    <div className={`${result === 1 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} border rounded-xl p-6 text-center mb-6`}>
                      <div className={`text-5xl mb-4`}>
                        {result === 1 ? '🎉' : '📊'}
                      </div>
                      <h3 className={`text-2xl font-bold mb-2 ${result === 1 ? 'text-green-400' : 'text-red-400'}`}>
                        {result === 1 ? 'Above Benchmark!' : 'Below Benchmark'}
                      </h3>
                      <p className="text-gray-300">
                        {result === 1 
                          ? 'Your FDV is higher than the market average (100M)' 
                          : 'Your FDV is at or below the market average (100M)'}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        setHasSubmitted(false);
                        setResult(null);
                        setCanDecrypt(false);
                        setFdvInput('');
                        setCountdown(0);
                        setError(null);
                      }}
                      className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                    >
                      🔄 Submit Another FDV
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-red-400 text-center">❌ {error}</p>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="mt-8 bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="text-purple-400 text-2xl">🔒</div>
              <div>
                <p className="text-purple-300 font-semibold mb-2">Your Privacy is Guaranteed</p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Your FDV value remains encrypted throughout the entire process</li>
                  <li>• Only you can decrypt the comparison result</li>
                  <li>• The smart contract never sees your plaintext data</li>
                  <li>• All computations use Fully Homomorphic Encryption</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';

