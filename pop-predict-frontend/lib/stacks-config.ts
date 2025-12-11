import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';

// Network configuration
export const NETWORK = STACKS_TESTNET;
export const NETWORK_TYPE = 'testnet';

// Contract addresses (from deployment)
export const CONTRACTS = {
  popPredict: {
    address: 'STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68',
    name: 'pop-predict',
  },
  achievementNFT: {
    address: 'STVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2BKDND68',
    name: 'achievement-nft',
  },
} as const;

// Full contract identifiers
export const POP_PREDICT_CONTRACT = `${CONTRACTS.popPredict.address}.${CONTRACTS.popPredict.name}`;
export const ACHIEVEMENT_NFT_CONTRACT = `${CONTRACTS.achievementNFT.address}.${CONTRACTS.achievementNFT.name}`;

// API endpoints
export const STACKS_API = 'https://api.testnet.hiro.so';

// App configuration
export const APP_NAME = 'PopPredict';
export const APP_ICON = '/logo-pop.png';

// Betting limits (in microSTX)
export const MIN_STAKE = 1_000_000; // 1 STX
export const MAX_STAKE = 100_000_000; // 100 STX

// Platform fee
export const PLATFORM_FEE_BPS = 300; // 3%
