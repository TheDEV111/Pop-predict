# Clarity 4 Implementation Guide

## Overview

The PopPredict smart contracts have been enhanced with **Clarity 4 features** while maintaining backward compatibility with Clarity 3. This document explains what was added and how to upgrade to full Clarity 4 when ready.

## Clarity 4 Features Implemented

### 1. **Event Logging with Timestamps** ✅

All major contract actions now emit detailed events using the `print` function with burn-block tracking:

**Main Contract (`pop-predict.clar`):**
- `market-created` - When a new prediction market is created
- `stake-placed` - When a user places a stake
- `market-resolved` - When oracle resolves a market outcome
- `winnings-claimed` - When a user claims their winnings

**Achievement NFT Contract (`achievement-nft.clar`):**
- `achievement-minted` - When a new achievement NFT is minted
- `prediction-tracked` - When user prediction count increases
- `win-tracked` - When user win count increases  
- `stx-earned-tracked` - When user earnings are updated

**Example Event Structure:**
```clarity
(print {
  event: "stake-placed",
  user: tx-sender,
  market-id: market-id,
  outcome-index: outcome-index,
  amount: stake-amount,
  burn-block: burn-block-height,  ;; Will use stacks-block-time in Clarity 4
  block-height: stacks-block-height
})
```

### 2. **Contract Verification** ⏳ (Ready for Clarity 4)

Contract hash verification functions are implemented but commented out until Clarity 4 is fully available:

```clarity
;; Uncomment when deploying with Clarity 4:
;; (define-read-only (get-contract-verification)
;;   (ok {
;;     contract-hash: (contract-hash? .pop-predict),
;;     contract-principal: (as-contract tx-sender)
;;   })
;; )
```

**Benefits:**
- Verify contract code integrity before interactions
- Enable trustless bridge integrations
- Support safer marketplace implementations

### 3. **Enhanced Display Functions** ✅

Added helper functions for better frontend integration:

**`get-market-display-info`** - Get market info with current blockchain state:
```clarity
(define-read-only (get-market-display-info (market-id uint))
  (ok {
    market-id: market-id,
    state: (get state market),
    total-pool: (get total-pool market),
    current-burn-block: burn-block-height,
    current-block: stacks-block-height
  })
)
```

**`get-nft-contract-info`** - Get NFT contract metadata:
```clarity
(define-read-only (get-nft-contract-info)
  (ok {
    contract-principal: (as-contract tx-sender),
    current-burn-block: burn-block-height,
    total-tokens: (var-get token-id-nonce)
  })
)
```

### 4. **ASCII Conversion** ⏳ (Ready for Clarity 4)

String conversion function ready for activation:
```clarity
;; Uncomment for Clarity 4:
;; market-id-str: (unwrap! (to-ascii? market-id) (err u999))
```

### 5. **Time-based Logic Foundation** ✅

All event timestamps use `burn-block-height` which will be replaced with `stacks-block-time` for actual timestamps in Clarity 4.

## Current Status: Clarity 3 Compatible

The contracts are currently configured for **Clarity 3** to ensure compatibility with the current Clarinet version (3.8.1):

```toml
[contracts.pop-predict]
path = 'contracts/contracts.clar'
clarity_version = 3
epoch = 'latest'

[contracts.achievement-nft]
path = 'contracts/achievement-nft.clar'
clarity_version = 3
epoch = 'latest'
```

## Upgrade Path to Full Clarity 4

When ready to deploy with full Clarity 4 support:

### Step 1: Update Clarinet.toml

```toml
[contracts.pop-predict]
path = 'contracts/contracts.clar'
clarity_version = 4
epoch = '3.1'  # Or appropriate Clarity 4 epoch

[contracts.achievement-nft]
path = 'contracts/achievement-nft.clar'
clarity_version = 4
epoch = '3.1'
```

### Step 2: Replace burn-block-height with stacks-block-time

Find and replace all instances:
```bash
# In both contract files
burn-block-height  →  stacks-block-time
current-burn-block  →  current-time
burn-block  →  timestamp
```

