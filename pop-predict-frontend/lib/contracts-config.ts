import { StacksMainnet } from '@stacks/network';

// Network Configuration
export const NETWORK = new StacksMainnet();

// Deployed Contract Addresses (Mainnet)
export const CONTRACTS = {
  ACHIEVEMENT_NFT: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.achievement-nft',
  POPPREDICT: 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F.pop-predict',
};

// Deployer/Contract Owner Address
export const DEPLOYER_ADDRESS = 'SPVQ61FEWR6M4HVAT3BNE07D4BNW6A1C2ACCNQ6F';

// Network Details
export const NETWORK_CONFIG = {
  name: 'mainnet',
  chainId: 1,
  coreApiUrl: 'https://api.hiro.so',
  explorerUrl: 'https://explorer.hiro.so',
};

// Contract URLs for Explorer
export const EXPLORER_LINKS = {
  achievementNft: `${NETWORK_CONFIG.explorerUrl}/address/${CONTRACTS.ACHIEVEMENT_NFT}?chain=mainnet`,
  popPredict: `${NETWORK_CONFIG.explorerUrl}/address/${CONTRACTS.POPPREDICT}?chain=mainnet`,
  deployer: `${NETWORK_CONFIG.explorerUrl}/address/${DEPLOYER_ADDRESS}?chain=mainnet`,
};
