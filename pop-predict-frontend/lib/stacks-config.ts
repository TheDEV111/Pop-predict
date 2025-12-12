import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network';

// Network configuration - MAINNET DEPLOYMENT
export const NETWORK = STACKS_MAINNET;
export const NETWORK_TYPE = 'mainnet';

// Contract addresses (deployed to mainnet on Dec 12, 2025)
export const CONTRACTS = {
  popPredict: {
    address: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F',
    name: 'pop-predict',
  },
  achievementNFT: {
    address: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F',
    name: 'achievement-nft',
  },
} as const;

// Full contract identifiers
export const POP_PREDICT_CONTRACT = `${CONTRACTS.popPredict.address}.${CONTRACTS.popPredict.name}`;
export const ACHIEVEMENT_NFT_CONTRACT = `${CONTRACTS.achievementNFT.address}.${CONTRACTS.achievementNFT.name}`;

// API endpoints
export const STACKS_API = 'https://api.hiro.so';

// App configuration
export const APP_NAME = 'PopPredict';
export const APP_ICON = '/logo-pop.png';

// Betting limits (in microSTX)
export const MIN_STAKE = 1_000_000; // 1 STX
export const MAX_STAKE = 100_000_000; // 100 STX

// Platform fee
export const PLATFORM_FEE_BPS = 300; // 3%
