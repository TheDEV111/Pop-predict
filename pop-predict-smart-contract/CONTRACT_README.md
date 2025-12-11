# PopPredict Smart Contracts

Professional smart contracts for the PopPredict decentralized prediction market platform.

## Overview

PopPredict is a prediction market for pop culture events built on the Stacks blockchain. Users can stake STX tokens on outcomes of entertainment events like movie box office performance, award show winners, and sports championships.

## Contracts

### 1. `pop-predict.clar` - Main Market Contract

The core contract handling all market creation, staking, resolution, and winnings distribution.

#### Key Features

- **Market Creation**: Admin-controlled market creation with binary and multiple-choice outcomes
- **Parimutuel Betting**: Pool-based betting system with dynamic odds
- **Smart Escrow**: Automatic STX custody and distribution
- **Oracle Resolution**: Trusted oracle system for market resolution
- **Fee Collection**: 3% platform fee (adjustable by admin)
- **Emergency Controls**: Pause mechanism and market cancellation

#### Market Lifecycle

1. **Active**: Users can stake STX on outcomes
2. **Locked**: Betting closed, waiting for event outcome
3. **Resolved**: Outcome determined, winners can claim
4. **Cancelled**: Market cancelled, full refunds available

#### Key Functions

##### Admin Functions
- `create-market`: Create a new prediction market
- `set-oracle-address`: Update oracle address
- `set-treasury-address`: Update treasury address
- `set-platform-fee`: Adjust platform fee (max 10%)
- `toggle-pause`: Emergency pause mechanism
- `authorize-creator`: Add authorized market creators

##### User Functions
- `place-stake`: Stake STX on a market outcome
- `claim-winnings`: Claim winnings after market resolution
- `claim-refund`: Get refund if market is cancelled

##### Oracle Functions
- `lock-market`: Lock market when betting period ends
- `resolve-market`: Set winning outcome and distribute fees

##### Read-Only Functions
- `get-market`: Get market details
- `get-user-stake`: Check user's stake in a market
- `get-current-odds`: Calculate current odds for an outcome
- `calculate-potential-winnings`: Estimate potential winnings
- `get-contract-info`: Get contract configuration

#### Constants

- **Staking Limits**: 1-100 STX per stake
- **Platform Fee**: 3% (300 basis points)
- **Max Outcomes**: 10 per market
- **Min Outcomes**: 2 per market

#### Error Codes

| Code | Error | Description |
|------|-------|-------------|
| u100 | ERR-NOT-AUTHORIZED | Caller not authorized |
| u101 | ERR-MARKET-NOT-FOUND | Market does not exist |
| u102 | ERR-INVALID-MARKET-STATE | Invalid market state transition |
| u103 | ERR-INVALID-OUTCOME | Invalid outcome index |
| u104 | ERR-STAKE-TOO-LOW | Stake below minimum (1 STX) |
| u105 | ERR-STAKE-TOO-HIGH | Stake above maximum (100 STX) |
| u106 | ERR-MARKET-CLOSED | Market no longer accepting stakes |
| u107 | ERR-MARKET-NOT-RESOLVED | Market not yet resolved |
| u108 | ERR-NO-WINNINGS | User has no winnings to claim |
| u109 | ERR-ALREADY-CLAIMED | Winnings already claimed |
| u110 | ERR-INVALID-ORACLE | Caller is not authorized oracle |
| u111 | ERR-MARKET-LOCKED | Market is locked |
| u112 | ERR-MARKET-ALREADY-RESOLVED | Market already resolved |
| u113 | ERR-PAUSED | Contract is paused |
| u114 | ERR-INVALID-FEE | Fee exceeds maximum |
| u115 | ERR-TRANSFER-FAILED | STX transfer failed |

---

### 2. `achievement-nft.clar` - Achievement NFT Contract

SIP-009 style NFT contract for user achievements and milestones.

#### Key Features

- **Soulbound NFTs**: Achievement NFTs cannot be transferred (locked to owner)
- **Automatic Minting**: Achievements auto-mint when milestones are reached
- **Stat Tracking**: Tracks user predictions, wins, and earnings
- **Extensible Metadata**: Admin-configurable achievement metadata

