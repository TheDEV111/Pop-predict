# PopPredict Smart Contract Deployment

## Testnet Deployment Information

**Deployment Date:** December 11, 2025  
**Network:** Stacks Testnet  
**Clarity Version:** 4  
**Epoch:** 3.3

---

## Deployed Contracts

### 1. Achievement NFT Contract
- **Contract Name:** `achievement-nft`
- **Full Contract ID:** `STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68.achievement-nft`
- **Deployment Cost:** 0.342548 STX
- **Status:** ✅ Confirmed
- **Explorer:** https://explorer.hiro.so/txid/STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68.achievement-nft?chain=testnet

**Purpose:** SIP-009 compliant NFT contract for minting achievement badges to users based on their prediction market performance.

**Key Features:**
- Soulbound tokens (non-transferable)
- Automatic minting on milestones
- Stat tracking (predictions, wins, STX earned)
- Multiple achievement types

---

### 2. Pop Predict Contract
- **Contract Name:** `pop-predict`
- **Full Contract ID:** `STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68.pop-predict`
- **Deployment Cost:** 0.344509 STX
- **Status:** ✅ Confirmed
- **Explorer:** https://explorer.hiro.so/txid/STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68.pop-predict?chain=testnet

**Purpose:** Main prediction market contract for creating and managing pop culture event betting markets.

**Key Features:**
- Parimutuel betting system
- Binary and multi-outcome markets
- Oracle-based resolution
- 3% platform fee
- Event logging with timestamps

---

## Deployment Details

### Deployer Account
- **Address:** `STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68`
- **Network:** Testnet
- **Initial Roles:**
  - Contract Owner
  - Oracle Address
  - Treasury Address

### Total Deployment Cost
- **Achievement NFT:** 0.342548 STX
- **Pop Predict:** 0.344509 STX
- **Total:** 0.687057 STX

### RPC Endpoint
- **Testnet Node:** https://api.testnet.hiro.so

---

## Contract Addresses for Frontend Integration

```javascript
// Stacks Testnet Configuration
const NETWORK = 'testnet';
const STACKS_TESTNET_API = 'https://api.testnet.hiro.so';

const CONTRACTS = {
  popPredict: {
    address: 'STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68',
    name: 'pop-predict'
  },
  achievementNFT: {
    address: 'STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68',
    name: 'achievement-nft'
  }
};

// Full contract identifiers
const POP_PREDICT_CONTRACT = 'STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68.pop-predict';
const ACHIEVEMENT_NFT_CONTRACT = 'STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68.achievement-nft';
```

---

## TypeScript/Stacks.js Integration

```typescript
import { 
  makeContractCall,
  PostConditionMode,
  AnchorMode,
  uintCV,
  stringAsciiCV
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

const network = new StacksTestnet();

// Example: Create a market
async function createMarket(
  title: string,
  description: string,
  category: string,
  outcomeCount: number,
  lockDate: number,
  resolutionDate: number
) {
  const txOptions = {
    contractAddress: 'STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68',
    contractName: 'pop-predict',
    functionName: 'create-market',
    functionArgs: [
      stringAsciiCV(title),
      stringUtf8CV(description),
      stringAsciiCV(category),
      uintCV(outcomeCount),
      uintCV(lockDate),
      uintCV(resolutionDate)
    ],
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  return makeContractCall(txOptions);
}
```

---

## Public Functions Available

### Pop Predict Contract

**Market Management:**
- `create-market` - Create a new prediction market
- `lock-market` - Lock market to prevent new stakes
- `resolve-market` - Oracle resolves market with winning outcome
- `cancel-market` - Cancel market and enable refunds

**User Actions:**
- `place-stake` - Place a bet on a market outcome (1-100 STX)
- `claim-winnings` - Claim winnings from resolved market
- `get-refund` - Get refund from cancelled market

**Read-Only Functions:**
- `get-market` - Get market details
- `get-user-stake` - Get user's stake info
- `calculate-winnings` - Calculate potential winnings
- `get-market-display-info` - Get market with blockchain state
- `get-contract-verification` - Get contract hash (Clarity 4)

