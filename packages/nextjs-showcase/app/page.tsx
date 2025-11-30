'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-white text-2xl font-bold">ValuVault</span>
          </div>
          <Link 
            href="/dapp"
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            Launch App
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full">
            <span className="text-purple-300 text-sm font-medium">Powered by Fully Homomorphic Encryption</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Private Valuation
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Intelligence Platform
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            The first privacy-preserving KOL round valuation comparison platform. 
            Know your position without revealing your terms.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dapp"
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Start Comparing →
            </Link>
            <a 
              href="https://docs.zama.org/fhevm"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">100%</div>
            <div className="text-gray-300">Privacy Guaranteed</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-pink-400 mb-2">FHE</div>
            <div className="text-gray-300">Zero-Knowledge Encryption</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">On-Chain</div>
            <div className="text-gray-300">Verifiable & Trustless</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-black/30 backdrop-blur-sm py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
              The <span className="text-purple-400">Information Asymmetry</span> Problem
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
                <div className="text-red-400 text-2xl mb-4">❌ Current Reality</div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>VCs offer different FDV to each KOL</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>KOLs don't know if they're getting a fair deal</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Sharing terms publicly damages relationships</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Information asymmetry benefits projects, not KOLs</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8">
                <div className="text-green-400 text-2xl mb-4">✅ ValuVault Solution</div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Submit your FDV terms privately</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Compare against market average instantly</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Zero disclosure - FHE keeps values encrypted</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Empower KOLs with market intelligence</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
              How It Works
            </h2>
            <p className="text-gray-400 text-center mb-16 text-lg">
              Three simple steps to gain market intelligence without compromising privacy
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Enter Your FDV</h3>
                <p className="text-gray-400">
                  Input the valuation you received from the project (in millions)
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">FHE Encryption</h3>
                <p className="text-gray-400">
                  Your data is encrypted and compared on-chain without ever being exposed
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Get Results</h3>
                <p className="text-gray-400">
                  Instantly know if you're above or below market average - privately
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="bg-black/30 backdrop-blur-sm py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
              Powered by <span className="text-purple-400">Cutting-Edge Cryptography</span>
            </h2>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Fully Homomorphic Encryption (FHE)</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                ValuVault leverages Zama's FHEVM technology - the only blockchain solution that enables 
                computation on encrypted data. Your valuation remains encrypted throughout the entire process:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">▸</span>
                  <span>Encrypted at submission</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">▸</span>
                  <span>Computed on-chain without decryption</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">▸</span>
                  <span>Results revealed only to you</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">▸</span>
                  <span>Zero knowledge proofs ensure correctness</span>
                </li>
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-purple-400 text-lg font-semibold mb-2">🔐 True Privacy</div>
                <p className="text-gray-400 text-sm">
                  Not even the smart contract can see your actual FDV value
                </p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="text-pink-400 text-lg font-semibold mb-2">⛓️ On-Chain Verification</div>
                <p className="text-gray-400 text-sm">
                  All computations are publicly verifiable on Ethereum
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-white mb-6">
              Ready to Level the Playing Field?
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join the future of private valuation intelligence
            </p>
            <Link 
              href="/dapp"
              className="inline-block px-10 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Launch ValuVault →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="text-white font-bold">ValuVault</span>
            </div>
            <div className="text-gray-400 text-sm">
              Built with <span className="text-purple-400">FHEVM v0.9</span> on Sepolia
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="https://docs.zama.org/fhevm" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                Docs
              </a>
              <a href="https://github.com/zama-ai/fhevm" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
