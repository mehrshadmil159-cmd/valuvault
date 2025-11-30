# ValuVault 🔐

> **Privacy-Preserving Valuation Intelligence for KOL Funding Rounds**

ValuVault is the first decentralized platform that enables Key Opinion Leaders (KOLs) to privately compare their funding round valuations without revealing sensitive deal terms. Built on Zama's FHEVM (Fully Homomorphic Encryption Virtual Machine), ValuVault empowers KOLs with market intelligence while maintaining complete privacy.

---

## 🌟 The Problem

In today's Web3 ecosystem, venture capital projects often offer different FDV (Fully Diluted Valuation) terms to individual KOLs during private funding rounds. This creates:

- **Information Asymmetry**: KOLs don't know if they're receiving competitive terms
- **Privacy Concerns**: Sharing deal terms publicly damages relationships with projects
- **Market Inefficiency**: Lack of transparency benefits projects at KOLs' expense
- **Trust Issues**: No way to verify fairness without compromising confidentiality

## 💡 The Solution

ValuVault leverages **Fully Homomorphic Encryption (FHE)** to enable:

✅ **Private Comparison**: Submit your FDV and compare against market benchmarks  
✅ **Zero Disclosure**: Your actual valuation remains encrypted end-to-end  
✅ **On-Chain Verification**: All computations are verifiable on Ethereum  
✅ **Instant Intelligence**: Know your position without revealing your terms

---

## 🚀 Features

### Core Functionality
- **Encrypted FDV Submission**: Users input their KOL round valuation (in millions)
- **FHE Computation**: Smart contract compares encrypted values against benchmark (100M)
- **Private Results**: Only the user can decrypt whether they're above or below average
- **Zero Knowledge**: Not even the contract can see plaintext values

### Technical Highlights
- Built with **FHEVM v0.9** on Ethereum Sepolia
- Uses **Zama Relayer SDK 0.3.0-5** for client-side operations
- **Next.js 15** + **React 19** frontend
- **RainbowKit** + **Wagmi** for seamless wallet integration
- **Tailwind CSS** for beautiful, responsive UI

---

## 🏗️ Architecture

### Smart Contract (`ValuVault.sol`)
```solidity
// Privacy-preserving comparison using FHE
- Benchmark: 100M (encrypted)
- User Input: FDV value (encrypted)
- Computation: FHE.gt(userFDV, benchmark)
- Result: 1 (above) or 0 (below) - encrypted
```

**Key Operations:**
1. `submitFDV()` - Accept encrypted user input and perform FHE comparison
2. `getComparisonResult()` - Return encrypted result handle
3. Dual authorization: `FHE.allowThis()` + `FHE.allow(user)`

**Deployed Contract:**  
`0x5bD92e11aDd45FC80Ef223038568Faba4302728B` (Sepolia)

### Frontend Architecture
- **Landing Page** (`/`): Professional marketing site with value proposition
- **DApp Page** (`/dapp`): Core comparison interface
- **FHEVM Integration**: Client-side encryption/decryption using Relayer SDK
- **Wallet Support**: MetaMask, Coinbase Wallet, WalletConnect, OKX

---

## 📖 How It Works

### User Flow

1. **Connect Wallet**  
   Connect your Web3 wallet (MetaMask, etc.) to the DApp

2. **Enter FDV**  
   Input the valuation you received from the project (e.g., "80" for 80M)

3. **Encrypt & Submit**  
   Your input is encrypted client-side and submitted to the smart contract  
   The contract performs FHE comparison: `userFDV > 100M ?`

4. **Wait for Sync**  
   10-second countdown for permission synchronization on relayer

5. **Decrypt Result**  
   Click decrypt and sign EIP-712 message to view your result:
   - ✅ **Above Benchmark**: Your FDV > 100M
   - 📊 **Below Benchmark**: Your FDV ≤ 100M

### Privacy Guarantees

- **End-to-End Encryption**: Your FDV never exists in plaintext on-chain
- **Homomorphic Operations**: Comparison happens on encrypted data
- **User-Only Decryption**: Only you hold the keys to decrypt results
- **Zero-Knowledge Proofs**: Cryptographic proof of correctness without disclosure

---

## 🛠️ Development

### Prerequisites
- **Node.js** 18+ (with pnpm)
- **MetaMask** or compatible Web3 wallet
- **Sepolia ETH** for gas fees

### Project Structure
```
valuvault/
├── packages/
│   ├── hardhat/              # Smart contracts
│   │   ├── contracts/
│   │   │   └── ValuVault.sol # Main contract
│   │   ├── deploy/
│   │   │   └── deploy_valuvault.ts
│   │   └── .env              # Private key & RPC
│   └── nextjs-showcase/      # Frontend
│       ├── app/
│       │   ├── page.tsx      # Landing page
│       │   └── dapp/
│       │       └── page.tsx  # DApp interface
│       ├── components/
│       │   ├── Providers.tsx
│       │   └── ClientProviders.tsx
│       └── utils/
│           └── wallet.ts     # Provider utilities
└── README.md
```

### Installation

```bash
# Clone repository
cd valuvault

# Install dependencies
pnpm install

# Configure environment (packages/hardhat/.env)
PRIVATE_KEY=your_private_key
ALCHEMY_API_KEY=your_alchemy_key
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}
```

### Compile Contracts

```bash
cd packages/hardhat
pnpm compile
```

### Deploy Contract

```bash
cd packages/hardhat
pnpm run deploy:sepolia
```

### Run Development Server

```bash
cd packages/nextjs-showcase
pnpm dev
```

Visit **http://localhost:3000** (or auto-assigned port)

---

## 🔐 FHEVM Configuration

