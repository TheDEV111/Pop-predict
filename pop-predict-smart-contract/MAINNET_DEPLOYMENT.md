# PopPredict Mainnet Deployment Guide

## Prerequisites

Before deploying to mainnet, ensure you have:

1. **A Stacks Wallet with Mainnet STX**
   - You'll need STX for deployment fees (estimated 5-10 STX per contract)
   - Get a wallet at: https://www.hiro.so/wallet

2. **Your Wallet Mnemonic (24-word seed phrase)**
   - ⚠️ **NEVER commit this to git or share it publicly**
   - Keep it secure and backed up

3. **Sufficient STX Balance**
   - Check your balance at: https://explorer.hiro.so/

## Deployment Steps

### Step 1: Configure Mainnet Settings

Edit `settings/Mainnet.toml` and add your mnemonic:

```toml
[network]
name = "mainnet"
stacks_node_rpc_address = "https://api.hiro.so"
deployment_fee_rate = 10

[accounts.deployer]
mnemonic = "your twenty four word seed phrase goes here in quotes exactly as shown in your wallet"
```

⚠️ **SECURITY WARNING**: 
- Never commit this file with your real mnemonic
- Add `settings/Mainnet.toml` to `.gitignore`
- Use environment variables in production

### Step 2: Verify Contract Code

Run final checks:

```bash
# Check syntax
clarinet check

# Run tests
npm test
```

✅ Tests should pass before deployment

### Step 3: Generate Deployment Plan

```bash
clarinet deployments generate --mainnet
```

This creates a deployment plan in `deployments/default.mainnet-plan.yaml`

### Step 4: Review Deployment Plan

Check the generated plan:

```bash
cat deployments/default.mainnet-plan.yaml
```

Verify:
- Contract names are correct
- Deployment order is: `achievement-nft` first, then `pop-predict`
- Estimated fees are acceptable

### Step 5: Deploy to Mainnet

```bash
clarinet deployments apply --mainnet
```

⚠️ This will:
- Deduct STX from your wallet for deployment fees
- Publish contracts to mainnet (irreversible)
- Return contract addresses

### Step 6: Save Contract Addresses

After deployment, you'll receive contract addresses like:
```
SP[YOUR_ADDRESS].achievement-nft
SP[YOUR_ADDRESS].pop-predict
```

**Save these addresses immediately!** You'll need them for:
- Frontend configuration
- Contract interactions
- Future updates

### Step 7: Verify Deployment

Visit the Stacks Explorer:
```
https://explorer.hiro.so/txid/[TRANSACTION_ID]?chain=mainnet
```

Check:
- ✅ Transaction confirmed
- ✅ Contracts deployed successfully
- ✅ No errors in execution

### Step 8: Update Frontend Configuration

Update your frontend to use mainnet contracts:

```typescript
// pop-predict-frontend/lib/contracts-config.ts
export const NETWORK = 'mainnet';
export const CONTRACTS = {
  POPPREDICT: 'SP[YOUR_ADDRESS].pop-predict',
  ACHIEVEMENT_NFT: 'SP[YOUR_ADDRESS].achievement-nft',
};
```

### Step 9: Initialize Contracts (Post-Deployment)

After deployment, initialize the contracts:

1. **Link Achievement NFT contract to PopPredict:**
```clarity
;; Call from achievement-nft contract
(contract-call? .achievement-nft set-poppredict-contract .pop-predict)
```

2. **Set up achievement metadata:**
```clarity
;; Define each achievement type
(contract-call? .achievement-nft set-achievement-metadata 
  u1 
  "First Prediction" 
  u"Made your first prediction on PopPredict"
  "ipfs://YOUR_IPFS_HASH_1"
  true)
```

3. **Create initial markets** (optional)

## Cost Estimation

Typical mainnet deployment costs:

| Item | Estimated Cost |
|------|---------------|
| Achievement NFT Contract | ~2-3 STX |
| Pop-Predict Contract | ~3-5 STX |
| Contract Initialization | ~0.5-1 STX |
| **Total** | **~6-9 STX** |

*Costs vary based on network congestion and contract size*

## Post-Deployment Checklist

- [ ] Contract addresses saved securely
- [ ] Transaction IDs recorded
- [ ] Contracts verified on explorer
- [ ] Achievement NFT linked to PopPredict
- [ ] Achievement metadata initialized
- [ ] Frontend updated with mainnet contracts
- [ ] Oracle address configured (if using external oracle)
- [ ] Treasury address set
- [ ] Test transactions executed successfully

## Security Best Practices

1. **Never commit sensitive data:**
   ```bash
   echo "settings/Mainnet.toml" >> .gitignore
   ```

2. **Use environment variables:**
   - For CI/CD pipelines
   - For automated deployments

3. **Multi-sig for contract ownership:**
   - Consider using a multi-sig wallet for CONTRACT-OWNER
   - Reduces single point of failure

4. **Audit before deployment:**
   - Review all contract code
   - Test thoroughly on testnet
   - Consider professional audit for large deployments

## Rollback Plan

⚠️ **Smart contracts are immutable** - you cannot update them after deployment.

If issues are found:
1. Deploy a new version with fixes
2. Update frontend to use new contract addresses
3. Migrate user data if needed (design for this upfront)

## Support & Resources

- **Stacks Documentation:** https://docs.stacks.co/
- **Clarinet Docs:** https://docs.hiro.so/clarinet/
- **Stacks Discord:** https://discord.gg/stacks
- **Explorer:** https://explorer.hiro.so/

## Alternative: Testnet First

Before mainnet, always test on testnet:

```bash
# Generate testnet plan
clarinet deployments generate --testnet

# Deploy to testnet
clarinet deployments apply --testnet
```

Testnet STX is free from faucets:
- https://explorer.hiro.so/sandbox/faucet?chain=testnet

---

## Quick Deploy Commands

```bash
# 1. Configure your mnemonic in settings/Mainnet.toml

# 2. Run checks
clarinet check && npm test

# 3. Generate plan
clarinet deployments generate --mainnet

# 4. Review plan
cat deployments/default.mainnet-plan.yaml

# 5. Deploy (IRREVERSIBLE!)
clarinet deployments apply --mainnet

# 6. Save contract addresses and transaction IDs
```

Good luck with your deployment! 🚀