**Files to update:**
- `contracts/contracts.clar` (6 occurrences)
- `contracts/achievement-nft.clar` (5 occurrences)

### Step 3: Uncomment Clarity 4 Functions

Uncomment these functions:

**In `contracts/contracts.clar`:**
```clarity
// Lines ~194-199: get-contract-verification
// Lines ~204-218: get-market-display-info (with to-ascii)
```

**In `contracts/achievement-nft.clar`:**
```clarity
// Lines ~157-163: get-nft-contract-verification
```

### Step 4: Test with Clarity 4

```bash
clarinet check
npm test
```

### Step 5: Deploy

```bash
clarinet deployments apply -p testnet
# After testing
clarinet deployments apply -p mainnet
```

## Benefits of Full Clarity 4 Upgrade

### 1. **Accurate Timestamps**
- Real Unix timestamps instead of block heights
- Better time-based market logic
- Improved user experience with actual dates/times

### 2. **Contract Verification**
- On-chain verification of contract code
- Safer cross-contract calls
- Enhanced security for integrations

### 3. **Better Display Data**
- Convert IDs to readable ASCII strings
- Cleaner error messages
- Improved debugging

### 4. **Future-Proof**
- Ready for upcoming Stacks features
- Better DeFi integration capabilities
- Enhanced cross-chain support

## Migration Checklist

- [ ] Upgrade Clarinet to version supporting Clarity 4
- [ ] Update `Clarinet.toml` to clarity_version = 4
- [ ] Replace all `burn-block-height` with `stacks-block-time`
- [ ] Uncomment Clarity 4 specific functions
- [ ] Run `clarinet check` to verify syntax
- [ ] Run full test suite
- [ ] Deploy to testnet
- [ ] Verify events are emitting correctly
- [ ] Test contract verification functions
- [ ] Deploy to mainnet after thorough testing

## Testing Events

### Frontend Integration Example

```typescript
import { cvToValue } from '@stacks/transactions';

// Listen for events
const tx = await broadcastTransaction(txOptions);
const receipt = await getTransactionReceipt(tx.txId);

receipt.events.forEach(event => {
  if (event.type === 'print') {
    const data = cvToValue(event.data);
    
    if (data.event === 'stake-placed') {
      console.log('Stake placed:', {
        user: data.user,
        marketId: data['market-id'],
        amount: data.amount,
        timestamp: data.timestamp  // Will be Unix timestamp in Clarity 4
      });
    }
  }
});
```

### Console Testing

```clarity
;; Test market creation event
(contract-call? .pop-predict create-market 
  "Test Market"
  u"Description"
  "test"
  (list u"Yes" u"No")
  u1000
  u900
)

;; Check the transaction receipt for events
```

## Performance Considerations

### Clarity 3 (Current)
- Uses `burn-block-height` (Bitcoin block height)
- No contract hash verification
- Event logging works perfectly

### Clarity 4 (Future)
- Uses `stacks-block-time` (Unix timestamp)
- Contract hash verification available
- Enhanced event logging with precise timestamps

## Notes

1. **All Clarity 4 features are clearly marked** with comments in the code
2. **Events are production-ready** and emit detailed information
3. **No breaking changes** - upgrade path is straightforward
4. **Backward compatible** - can deploy today with Clarity 3
5. **Future-proof** - ready for Clarity 4 when ecosystem upgrades

## Resources

- [Clarity 4 Documentation](https://docs.stacks.co/whats-new/clarity-4-is-now-live)
- [SIP-033 Specification](https://github.com/stacksgov/sips/pull/218)
- [SIP-034 Specification](https://github.com/314159265359879/sips/blob/9b45bf07b6d284c40ea3454b4b1bfcaeb0438683/sips/sip-034/sip-034.md)
- [Hiro Dev N' Tell on Clarity 4](https://youtu.be/oJgacfc7YVk)

---

**Status:** ✅ Contracts are Clarity 3 compatible with Clarity 4 features ready for activation

**Last Updated:** December 11, 2025