**Admin Functions:**
- `set-oracle-address` - Update oracle address
- `set-treasury-address` - Update treasury address
- `set-platform-fee` - Update platform fee (max 10%)
- `authorize-creator` - Authorize market creators
- `pause-contract` / `unpause-contract` - Emergency controls

### Achievement NFT Contract

**NFT Functions:**
- `mint-achievement` - Mint achievement badge
- `define-achievement-type` - Define new achievement types

**Stat Tracking (Called by main contract):**
- `increment-predictions` - Track user prediction
- `increment-wins` - Track user win
- `add-stx-earned` - Track STX earned

**Read-Only Functions:**
- `get-user-stats` - Get user statistics
- `get-achievement-metadata` - Get achievement details
- `get-owner` - Get NFT owner
- `get-nft-contract-verification` - Get contract hash

---

## Clarity 4 Features Enabled

✅ **contract-hash?** - Contract verification and integrity checks  
✅ **to-ascii?** - String conversion for display  
✅ **stacks-block-time** - Unix timestamp for events  
✅ **current-contract** - Contract principal reference  

---

## Testing on Testnet

### Prerequisites
1. Leather Wallet or Hiro Wallet with testnet mode enabled
2. Testnet STX from faucet: https://explorer.hiro.so/sandbox/faucet?chain=testnet

### Test Scenarios

**1. Create a Market**
```clarity
(contract-call? .pop-predict create-market
  "Will Taylor Swift win Best Album?"
  "Grammy Awards 2026 prediction market"
  "Music Awards"
  u2  ;; Binary: Yes/No
  u1000000  ;; Lock at block 1000000
  u1000500  ;; Resolve at block 1000500
)
```

**2. Place a Stake**
```clarity
(contract-call? .pop-predict place-stake
  u1  ;; Market ID
  u0  ;; Outcome index (0 = Yes)
  u10000000  ;; 10 STX
)
```

**3. Check Your Stake**
```clarity
(contract-call? .pop-predict get-user-stake
  u1  ;; Market ID
  tx-sender
)
```

---

## Security Considerations

### Testnet Environment
⚠️ **This is a testnet deployment** - Do NOT use with real funds on mainnet without:
- Complete security audit
- Extensive testing
- Bug bounty program
- Community review

### Known Limitations
- Oracle is centralized (controlled by contract owner)
- No dispute resolution mechanism
- Platform fee is fixed after market creation
- Markets cannot be modified after creation

### Recommended Security Practices
1. Always verify contract addresses before interaction
2. Check market details before placing stakes
3. Understand parimutuel betting mechanics
4. Be aware of platform fees (3%)
5. Know lock and resolution dates before betting

---

## Support & Resources

### Documentation
- **Contract README:** [CONTRACT_README.md](./CONTRACT_README.md)
- **Clarity 4 Guide:** [CLARITY4_GUIDE.md](./CLARITY4_GUIDE.md)

### Explorers
- **Testnet Explorer:** https://explorer.hiro.so/?chain=testnet
- **Contract Source:** View on explorer using contract IDs above

### RPC Endpoints
- **Testnet API:** https://api.testnet.hiro.so
- **Testnet Bitcoin Node:** http://blockstack:blockstacksystem@bitcoind.testnet.stacks.co:18332

### Development Tools
- **Clarinet:** v3.11.0
- **Clarity Version:** 4
- **Stacks.js:** Latest version recommended

---

## Mainnet Deployment Checklist

Before deploying to mainnet:

- [ ] Complete security audit
- [ ] Comprehensive test coverage
- [ ] Frontend integration tested
- [ ] Oracle mechanism reviewed
- [ ] Fee structure validated
- [ ] Emergency pause mechanism tested
- [ ] Multi-sig for admin functions
- [ ] Bug bounty program launched
- [ ] Community review completed
- [ ] Legal compliance verified
- [ ] Documentation finalized
- [ ] Monitoring and alerting setup

---

## Contact & Updates

**Project Repository:** [Your GitHub URL]  
**Deployment Timestamp:** Block confirmed on December 11, 2025  
**Network Status:** https://status.hiro.so/

---

*Last Updated: December 11, 2025*
