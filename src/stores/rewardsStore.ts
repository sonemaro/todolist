import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Reward, RewardBalance, RewardQueueItem, defaultRewardRules, RewardType, RewardCurrency } from '../types/rewards';

interface RewardsState {
  rewards: Reward[];
  balance: RewardBalance;
  offlineQueue: RewardQueueItem[];
  lastDailyBonusClaim: string | null;
  isSyncing: boolean;

  addReward: (reward: Omit<Reward, 'id' | 'createdAt' | 'claimed' | 'synced'>) => void;
  claimReward: (rewardId: string) => Promise<void>;
  claimAllRewards: () => Promise<void>;
  updateBalance: (balance: Partial<RewardBalance>) => void;
  addToOfflineQueue: (item: Omit<RewardQueueItem, 'id' | 'timestamp' | 'retryCount'>) => void;
  processOfflineQueue: () => Promise<void>;
  syncRewards: () => Promise<void>;
  getUnclaimedRewards: () => Reward[];
  getRewardsByType: (type: RewardType) => Reward[];
  canClaimDailyBonus: () => boolean;
  createTaskCompletionReward: (priority: 'low' | 'medium' | 'high' | 'urgent') => void;
  createStreakBonusReward: (streakDays: number) => void;
  createLevelUpReward: (level: number) => void;
  clearExpiredRewards: () => void;
}

const defaultBalance: RewardBalance = {
  seeds: 0,
  coins: 0,
  xp: 0,
  badges: [],
};

export const useRewardsStore = create<RewardsState>()(
  persist(
    (set, get) => ({
      rewards: [],
      balance: defaultBalance,
      offlineQueue: [],
      lastDailyBonusClaim: null,
      isSyncing: false,

      addReward: (rewardData) => {
        const newReward: Reward = {
          ...rewardData,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          claimed: false,
          synced: false,
        };

        set((state) => ({
          rewards: [...state.rewards, newReward],
        }));

        if (navigator.onLine) {
          get().addToOfflineQueue({
            action: 'create',
            reward: newReward,
          });
        }
      },

      claimReward: async (rewardId) => {
        const reward = get().rewards.find((r) => r.id === rewardId);
        if (!reward || reward.claimed) return;

        if (reward.expiresAt && new Date(reward.expiresAt) < new Date()) {
          set((state) => ({
            rewards: state.rewards.filter((r) => r.id !== rewardId),
          }));
          return;
        }

        const updatedBalance = { ...get().balance };

        if (reward.currency && reward.amount) {
          if (reward.currency === 'seeds') {
            updatedBalance.seeds += reward.amount;
          } else if (reward.currency === 'coins') {
            updatedBalance.coins += reward.amount;
          } else if (reward.currency === 'xp') {
            updatedBalance.xp += reward.amount;
          } else if (reward.currency === 'badge' && reward.metadata?.badgeId) {
            if (!updatedBalance.badges.includes(reward.metadata.badgeId)) {
              updatedBalance.badges.push(reward.metadata.badgeId);
            }
          }
        }

        set((state) => ({
          rewards: state.rewards.map((r) =>
            r.id === rewardId
              ? { ...r, claimed: true, claimedAt: new Date().toISOString() }
              : r
          ),
          balance: updatedBalance,
        }));

        if (navigator.onLine) {
          get().addToOfflineQueue({
            action: 'claim',
            reward: { ...reward, claimed: true, claimedAt: new Date().toISOString() },
          });
        }
      },

      claimAllRewards: async () => {
        const unclaimedRewards = get().getUnclaimedRewards();
        for (const reward of unclaimedRewards) {
          await get().claimReward(reward.id);
        }
      },

      updateBalance: (balanceUpdate) => {
        set((state) => ({
          balance: { ...state.balance, ...balanceUpdate },
        }));
      },

      addToOfflineQueue: (item) => {
        const queueItem: RewardQueueItem = {
          ...item,
          id: `queue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          retryCount: 0,
        };

        set((state) => ({
          offlineQueue: [...state.offlineQueue, queueItem],
        }));
      },

      processOfflineQueue: async () => {
        const { offlineQueue } = get();
        if (offlineQueue.length === 0 || !navigator.onLine) return;

        set({ isSyncing: true });

        const processedIds: string[] = [];

        for (const item of offlineQueue) {
          try {
            if (item.retryCount >= 3) {
              processedIds.push(item.id);
              continue;
            }

            processedIds.push(item.id);
          } catch (error) {
            console.error('Failed to process queue item:', error);

            set((state) => ({
              offlineQueue: state.offlineQueue.map((qi) =>
                qi.id === item.id ? { ...qi, retryCount: qi.retryCount + 1 } : qi
              ),
            }));
          }
        }

        set((state) => ({
          offlineQueue: state.offlineQueue.filter((qi) => !processedIds.includes(qi.id)),
          isSyncing: false,
        }));
      },

      syncRewards: async () => {
        if (!navigator.onLine) return;
        await get().processOfflineQueue();
      },

      getUnclaimedRewards: () => {
        return get().rewards.filter((r) => !r.claimed);
      },

      getRewardsByType: (type) => {
        return get().rewards.filter((r) => r.type === type);
      },

      canClaimDailyBonus: () => {
        const { lastDailyBonusClaim } = get();
        if (!lastDailyBonusClaim) return true;

        const lastClaim = new Date(lastDailyBonusClaim);
        const now = new Date();
        const diffHours = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);

        return diffHours >= 24;
      },

      createTaskCompletionReward: (priority) => {
        const rules = defaultRewardRules.taskComplete;
        const amount = rules[priority];

        get().addReward({
          type: 'TaskComplete',
          title: 'Task Completed',
          description: `Completed a ${priority} priority task`,
          amount,
          currency: 'seeds',
          metadata: { priority },
        });
      },

      createStreakBonusReward: (streakDays) => {
        const rules = defaultRewardRules.streakBonus;
        const bonus = rules[streakDays];

        if (!bonus) return;

        get().addReward({
          type: 'StreakBonus',
          title: `${streakDays} Day Streak!`,
          description: `Amazing ${streakDays} day streak achievement`,
          amount: bonus.seeds,
          currency: 'seeds',
          metadata: { streakDays, coins: bonus.coins },
        });

        get().addReward({
          type: 'StreakBonus',
          title: `${streakDays} Day Streak Bonus`,
          description: 'Bonus coins for your dedication',
          amount: bonus.coins,
          currency: 'coins',
          metadata: { streakDays },
        });
      },

      createLevelUpReward: (level) => {
        const rules = defaultRewardRules.levelUp;
        const seedsAmount = Math.floor(rules.baseSeeds * Math.pow(rules.multiplier, level - 1));
        const coinsAmount = Math.floor(rules.baseCoins * Math.pow(rules.multiplier, level - 1));

        get().addReward({
          type: 'LevelUp',
          title: `Level ${level} Reached!`,
          description: `Congratulations on reaching level ${level}`,
          amount: seedsAmount,
          currency: 'seeds',
          metadata: { level, coins: coinsAmount },
        });

        get().addReward({
          type: 'LevelUp',
          title: `Level ${level} Bonus`,
          description: 'Special coins reward for leveling up',
          amount: coinsAmount,
          currency: 'coins',
          metadata: { level },
        });
      },

      clearExpiredRewards: () => {
        const now = new Date();
        set((state) => ({
          rewards: state.rewards.filter(
            (r) => !r.expiresAt || new Date(r.expiresAt) > now
          ),
        }));
      },
    }),
    {
      name: 'rewards-storage',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
