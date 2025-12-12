/**
 * Initialize PopPredict Contracts on Mainnet
 * Run this script after deploying contracts to mainnet
 * 
 * Usage: node scripts/initialize-mainnet.js
 */

const {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
  boolCV,
  principalCV,
} = require('@stacks/transactions');
const { StacksMainnet } = require('@stacks/network');

// Load environment variables
require('dotenv').config();

const network = new StacksMainnet();

// Configuration - UPDATE THESE AFTER DEPLOYMENT
const DEPLOYER_ADDRESS = 'SP...'; // Your deployer address
const ACHIEVEMENT_NFT_CONTRACT = `${DEPLOYER_ADDRESS}.achievement-nft`;
const POPPREDICT_CONTRACT = `${DEPLOYER_ADDRESS}.pop-predict`;
const PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY; // Derive from mnemonic

// Achievement metadata to initialize
const ACHIEVEMENTS = [
  {
    id: 1,
    name: 'First Prediction',
    description: 'Made your first prediction on PopPredict',
    imageUri: 'ipfs://QmYOUR_IPFS_HASH_1', // Upload to IPFS first
  },
  {
    id: 2,
    name: 'First Win',
    description: 'Won your first prediction market',
    imageUri: 'ipfs://QmYOUR_IPFS_HASH_2',
  },
  {
    id: 3,
    name: 'Five Wins',
    description: 'Won 5 prediction markets',
    imageUri: 'ipfs://QmYOUR_IPFS_HASH_3',
  },
  {
    id: 4,
    name: 'Ten Wins',
    description: 'Won 10 prediction markets',
    imageUri: 'ipfs://QmYOUR_IPFS_HASH_4',
  },
  {
    id: 5,
    name: 'Hundred STX Earned',
    description: 'Earned over 100 STX from predictions',
    imageUri: 'ipfs://QmYOUR_IPFS_HASH_5',
  },
  {
    id: 6,
    name: 'Perfect Week',
    description: 'Won all predictions in a week',
    imageUri: 'ipfs://QmYOUR_IPFS_HASH_6',
  },
  {
    id: 7,
    name: 'Early Adopter',
    description: 'One of the first users of PopPredict',
    imageUri: 'ipfs://QmYOUR_IPFS_HASH_7',
  },
  {
    id: 8,
    name: 'Whale',
    description: 'Placed a bet over 50 STX',
    imageUri: 'ipfs://QmYOUR_IPFS_HASH_8',
  },
  {
    id: 9,
    name: 'Consistent Trader',
    description: 'Made predictions for 30 days straight',
    imageUri: 'ipfs://QmYOUR_IPFS_HASH_9',
  },
  {
    id: 10,
    name: 'Category Master',
    description: 'Won 10+ predictions in a single category',
    imageUri: 'ipfs://QmYOUR_IPFS_HASH_10',
  },
];

async function linkContracts() {
  console.log('🔗 Linking Achievement NFT to PopPredict contract...');
  
  const [contractAddress, contractName] = ACHIEVEMENT_NFT_CONTRACT.split('.');
  
  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'set-poppredict-contract',
    functionArgs: [principalCV(POPPREDICT_CONTRACT)],
    senderKey: PRIVATE_KEY,
    network,
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction({ transaction, network });
  
  console.log('✅ Transaction broadcasted:', broadcastResponse.txid);
  console.log(`   View: https://explorer.hiro.so/txid/${broadcastResponse.txid}?chain=mainnet`);
  
  return broadcastResponse.txid;
}

async function initializeAchievements() {
  console.log('\n🏆 Initializing achievement metadata...');
  
  const [contractAddress, contractName] = ACHIEVEMENT_NFT_CONTRACT.split('.');
  const txIds = [];
  
  for (const achievement of ACHIEVEMENTS) {
    console.log(`   Setting up: ${achievement.name}`);
    
    const txOptions = {
      contractAddress,
      contractName,
      functionName: 'set-achievement-metadata',
      functionArgs: [
        uintCV(achievement.id),
        stringAsciiCV(achievement.name),
        stringUtf8CV(achievement.description),
        stringAsciiCV(achievement.imageUri),
        boolCV(true),
      ],
      senderKey: PRIVATE_KEY,
      network,
      anchorMode: AnchorMode.Any,
    };

    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction({ transaction, network });
    
    console.log(`   ✅ ${achievement.name}: ${broadcastResponse.txid}`);
    txIds.push(broadcastResponse.txid);
    
    // Wait a bit between transactions to avoid nonce issues
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  return txIds;
}

async function setOracleAddress(oracleAddress) {
  console.log('\n🔮 Setting oracle address...');
  
  const [contractAddress, contractName] = POPPREDICT_CONTRACT.split('.');
  
  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'set-oracle-address',
    functionArgs: [principalCV(oracleAddress)],
    senderKey: PRIVATE_KEY,
    network,
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction({ transaction, network });
  
  console.log('✅ Transaction broadcasted:', broadcastResponse.txid);
  return broadcastResponse.txid;
}

async function main() {
  console.log('🚀 PopPredict Mainnet Initialization\n');
  console.log('Network:', network.coreApiUrl);
  console.log('Achievement NFT:', ACHIEVEMENT_NFT_CONTRACT);
  console.log('PopPredict:', POPPREDICT_CONTRACT);
  console.log('---\n');

  if (!PRIVATE_KEY) {
    console.error('❌ Error: MAINNET_PRIVATE_KEY not set in environment');
    console.error('   Set it in .env file or export MAINNET_PRIVATE_KEY=...');
    process.exit(1);
  }

  try {
    // Step 1: Link contracts
    await linkContracts();
    
    // Wait for transaction to confirm
    console.log('\n⏳ Waiting 30 seconds for transaction to confirm...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    // Step 2: Initialize achievements
    await initializeAchievements();
    
    // Step 3: Set oracle (optional)
    if (process.env.ORACLE_ADDRESS) {
      await setOracleAddress(process.env.ORACLE_ADDRESS);
    }
    
    console.log('\n✨ Initialization complete!');
    console.log('\nNext steps:');
    console.log('1. Wait for all transactions to confirm');
    console.log('2. Verify on explorer: https://explorer.hiro.so/');
    console.log('3. Update frontend with contract addresses');
    console.log('4. Create your first market!');
    
  } catch (error) {
    console.error('\n❌ Error during initialization:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { linkContracts, initializeAchievements, setOracleAddress };
