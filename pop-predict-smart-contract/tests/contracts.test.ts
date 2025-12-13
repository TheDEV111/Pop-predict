import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const address2 = accounts.get("wallet_2")!;
const address3 = accounts.get("wallet_3")!;
const deployer = accounts.get("deployer")!;

describe("PopPredict Smart Contract - Unit Tests", () => {
  beforeEach(() => {
    // Reset simnet state for each test
    simnet.mineEmptyBlocks(1);
  });

  // Helper functions
  const createMarket = (
    creator: string,
    lockOffset: number = 100,
    resolutionOffset: number = 200,
    title: string = "Will Movie X win Best Picture?",
    outcomes: string[] = ["Yes", "No"]
  ) => {
    const currentBlock = simnet.blockHeight;
    const lockDate = currentBlock + lockOffset;
    const resolutionDate = currentBlock + resolutionOffset;

    return simnet.callPublicFn(
      "pop-predict",
      "create-market",
      [
        Cl.stringAscii(title),
        Cl.stringUtf8("Testing if Movie X wins the Best Picture award."),
        Cl.stringAscii("Movies"),
        Cl.list(outcomes.map(outcome => Cl.stringUtf8(outcome))),
        Cl.uint(lockDate),
        Cl.uint(resolutionDate)
      ],
      creator
    );
  };

  const placeStake = (user: string, marketId: number, outcomeIndex: number, amount: number) => {
    return simnet.callPublicFn(
      "pop-predict",
      "place-stake",
      [Cl.uint(marketId), Cl.uint(outcomeIndex), Cl.uint(amount)],
      user
    );
  };

  const setOracle = (oracle: string) => {
    return simnet.callPublicFn(
      "pop-predict",
      "set-oracle-address",
      [Cl.principal(oracle)],
      deployer
    );
  };

  // ============================================
  // ADMIN FUNCTION TESTS
  // ============================================

  describe("Admin Functions", () => {
    it("should set oracle address by contract owner", () => {
      const { result } = setOracle(address1);
      expect(result).toBeOk(Cl.bool(true));

      // Verify oracle was set
      const { result: contractInfo } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-contract-info",
        [],
        address1
      );
      expect(contractInfo).toBeOk(
        Cl.tuple({
          paused: Cl.bool(false),
          oracle: Cl.principal(address1),
          treasury: Cl.principal(deployer),
          "fee-bps": Cl.uint(300),
          "next-market-id": Cl.uint(0)
        })
      );
    });

    it("should fail to set oracle address by non-owner", () => {
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "set-oracle-address",
        [Cl.principal(address1)],
        address2 // Not owner
      );
      expect(result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
    });

    it("should set treasury address by contract owner", () => {
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "set-treasury-address",
        [Cl.principal(address2)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("should set platform fee by contract owner", () => {
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "set-platform-fee",
        [Cl.uint(500)], // 5%
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });

    it("should fail to set platform fee above maximum", () => {
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "set-platform-fee",
        [Cl.uint(2000)], // 20% - above 10% max
        deployer
      );
      expect(result).toBeErr(Cl.uint(114)); // ERR-INVALID-FEE
    });

    it("should toggle pause state by contract owner", () => {
      // Toggle pause on
      const { result: pauseResult } = simnet.callPublicFn(
        "pop-predict",
        "toggle-pause",
        [],
        deployer
      );
      expect(pauseResult).toBeOk(Cl.bool(true));

      // Verify contract is paused
      const { result: contractInfo } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-contract-info",
        [],
        address1
      );
      expect(contractInfo).toBeOk(
        Cl.tuple({
          paused: Cl.bool(true),
          oracle: Cl.principal(deployer),
          treasury: Cl.principal(deployer),
          "fee-bps": Cl.uint(300),
          "next-market-id": Cl.uint(0)
        })
      );

      // Toggle pause off
      const { result: unpauseResult } = simnet.callPublicFn(
        "pop-predict",
        "toggle-pause",
        [],
        deployer
      );
      expect(unpauseResult).toBeOk(Cl.bool(true));
    });

    it("should authorize creator by contract owner", () => {
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "authorize-creator",
        [Cl.principal(address1), Cl.bool(true)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));
    });
  });

  // ============================================
  // MARKET CREATION TESTS
  // ============================================

  describe("Market Creation", () => {
    it("should create a new market", () => {
      const { result } = createMarket(deployer);
      expect(result).toBeOk(Cl.uint(0));

      // Verify market was created
      const { result: marketResult } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-market",
        [Cl.uint(0)],
        address1
      );

      expect(marketResult).toBeSome(
        Cl.tuple({
          title: Cl.stringAscii("Will Movie X win Best Picture?"),
          description: Cl.stringUtf8("Testing if Movie X wins the Best Picture award."),
          category: Cl.stringAscii("Movies"),
          outcomes: Cl.list([Cl.stringUtf8("Yes"), Cl.stringUtf8("No")]),
          "outcome-count": Cl.uint(2),
          "resolution-date": expect.any(Cl.uint),
          "lock-date": expect.any(Cl.uint),
          state: Cl.stringAscii("active"),
          "total-pool": Cl.uint(0),
          "winning-outcome": Cl.none(),
          creator: Cl.principal(deployer),
          "created-at": expect.any(Cl.uint)
        })
      );
    });

    it("should fail to create market when contract is paused", () => {
      // Pause contract
      simnet.callPublicFn("pop-predict", "toggle-pause", [], deployer);

      const { result } = createMarket(deployer);
      expect(result).toBeErr(Cl.uint(113)); // ERR-PAUSED
    });

    it("should fail to create market with less than 2 outcomes", () => {
      const currentBlock = simnet.blockHeight;
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "create-market",
        [
          Cl.stringAscii("Test Market"),
          Cl.stringUtf8("Description"),
          Cl.stringAscii("Test"),
          Cl.list([Cl.stringUtf8("Only One")]), // Only 1 outcome
          Cl.uint(currentBlock + 200),
          Cl.uint(currentBlock + 100)
        ],
        deployer
      );
      expect(result).toBeErr(Cl.uint(116)); // Custom error u116
    });

    it("should fail to create market with more than 10 outcomes", () => {
      const currentBlock = simnet.blockHeight;
      const outcomes = Array.from({ length: 11 }, (_, i) => Cl.stringUtf8(`Outcome ${i + 1}`));
      
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "create-market",
        [
          Cl.stringAscii("Test Market"),
          Cl.stringUtf8("Description"),
          Cl.stringAscii("Test"),
          Cl.list(outcomes),
          Cl.uint(currentBlock + 200),
          Cl.uint(currentBlock + 100)
        ],
        deployer
      );
      expect(result).toBeErr(Cl.uint(117)); // Custom error u117
    });

    it("should fail to create market with lock date after resolution date", () => {
      const currentBlock = simnet.blockHeight;
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "create-market",
        [
          Cl.stringAscii("Test Market"),
          Cl.stringUtf8("Description"),
          Cl.stringAscii("Test"),
          Cl.list([Cl.stringUtf8("Yes"), Cl.stringUtf8("No")]),
          Cl.uint(currentBlock + 50), // Resolution date
          Cl.uint(currentBlock + 100)  // Lock date (should be before resolution)
        ],
        deployer
      );
      expect(result).toBeErr(Cl.uint(120)); // Custom error u120
    });

    it("should fail to create market with past lock date", () => {
      const currentBlock = simnet.blockHeight;
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "create-market",
        [
          Cl.stringAscii("Test Market"),
          Cl.stringUtf8("Description"),
          Cl.stringAscii("Test"),
          Cl.list([Cl.stringUtf8("Yes"), Cl.stringUtf8("No")]),
          Cl.uint(currentBlock + 200),
          Cl.uint(currentBlock - 10) // Past lock date
        ],
        deployer
      );
      expect(result).toBeErr(Cl.uint(119)); // Custom error u119
    });

    it("should increment market ID nonce", () => {
      // Create first market
      const { result: result1 } = createMarket(deployer);
      expect(result1).toBeOk(Cl.uint(0));

      // Create second market
      const { result: result2 } = createMarket(deployer);
      expect(result2).toBeOk(Cl.uint(1));
    });
  });

  // ============================================
  // STAKING TESTS
  // ============================================

  describe("Staking", () => {
    beforeEach(() => {
      // Create a market for staking tests
      createMarket(deployer, 100, 200);
    });

    it("should place a stake successfully", () => {
      const { result } = placeStake(address1, 0, 0, 1_000_000);
      expect(result).toBeOk(Cl.bool(true));

      // Verify stake was recorded
      const { result: userStake } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-user-stake",
        [Cl.principal(address1), Cl.uint(0), Cl.uint(0)],
        address1
      );
      expect(userStake).toBeSome(
        Cl.tuple({
          amount: Cl.uint(1_000_000),
          timestamp: expect.any(Cl.uint),
          claimed: Cl.bool(false)
        })
      );

      // Verify outcome pool was updated
      const { result: poolInfo } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-outcome-pool-info",
        [Cl.uint(0), Cl.uint(0)],
        address1
      );
      expect(poolInfo).toBeOk(
        Cl.tuple({
          "total-staked": Cl.uint(1_000_000),
          "staker-count": Cl.uint(1)
        })
      );

      // Verify market total pool was updated
      const { result: marketResult } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-market",
        [Cl.uint(0)],
        address1
      );
      const market = marketResult.value as any;
      expect(market.data["total-pool"]).toBe(Cl.uint(1_000_000));
    });

    it("should fail to stake below minimum amount", () => {
      const { result } = placeStake(address1, 0, 0, 500_000); // 0.5 STX
      expect(result).toBeErr(Cl.uint(104)); // ERR-STAKE-TOO-LOW
    });

    it("should fail to stake above maximum amount", () => {
      const { result } = placeStake(address1, 0, 0, 200_000_000); // 200 STX
      expect(result).toBeErr(Cl.uint(105)); // ERR-STAKE-TOO-HIGH
    });

    it("should fail to stake on non-existent market", () => {
      const { result } = placeStake(address1, 999, 0, 1_000_000);
      expect(result).toBeErr(Cl.uint(101)); // ERR-MARKET-NOT-FOUND
    });

    it("should fail to stake on invalid outcome index", () => {
      const { result } = placeStake(address1, 0, 5, 1_000_000); // Only 2 outcomes exist
      expect(result).toBeErr(Cl.uint(103)); // ERR-INVALID-OUTCOME
    });

    it("should fail to stake when market is locked", () => {
      // Advance blocks past lock date
      simnet.mineEmptyBlocks(101);
      
      const { result } = placeStake(address1, 0, 0, 1_000_000);
      expect(result).toBeErr(Cl.uint(111)); // ERR-MARKET-LOCKED
    });

    it("should allow multiple stakes on same outcome by same user", () => {
      // First stake
      const { result: result1 } = placeStake(address1, 0, 0, 2_000_000);
      expect(result1).toBeOk(Cl.bool(true));

      // Second stake
      const { result: result2 } = placeStake(address1, 0, 0, 3_000_000);
      expect(result2).toBeOk(Cl.bool(true));

      // Verify total stake
      const { result: userStake } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-user-stake",
        [Cl.principal(address1), Cl.uint(0), Cl.uint(0)],
        address1
      );
      const stake = userStake.value as any;
      expect(stake.data.amount).toBe(Cl.uint(5_000_000));

      // Verify staker count is still 1
      const { result: poolInfo } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-outcome-pool-info",
        [Cl.uint(0), Cl.uint(0)],
        address1
      );
      expect(poolInfo).toBeOk(
        Cl.tuple({
          "total-staked": Cl.uint(5_000_000),
          "staker-count": Cl.uint(1)
        })
      );
    });

    it("should allow multiple users to stake on same outcome", () => {
      // User 1 stakes
      const { result: result1 } = placeStake(address1, 0, 0, 2_000_000);
      expect(result1).toBeOk(Cl.bool(true));

      // User 2 stakes
      const { result: result2 } = placeStake(address2, 0, 0, 3_000_000);
      expect(result2).toBeOk(Cl.bool(true));

      // Verify staker count is 2
      const { result: poolInfo } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-outcome-pool-info",
        [Cl.uint(0), Cl.uint(0)],
        address1
      );
      expect(poolInfo).toBeOk(
        Cl.tuple({
          "total-staked": Cl.uint(5_000_000),
          "staker-count": Cl.uint(2)
        })
      );
    });

    it("should calculate current odds correctly", () => {
      // User 1 stakes 2 STX on outcome 0
      placeStake(address1, 0, 0, 2_000_000);
      
      // User 2 stakes 3 STX on outcome 1
      placeStake(address2, 0, 1, 3_000_000);

      // Get odds for outcome 0
      const { result: odds0 } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-current-odds",
        [Cl.uint(0), Cl.uint(0)],
        address1
      );
      // Total pool = 5, Outcome 0 pool = 2, Odds = (5 * 100) / 2 = 250
      expect(odds0).toBeOk(Cl.uint(250));

      // Get odds for outcome 1
      const { result: odds1 } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-current-odds",
        [Cl.uint(0), Cl.uint(1)],
        address1
      );
      // Total pool = 5, Outcome 1 pool = 3, Odds = (5 * 100) / 3 = 166 (integer division)
      expect(odds1).toBeOk(Cl.uint(166));
    });

    it("should calculate potential winnings correctly", () => {
      // User 1 stakes 2 STX on outcome 0
      placeStake(address1, 0, 0, 2_000_000);
      
      // Calculate potential winnings for new stake on outcome 0
      const { result: winnings } = simnet.callReadOnlyFn(
        "pop-predict",
        "calculate-potential-winnings",
        [Cl.uint(0), Cl.uint(0), Cl.uint(1_000_000)],
        address2
      );
      // Total pool after new stake = 3, Fee = 3 * 0.03 = 0.09, Distributable = 2.91
      // Outcome 0 pool after new stake = 3
      // Winnings = (2.91 * 1) / 3 = 0.97 STX = 970,000 microSTX
      expect(winnings).toBeOk(Cl.uint(970_000));
    });
  });

  // ============================================
  // MARKET RESOLUTION TESTS
  // ============================================

  describe("Market Resolution", () => {
    beforeEach(() => {
      // Create market and set up oracle
      createMarket(deployer, 10, 20);
      setOracle(address2);
      
      // Place some stakes
      placeStake(address1, 0, 0, 2_000_000); // User 1 on outcome 0
      placeStake(address3, 0, 1, 3_000_000); // User 3 on outcome 1
    });

    it("should lock market at lock date by oracle", () => {
      // Advance to lock date
      simnet.mineEmptyBlocks(11);
      
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "lock-market",
        [Cl.uint(0)],
        address2 // Oracle
      );
      expect(result).toBeOk(Cl.bool(true));

      // Verify market state
      const { result: marketResult } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-market",
        [Cl.uint(0)],
        address1
      );
      const market = marketResult.value as any;
      expect(market.data.state).toBe(Cl.stringAscii("locked"));
    });

    it("should fail to lock market before lock date", () => {
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "lock-market",
        [Cl.uint(0)],
        address2 // Oracle
      );
      expect(result).toBeErr(Cl.uint(121)); // Custom error u121
    });

    it("should fail to lock market by non-oracle", () => {
      simnet.mineEmptyBlocks(11);
      
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "lock-market",
        [Cl.uint(0)],
        address1 // Not oracle
      );
      expect(result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
    });

    it("should resolve market at resolution date by oracle", () => {
      // Advance to resolution date
      simnet.mineEmptyBlocks(21);
      
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "resolve-market",
        [Cl.uint(0), Cl.uint(0)], // Outcome 0 wins
        address2 // Oracle
      );
      expect(result).toBeOk(Cl.bool(true));

      // Verify market state
      const { result: marketResult } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-market",
        [Cl.uint(0)],
        address1
      );
      const market = marketResult.value as any;
      expect(market.data.state).toBe(Cl.stringAscii("resolved"));
      expect(market.data["winning-outcome"]).toBeSome(Cl.uint(0));
    });

    it("should fail to resolve market before resolution date", () => {
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "resolve-market",
        [Cl.uint(0), Cl.uint(0)],
        address2 // Oracle
      );
      expect(result).toBeErr(Cl.uint(122)); // Custom error u122
    });

    it("should fail to resolve market by non-oracle", () => {
      simnet.mineEmptyBlocks(21);
      
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "resolve-market",
        [Cl.uint(0), Cl.uint(0)],
        address1 // Not oracle
      );
      expect(result).toBeErr(Cl.uint(110)); // ERR-INVALID-ORACLE
    });

    it("should fail to resolve with invalid outcome index", () => {
      simnet.mineEmptyBlocks(21);
      
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "resolve-market",
        [Cl.uint(0), Cl.uint(5)], // Invalid outcome
        address2 // Oracle
      );
      expect(result).toBeErr(Cl.uint(103)); // ERR-INVALID-OUTCOME
    });
  });

  // ============================================
  // CLAIMING TESTS
  // ============================================

  describe("Claiming Winnings", () => {
    beforeEach(() => {
      // Create market, set oracle, place stakes, and resolve
      createMarket(deployer, 5, 10);
      setOracle(address2);
      
      // Place stakes
      placeStake(address1, 0, 0, 2_000_000); // User 1 on outcome 0
      placeStake(address3, 0, 1, 3_000_000); // User 3 on outcome 1
      
      // Advance and resolve with outcome 0 winning
      simnet.mineEmptyBlocks(11);
      simnet.callPublicFn(
        "pop-predict",
        "resolve-market",
        [Cl.uint(0), Cl.uint(0)],
        address2
      );
    });

    it("should allow winner to claim winnings", () => {
      // User 1 (winner) claims winnings
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "claim-winnings",
        [Cl.uint(0)],
        address1
      );
      
      // Calculate expected winnings:
      // Total pool = 5 STX, Fee = 5 * 0.03 = 0.15 STX, Distributable = 4.85 STX
      // Winning pool (outcome 0) = 2 STX
      // User 1 stake = 2 STX
      // Winnings = (4.85 * 2) / 2 = 4.85 STX = 4,850,000 microSTX
      expect(result).toBeOk(Cl.uint(4_850_000));
    });

    it("should fail to claim winnings from unresolved market", () => {
      // Create another market but don't resolve it
      createMarket(deployer, 100, 200);
      placeStake(address1, 1, 0, 1_000_000);
      
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "claim-winnings",
        [Cl.uint(1)],
        address1
      );
      expect(result).toBeErr(Cl.uint(107)); // ERR-MARKET-NOT-RESOLVED
    });

    it("should fail to claim winnings by non-participant", () => {
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "claim-winnings",
        [Cl.uint(0)],
        address2 // Didn't stake
      );
      expect(result).toBeErr(Cl.uint(108)); // ERR-NO-WINNINGS
    });

    it("should fail to claim winnings by loser", () => {
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "claim-winnings",
        [Cl.uint(0)],
        address3 // Staked on losing outcome
      );
      expect(result).toBeErr(Cl.uint(108)); // ERR-NO-WINNINGS
    });

    it("should fail to claim winnings twice", () => {
      // First claim
      simnet.callPublicFn("pop-predict", "claim-winnings", [Cl.uint(0)], address1);
      
      // Second claim
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "claim-winnings",
        [Cl.uint(0)],
        address1
      );
      expect(result).toBeErr(Cl.uint(109)); // ERR-ALREADY-CLAIMED
    });
  });

  // ============================================
  // CANCELLATION & REFUND TESTS
  // ============================================

  describe("Cancellation and Refunds", () => {
    beforeEach(() => {
      // Create market and place stakes
      createMarket(deployer, 100, 200);
      placeStake(address1, 0, 0, 2_000_000);
      placeStake(address2, 0, 1, 3_000_000);
    });

    it("should cancel market by contract owner", () => {
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "cancel-market",
        [Cl.uint(0)],
        deployer
      );
      expect(result).toBeOk(Cl.bool(true));

      // Verify market state
      const { result: marketResult } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-market",
        [Cl.uint(0)],
        address1
      );
      const market = marketResult.value as any;
      expect(market.data.state).toBe(Cl.stringAscii("cancelled"));
    });

    it("should fail to cancel market by non-owner", () => {
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "cancel-market",
        [Cl.uint(0)],
        address1 // Not owner
      );
      expect(result).toBeErr(Cl.uint(100)); // ERR-NOT-AUTHORIZED
    });

    it("should allow users to claim refunds from cancelled market", () => {
      // Cancel market
      simnet.callPublicFn("pop-predict", "cancel-market", [Cl.uint(0)], deployer);
      
      // User 1 claims refund
      const { result: refund1 } = simnet.callPublicFn(
        "pop-predict",
        "claim-refund",
        [Cl.uint(0), Cl.uint(0)],
        address1
      );
      expect(refund1).toBeOk(Cl.uint(2_000_000));
      
      // User 2 claims refund
      const { result: refund2 } = simnet.callPublicFn(
        "pop-predict",
        "claim-refund",
        [Cl.uint(0), Cl.uint(1)],
        address2
      );
      expect(refund2).toBeOk(Cl.uint(3_000_000));
    });

    it("should fail to claim refund from active market", () => {
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "claim-refund",
        [Cl.uint(0), Cl.uint(0)],
        address1
      );
      expect(result).toBeErr(Cl.uint(102)); // ERR-INVALID-MARKET-STATE
    });

    it("should fail to claim refund twice", () => {
      // Cancel market
      simnet.callPublicFn("pop-predict", "cancel-market", [Cl.uint(0)], deployer);
      
      // First claim
      simnet.callPublicFn("pop-predict", "claim-refund", [Cl.uint(0), Cl.uint(0)], address1);
      
      // Second claim
      const { result } = simnet.callPublicFn(
        "pop-predict",
        "claim-refund",
        [Cl.uint(0), Cl.uint(0)],
        address1
      );
      expect(result).toBeErr(Cl.uint(109)); // ERR-ALREADY-CLAIMED
    });
  });

  // ============================================
  // READ-ONLY FUNCTION TESTS
  // ============================================

  describe("Read-Only Functions", () => {
    beforeEach(() => {
      createMarket(deployer);
    });

    it("should get user market position", () => {
      // Place stake
      placeStake(address1, 0, 1, 2_000_000);
      
      const { result } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-user-market-position",
        [Cl.principal(address1), Cl.uint(0)],
        address1
      );
      expect(result).toBeSome(
        Cl.tuple({
          "total-amount": Cl.uint(2_000_000),
          "outcome-index": Cl.uint(1)
        })
      );
    });

    it("should get contract info", () => {
      const { result } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-contract-info",
        [],
        address1
      );
      expect(result).toBeOk(
        Cl.tuple({
          paused: Cl.bool(false),
          oracle: Cl.principal(deployer),
          treasury: Cl.principal(deployer),
          "fee-bps": Cl.uint(300),
          "next-market-id": Cl.uint(1) // After creating one market
        })
      );
    });

    it("should get market display info", () => {
      const { result } = simnet.callReadOnlyFn(
        "pop-predict",
        "get-market-display-info",
        [Cl.uint(0)],
        address1
      );
      expect(result).toBeOk(
        Cl.tuple({
          "market-id": Cl.uint(0),
          state: Cl.stringAscii("active"),
          "total-pool": Cl.uint(0),
          "current-burn-block": expect.any(Cl.uint),
          "current-block": expect.any(Cl.uint)
        })
      );
    });
  });
});
