export type RewardType = 'DailyBonus' | 'TaskComplete' | 'StreakBonus' | 'LevelUp' | 'EventReward' | 'Purchased';

export type RewardCurrency = 'seeds' | 'coins' | 'xp' | 'badge';

export interface Reward {
  id: string;
  userId?: string;
  type: RewardType;
  title: string;
  description?: string;
  amount?: number;
  currency?: RewardCurrency;
  metadata?: Record<string, any>;
  createdAt: string;
  claimed: boolean;
  claimedAt?: string | null;
  expiresAt?: string | null;
  synced?: boolean;
}

export interface RewardBalance {
  seeds: number;
  coins: number;
  xp: number;
  badges: string[];
}

export interface ClaimRewardRequest {
  rewardId: string;
  timestamp: string;
}

export interface ClaimRewardResponse {
  success: boolean;
  reward: Reward;
  newBalance: RewardBalance;
  error?: string;
}

export interface RewardQueueItem {
  id: string;
  action: 'claim' | 'create';
  reward: Reward;
  timestamp: string;
  retryCount: number;
}

export interface RewardRules {
  dailyBonus: {
    seeds: number;
    coins: number;
  };
  taskComplete: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  streakBonus: {
    [key: number]: {
      seeds: number;
      coins: number;
    };
  };
  levelUp: {
    baseSeeds: number;
    baseCoins: number;
    multiplier: number;
  };
}

export const defaultRewardRules: RewardRules = {
  dailyBonus: {
    seeds: 50,
    coins: 10,
  },
  taskComplete: {
    low: 5,
    medium: 10,
    high: 15,
    urgent: 20,
  },
  streakBonus: {
    7: { seeds: 100, coins: 20 },
    14: { seeds: 200, coins: 40 },
    30: { seeds: 500, coins: 100 },
    60: { seeds: 1000, coins: 200 },
    100: { seeds: 2000, coins: 500 },
  },
  levelUp: {
    baseSeeds: 100,
    baseCoins: 25,
    multiplier: 1.5,
  },
};
