import { Reward, RewardBalance, ClaimRewardResponse } from '../types/rewards';

const REWARDS_KEY = 'todolist_rewards';
const BALANCE_KEY = 'todolist_reward_balance';

function getStoredRewards(): Reward[] {
  try {
    return JSON.parse(localStorage.getItem(REWARDS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRewards(rewards: Reward[]) {
  localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
}

function getBalance(): RewardBalance {
  try {
    return JSON.parse(localStorage.getItem(BALANCE_KEY) || '{"seeds":0,"coins":0,"xp":0,"badges":[]}');
  } catch {
    return { seeds: 0, coins: 0, xp: 0, badges: [] };
  }
}

function saveBalance(balance: RewardBalance) {
  localStorage.setItem(BALANCE_KEY, JSON.stringify(balance));
}

export const rewardService = {
  async getUserRewards(userId?: string): Promise<Reward[]> {
    const rewards = getStoredRewards();
    return userId ? rewards.filter(r => r.userId === userId) : rewards;
  },

  async getUserBalance(_userId: string): Promise<RewardBalance | null> {
    return getBalance();
  },

  async createUserBalance(_userId: string): Promise<RewardBalance> {
    const balance = { seeds: 0, coins: 0, xp: 0, badges: [] };
    saveBalance(balance);
    return balance;
  },

  async createReward(reward: Omit<Reward, 'id' | 'createdAt'>): Promise<Reward | null> {
    const newReward: Reward = {
      ...reward,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    } as Reward;
    const rewards = getStoredRewards();
    rewards.unshift(newReward);
    saveRewards(rewards);
    return newReward;
  },

  async claimReward(rewardId: string): Promise<ClaimRewardResponse> {
    const rewards = getStoredRewards();
    const idx = rewards.findIndex(r => r.id === rewardId);
    if (idx < 0) {
      return { success: false, error: 'Reward not found' } as ClaimRewardResponse;
    }
    rewards[idx].claimed = true;
    rewards[idx].claimedAt = new Date().toISOString();
    saveRewards(rewards);
    const balance = getBalance();
    return { success: true, reward: rewards[idx], newBalance: balance };
  },

  async updateReward(rewardId: string, updates: Partial<Reward>): Promise<boolean> {
    const rewards = getStoredRewards();
    const idx = rewards.findIndex(r => r.id === rewardId);
    if (idx >= 0) {
      rewards[idx] = { ...rewards[idx], ...updates };
      saveRewards(rewards);
      return true;
    }
    return false;
  },

  async deleteReward(rewardId: string): Promise<boolean> {
    const rewards = getStoredRewards();
    saveRewards(rewards.filter(r => r.id !== rewardId));
    return true;
  },

  async syncLocalRewards(_localRewards: Reward[]): Promise<void> {
    // No-op in local mode
  },

  async getRewardHistory(_userId: string, _limit: number = 50): Promise<any[]> {
    return getStoredRewards().filter(r => r.claimed).slice(0, _limit);
  },
};
