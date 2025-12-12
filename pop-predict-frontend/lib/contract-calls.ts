/**
 * Contract Interaction Utilities
 * Helper functions for interacting with PopPredict smart contracts
 */

import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
  listCV,
  principalCV,
  FungibleConditionCode,
  makeStandardSTXPostCondition,
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';
import { CONTRACTS } from './contracts-config';

const network = new StacksMainnet();

/**
 * Create a new prediction market
 */
export async function createMarket(
  senderKey: string,
  title: string,
  description: string,
  category: string,
  outcomes: string[],
  lockDate: number
) {
  const [contractAddress, contractName] = CONTRACTS.POPPREDICT.split('.');
  
  const outcomesCVs = outcomes.map((outcome) => stringAsciiCV(outcome));

  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'create-market',
    functionArgs: [
      stringAsciiCV(title),
      stringUtf8CV(description),
      stringAsciiCV(category),
      listCV(outcomesCVs),
      uintCV(lockDate),
    ],
    senderKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction({ transaction, network });

  return broadcastResponse;
}

/**
 * Place a bet on a market outcome
 */
export async function placeBet(
  senderAddress: string,
  senderKey: string,
  marketId: number,
  outcomeIndex: number,
  amount: number
) {
  const [contractAddress, contractName] = CONTRACTS.POPPREDICT.split('.');

  // Add post condition to ensure STX transfer
  const postConditions = [
    makeStandardSTXPostCondition(
      senderAddress,
      FungibleConditionCode.Equal,
      amount
    ),
  ];

  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'place-stake',
    functionArgs: [uintCV(marketId), uintCV(outcomeIndex), uintCV(amount)],
    senderKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditions,
    postConditionMode: PostConditionMode.Deny,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction({ transaction, network });

  return broadcastResponse;
}

/**
 * Claim winnings from a resolved market
 */
export async function claimWinnings(
  senderKey: string,
  marketId: number
) {
  const [contractAddress, contractName] = CONTRACTS.POPPREDICT.split('.');

  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'claim-winnings',
    functionArgs: [uintCV(marketId)],
    senderKey,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);
  const broadcastResponse = await broadcastTransaction({ transaction, network });

  return broadcastResponse;
}

/**
 * Get market details (read-only)
 */
export async function getMarket(marketId: number) {
  const [contractAddress, contractName] = CONTRACTS.POPPREDICT.split('.');
  
  const url = `${network.coreApiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-market`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: contractAddress,
      arguments: [uintCV(marketId).serialize().toString('hex')],
    }),
  });

  return response.json();
}

/**
 * Get user's stake in a market (read-only)
 */
export async function getUserStake(userAddress: string, marketId: number) {
  const [contractAddress, contractName] = CONTRACTS.POPPREDICT.split('.');
  
  const url = `${network.coreApiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-user-stake`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: userAddress,
      arguments: [
        principalCV(userAddress).serialize().toString('hex'),
        uintCV(marketId).serialize().toString('hex'),
      ],
    }),
  });

  return response.json();
}

/**
 * Get user's achievement stats (read-only)
 */
export async function getUserStats(userAddress: string) {
  const [contractAddress, contractName] = CONTRACTS.ACHIEVEMENT_NFT.split('.');
  
  const url = `${network.coreApiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-user-stats`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: userAddress,
      arguments: [principalCV(userAddress).serialize().toString('hex')],
    }),
  });

  return response.json();
}