#### Achievement Types

| ID | Name | Description | Trigger |
|----|------|-------------|---------|
| 1 | First Prediction | Made your first prediction | 1st stake placed |
| 2 | First Win | Won your first market | 1st win |
| 3 | Rising Star | Won 5 markets | 5 wins |
| 4 | Prophet | Won 10 markets | 10 wins |
| 5 | Century Club | Earned 100 STX total | 100 STX earned |
| 6 | Perfect Week | - | Future implementation |
| 7 | Early Adopter | - | Future implementation |
| 8 | Whale | - | Future implementation |
| 9 | Consistent Trader | - | Future implementation |
| 10 | Category Master | - | Future implementation |

#### Key Functions

##### Admin Functions
- `set-poppredict-contract`: Set authorized PopPredict contract
- `set-achievement-metadata`: Configure achievement details
- `mint-achievement`: Manually mint achievement (admin only)

##### Tracking Functions (Called by PopPredict contract)
- `increment-predictions`: Track new prediction placed
- `increment-wins`: Track new win
- `add-stx-earned`: Track STX earnings

##### Read-Only Functions
- `get-user-achievement`: Check if user has specific achievement
- `has-achievement`: Boolean check for achievement ownership
- `get-achievement-metadata-info`: Get achievement details
- `get-user-stats-info`: Get user statistics

##### SIP-009 Functions
- `get-last-token-id`: Get latest token ID
- `get-token-uri`: Get token metadata URI
- `get-owner`: Get token owner
- `transfer`: Disabled (soulbound tokens)

#### Error Codes

| Code | Error | Description |
|------|-------|-------------|
| u200 | ERR-NOT-AUTHORIZED | Caller not authorized |
| u201 | ERR-NOT-FOUND | Achievement or token not found |
| u202 | ERR-ALREADY-EXISTS | User already has achievement |
| u203 | ERR-INVALID-ACHIEVEMENT | Invalid achievement type |
| u204 | ERR-ACHIEVEMENT-LOCKED | Achievements are soulbound |

---

## Technical Specifications

### Clarity Version
- **Version**: 3 (Clarity 4 compatible with epoch update)
- **Epoch**: latest

### Data Structures

#### Market Structure
```clarity
{
  title: (string-ascii 256),
  description: (string-utf8 1024),
  category: (string-ascii 50),
  outcomes: (list 10 (string-utf8 256)),
  outcome-count: uint,
  resolution-date: uint,
  lock-date: uint,
  state: (string-ascii 20),
  total-pool: uint,
  winning-outcome: (optional uint),
  creator: principal,
  created-at: uint
}
```

#### User Stake Structure
```clarity
{
  amount: uint,
  timestamp: uint,
  claimed: bool
}
```

#### Achievement Structure
```clarity
{
  token-id: uint,
  earned-at: uint
}
```

---

## Deployment Guide

### Prerequisites

1. Install Clarinet:
```bash
curl -L https://github.com/hirosystems/clarinet/releases/download/v2.0.0/clarinet-linux-x64.tar.gz | tar xz
```

2. Install dependencies:
```bash
npm install
```

### Local Testing

1. Check contract syntax:
```bash
clarinet check
```

2. Run tests:
```bash
npm test
```

3. Start local console:
```bash
clarinet console
```

### Testnet Deployment

1. Configure deployer wallet in `settings/Testnet.toml`

2. Deploy contracts:
```bash
clarinet deployments generate --testnet
clarinet deployments apply -p testnet
```

### Mainnet Deployment

1. Audit contracts thoroughly
2. Configure deployer wallet in `settings/Mainnet.toml`
3. Deploy to mainnet:
```bash
clarinet deployments generate --mainnet
clarinet deployments apply -p mainnet
```

---

## Integration Guide

### Frontend Integration

#### 1. Connect Wallet

```typescript
import { AppConfig, UserSession, showConnect } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

showConnect({
  appDetails: {
    name: 'PopPredict',
    icon: 'https://poppredict.xyz/logo.png',
  },
  onFinish: () => window.location.reload(),
  userSession,
});
```

