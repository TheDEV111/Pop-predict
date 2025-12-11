# PopPredict

<div align="center">

![PopPredict](https://img.shields.io/badge/Stacks-Blockchain-5546FF?style=for-the-badge&logo=stacks&logoColor=white)
![Clarity](https://img.shields.io/badge/Clarity-4-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white)

**Decentralized Pop Culture Prediction Markets on Stacks Blockchain**

[Live Demo](https://poppredict.app) • [Documentation](./pop-predict-smart-contract/CONTRACT_README.md) • [Deployment](./pop-predict-smart-contract/DEPLOYMENT.md)

</div>

---

## 🎯 Overview

PopPredict is a decentralized prediction market platform for pop culture events, built on the Stacks blockchain. Users can create markets, place bets on outcomes, and earn STX tokens based on their predictions. The platform features achievement NFTs that track user performance and milestone achievements.

### Key Features

- 🎲 **Parimutuel Betting** - Pool-based betting with dynamic odds
- 🏆 **Achievement NFTs** - Soulbound tokens for tracking milestones
- 🔐 **Decentralized** - Powered by Clarity 4 smart contracts
- 💜 **Stacks Native** - Built on Bitcoin's Layer 2
- ⚡ **Real-time Markets** - Live odds and market updates
- 🎨 **Modern UI** - Beautiful Next.js frontend

---

## 📁 Project Structure

```
Pop-predict/
├── pop-predict-smart-contract/     # Clarity smart contracts
│   ├── contracts/
│   │   ├── contracts.clar          # Main prediction market contract
│   │   └── achievement-nft.clar    # SIP-009 NFT contract
│   ├── tests/                      # Contract tests
│   ├── deployments/                # Deployment configurations
│   ├── settings/                   # Network settings
│   ├── CONTRACT_README.md          # Contract documentation
│   ├── CLARITY4_GUIDE.md          # Clarity 4 features guide
│   └── DEPLOYMENT.md              # Deployment details
│
└── pop-predict-frontend/           # Next.js web application
    ├── app/                        # Next.js 15 app directory
    ├── components/                 # React components (coming soon)
    ├── lib/                        # Utilities and helpers
    ├── public/                     # Static assets
    └── package.json               # Dependencies
```

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ and [pnpm](https://pnpm.io/)
- [Clarinet](https://github.com/hirosystems/clarinet) v3.11.0+
- [Leather Wallet](https://leather.io/) or [Hiro Wallet](https://wallet.hiro.so/)
- Testnet STX tokens (get from [faucet](https://explorer.hiro.so/sandbox/faucet?chain=testnet))

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Pop-predict.git
cd Pop-predict
```

### 2. Smart Contract Setup

```bash
cd pop-predict-smart-contract

# Check contracts
clarinet check

# Run tests
npm install
npm test

# Deploy to testnet (configure settings/Testnet.toml first)
clarinet deployments generate --testnet --medium-cost
clarinet deployments apply -p deployments/default.testnet-plan.yaml
```

### 3. Frontend Setup

```bash
cd ../pop-predict-frontend

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

---

## 📝 Smart Contracts

### Deployed Contracts (Testnet)

| Contract | Address | Explorer |
|----------|---------|----------|
| **pop-predict** | `STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68.pop-predict` | [View](https://explorer.hiro.so/txid/STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68.pop-predict?chain=testnet) |
| **achievement-nft** | `STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68.achievement-nft` | [View](https://explorer.hiro.so/txid/STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68.achievement-nft?chain=testnet) |

### Contract Features

**pop-predict.clar:**
- Create binary or multi-outcome prediction markets
- Place stakes between 1-100 STX
- Oracle-based market resolution
- Parimutuel odds calculation
- 3% platform fee
- Event logging with timestamps

**achievement-nft.clar:**
- SIP-009 compliant NFT standard
- Soulbound tokens (non-transferable)
- Automatic milestone minting
- User stat tracking (predictions, wins, earnings)

For detailed contract documentation, see [CONTRACT_README.md](./pop-predict-smart-contract/CONTRACT_README.md)

---

## 🎨 Frontend Architecture

### Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS with custom Stacks theme
- **Blockchain:** Stacks.js for wallet integration
- **State Management:** React Context + Hooks
- **UI Components:** Radix UI (coming soon)
- **Forms:** React Hook Form + Zod validation

### Key Pages (Coming Soon)

- `/` - Homepage with featured markets
- `/markets` - Browse all prediction markets
- `/market/[id]` - Market detail and betting interface
- `/portfolio` - User's active stakes and history
- `/achievements` - NFT achievement gallery
- `/create` - Create new prediction market

---

## 🔧 Development

### Smart Contracts

```bash
cd pop-predict-smart-contract

# Run console for testing
clarinet console

# Check for errors
clarinet check

# Run unit tests
npm test
```

### Frontend

```bash
cd pop-predict-frontend

# Development
pnpm dev

# Build
pnpm build

# Production
pnpm start

# Linting
pnpm lint
```

---

## 🧪 Testing

### Contract Tests

```bash
cd pop-predict-smart-contract
npm test
```

Tests cover:
- Market creation and validation
- Stake placement and tracking
- Parimutuel odds calculation
- Market resolution and winnings distribution
- NFT minting and stat tracking
- Edge cases and error handling

### Frontend Tests (Coming Soon)

```bash
cd pop-predict-frontend
pnpm test
```

---

## 📖 Documentation

- **[Contract Documentation](./pop-predict-smart-contract/CONTRACT_README.md)** - Complete smart contract API reference
- **[Clarity 4 Guide](./pop-predict-smart-contract/CLARITY4_GUIDE.md)** - Clarity 4 features and migration
- **[Deployment Guide](./pop-predict-smart-contract/DEPLOYMENT.md)** - Testnet/mainnet deployment instructions
- **[API Documentation](#)** - Frontend integration guide (coming soon)

---

## 🎯 Roadmap

### Phase 1: MVP ✅
- [x] Core smart contracts (prediction market + NFTs)
- [x] Clarity 4 implementation
- [x] Testnet deployment
- [x] Frontend theme and design system
- [ ] Basic UI components
- [ ] Wallet integration

### Phase 2: Features 🚧
- [ ] Market browsing and filtering
- [ ] Betting interface
- [ ] Portfolio dashboard
- [ ] Achievement gallery
- [ ] Market creation UI

### Phase 3: Enhancement 📋
- [ ] Advanced market types
- [ ] Liquidity pools
- [ ] Governance token
- [ ] Mobile app
- [ ] Mainnet deployment

### Phase 4: Scale 🚀
- [ ] Multi-oracle support
- [ ] Cross-chain bridge
- [ ] API for third-party integrations
- [ ] Advanced analytics

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation
- Keep commits atomic and descriptive

---

## 🔒 Security

### Testnet Warning

⚠️ **Current deployment is on TESTNET only.** Do not use with real funds until:

- Complete security audit
- Extensive testing
- Bug bounty program
- Community review
- Mainnet readiness

### Reporting Issues

Found a security vulnerability? Please email security@poppredict.app instead of opening a public issue.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Stacks Foundation](https://stacks.org/) - Blockchain infrastructure
- [Hiro](https://hiro.so/) - Developer tools and Clarinet
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## 📞 Contact

- **Website:** [poppredict.app](#)
- **Twitter:** [@PopPredict](#)
- **Discord:** [Join our community](#)
- **Email:** hello@poppredict.app

---

<div align="center">

**Built with 💜 on Stacks**

[Website](#) • [Docs](./pop-predict-smart-contract/CONTRACT_README.md) • [Twitter](#) • [Discord](#)

</div>