ValuVault uses Zama's FHEVM system contracts on Sepolia:

```typescript
{
  chainId: 11155111, // Sepolia
  aclContractAddress: '0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D',
  kmsContractAddress: '0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A',
  inputVerifierContractAddress: '0xBBC1fFCdc7C316aAAd72E807D9b0272BE8F84DA0',
  verifyingContractAddressDecryption: '0x5D8BD78e2ea6bbE41f26dFe9fdaEAa349e077478',
  verifyingContractAddressInputVerification: '0x483b9dE06E4E4C7D35CCf5837A1668487406D955',
  gatewayChainId: 10901,
  relayerUrl: 'https://relayer.testnet.zama.org',
}
```

---

## 🎯 Use Cases

### Primary: KOL Round Valuation
- **Scenario**: A KOL receives FDV terms from a Web3 project
- **Action**: Submit valuation to ValuVault
- **Result**: Learn if terms are competitive without disclosing actual numbers

### Future Expansions
- **Multi-Round Tracking**: Compare valuations across multiple funding rounds
- **Percentile Rankings**: See your position in distribution (top 10%, 25%, etc.)
- **Anonymous Aggregation**: Contribute to benchmark calculations
- **Deal Quality Scoring**: Holistic evaluation beyond just FDV
- **Community Insights**: Anonymized market trends and patterns

---

## 🔒 Security & Privacy

### Encryption Model
- **Client-Side Encryption**: All sensitive data encrypted in user's browser
- **FHE Operations**: Computation on ciphertext without decryption
- **Access Control**: Dual authorization model (contract + user permissions)
- **Relayer Security**: Zama's decentralized relayer network

### Limitations
- **Benchmark Transparency**: Current benchmark (100M) is hardcoded and public
- **Result Binary**: Only reveals above/below, not actual difference
- **Single Benchmark**: Future versions will support dynamic benchmarks

### Audit Status
⚠️ **Not Audited** - This is a proof-of-concept for educational purposes. Do not use with production funds.

---

## 📊 Technical Specifications

### Smart Contract
- **Solidity Version**: 0.8.24
- **FHEVM Version**: 0.9.1
- **Network**: Ethereum Sepolia
- **Gas Usage**: ~350k-500k per submission

### Frontend
- **Framework**: Next.js 15.0.3
- **React**: 19.0.0
- **Styling**: Tailwind CSS 3.4.0
- **Wallet Integration**: RainbowKit 2.x + Wagmi 3.x
- **FHE SDK**: Zama Relayer SDK 0.3.0-5

---

## 🌐 Links

- **Live Demo**: http://localhost:3004 (local development)
- **Contract**: [0x5bD92e11aDd45FC80Ef223038568Faba4302728B](https://sepolia.etherscan.io/address/0x5bD92e11aDd45FC80Ef223038568Faba4302728B)
- **Zama Docs**: https://docs.zama.org/fhevm
- **FHEVM GitHub**: https://github.com/zama-ai/fhevm

---

## 🤝 Contributing

ValuVault is open for contributions! Areas of interest:

- **Dynamic Benchmarks**: Multi-project benchmark systems
- **Advanced Analytics**: Percentile rankings, trend analysis
- **UI/UX**: Enhanced visualizations and user experience
- **Testing**: Comprehensive test coverage
- **Documentation**: Tutorials and integration guides

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

Built with:
- **Zama** - FHEVM technology and infrastructure
- **Ethereum** - Decentralized computation platform
- **Next.js** - React framework for production
- **RainbowKit** - Beautiful wallet connection UX
- **Tailwind CSS** - Utility-first styling

---

## 💬 Narrative: The Future of Private Market Intelligence

### The Vision

In traditional finance, information asymmetry has always favored institutions over individuals. Web3 promised to change this, but in practice, the playing field remains uneven. Projects have full visibility into market conditions while individual KOLs negotiate in the dark.

ValuVault represents a new paradigm: **privacy-preserving market intelligence**. By leveraging cutting-edge cryptography (FHE), we enable participants to gain collective wisdom without individual disclosure.

### Business Model Evolution

**Phase 1: Free Public Good**  
- Open-source platform for KOL valuation comparison
- Build trust and adoption in the community
- Demonstrate FHE's practical applications

**Phase 2: Premium Analytics**  
- Percentile rankings and detailed comparisons
- Historical tracking and trend analysis
- Project-specific benchmarks and ratings

**Phase 3: Institutional Platform**  
- White-label solutions for VCs and projects
- Fair launch verification services
- Regulatory compliance tooling

**Phase 4: DeFi Integration**  
- Privacy-preserving credit scoring
- Collateralized lending based on encrypted deal flow
- Automated market makers for allocation rights

### Market Opportunity

- **Total Addressable Market**: 50,000+ crypto KOLs globally
- **KOL Round Volume**: Estimated $500M+ annually
- **Information Gap**: 100% of participants lack visibility
- **Potential Impact**: 10-20% better terms through transparency

### Why Now?

1. **FHE Maturity**: Zama's FHEVM makes practical encrypted computation possible
2. **Market Need**: Bull market drives increased KOL round activity
3. **Privacy Focus**: Growing awareness of data protection in Web3
4. **Community Demand**: KOLs actively seeking fairness and transparency

---

## 🚀 Get Started

**Ready to discover your position?**

1. Visit the [DApp](http://localhost:3004/dapp)
2. Connect your wallet
3. Submit your FDV
4. Gain market intelligence - privately

**Questions or feedback?**  
Open an issue or reach out to the community.

---

**Built with ❤️ and 🔐 by the ValuVault Team**

*Empowering KOLs, One Encrypted Comparison at a Time*