#### 2. Place a Stake

```typescript
import { openContractCall, uintCV } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';

const placeStake = async (marketId: number, outcomeIndex: number, amount: number) => {
  const network = new StacksTestnet();
  
  await openContractCall({
    network,
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'pop-predict',
    functionName: 'place-stake',
    functionArgs: [
      uintCV(marketId),
      uintCV(outcomeIndex),
      uintCV(amount * 1_000_000) // Convert STX to microSTX
    ],
    onFinish: (data) => {
      console.log('Transaction ID:', data.txId);
    }
  });
};
```

#### 3. Read Market Data

```typescript
import { callReadOnlyFunction, cvToValue } from '@stacks/transactions';

const getMarket = async (marketId: number) => {
  const result = await callReadOnlyFunction({
    network,
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'pop-predict',
    functionName: 'get-market',
    functionArgs: [uintCV(marketId)],
    senderAddress: userAddress,
  });
  
  return cvToValue(result);
};
```

#### 4. Claim Winnings

```typescript
const claimWinnings = async (marketId: number) => {
  await openContractCall({
    network,
    contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    contractName: 'pop-predict',
    functionName: 'claim-winnings',
    functionArgs: [uintCV(marketId)],
    onFinish: (data) => {
      console.log('Winnings claimed!', data.txId);
    }
  });
};
```

---

## Security Considerations

### Implemented Security Features

1. **Authorization Checks**: All admin functions restricted to contract owner
2. **State Validation**: Strict market state machine enforcement
3. **Input Validation**: Bounds checking on all user inputs
4. **Reentrancy Protection**: Using Clarity's built-in protections
5. **STX Transfer Safety**: Unwrap pattern with error handling
6. **Emergency Pause**: Contract can be paused in emergency

### Recommended Practices

1. **Audit**: Get professional smart contract audit before mainnet deployment
2. **Testing**: Comprehensive test coverage for all functions
3. **Gradual Rollout**: Start with TVL caps and gradually increase
4. **Oracle Security**: Use multi-signature oracle addresses
5. **Monitoring**: Real-time monitoring of contract activity
6. **Bug Bounty**: Run bug bounty program post-launch

---

## Testing

### Unit Tests

Run comprehensive tests:
```bash
npm test
```

### Manual Testing in Console

```clarity
;; Deploy contracts
(contract-call? .pop-predict create-market 
  "Will Dune 3 make $500M+ opening weekend?"
  u"Prediction market for Dune 3 box office performance"
  "movies"
  (list u"Yes, $500M+" u"No, under $500M")
  u1000
  u900
)

;; Place stake
(contract-call? .pop-predict place-stake u0 u0 u5000000)

;; Check market
(contract-call? .pop-predict get-market u0)
```

---

## Roadmap

### Phase 1 (Current - MVP)
- ✅ Core market creation and staking
- ✅ Parimutuel betting system
- ✅ Oracle resolution mechanism
- ✅ Achievement NFT system
- ✅ Emergency controls

### Phase 2 (Q1 2026)
- ⏳ Community market creation
- ⏳ Dispute resolution mechanism
- ⏳ Multi-oracle consensus
- ⏳ Range markets (numerical predictions)
- ⏳ Market maker incentives

### Phase 3 (Q2 2026)
- ⏳ DAO governance token
- ⏳ Cross-chain bridges
- ⏳ Advanced achievement system
- ⏳ White label solution
- ⏳ API for third-party integrations

---

## Support

- **Documentation**: [docs.poppredict.xyz](https://docs.poppredict.xyz)
- **Discord**: [discord.gg/poppredict](https://discord.gg/poppredict)
- **Twitter**: [@PopPredict](https://twitter.com/poppredict)
- **Email**: support@poppredict.xyz

---

## License

MIT License - See LICENSE file for details

---

## Contributors

Built with ❤️ by the PopPredict team

---

**⚠️ Disclaimer**: This is experimental software. Use at your own risk. Prediction markets may be regulated in your jurisdiction.
