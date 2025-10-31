import { Reward, RewardBalance, ClaimRewardResponse } from '../types/rewards';
import { supabase } from '../lib/supabaseClient';

export const rewardService = {
  async getUserRewards(userId?: string): Promise<Reward[]> {
    try {
      const query = supabase
        .from('rewards')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data as Reward[];
    } catch (error) {
      console.error('Error fetching rewards:', error);
      return [];
    }
  },

  async getUserBalance(userId: string): Promise<RewardBalance | null> {
    try {
      const { data, error } = await supabase
        .from('reward_balances')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        const newBalance = await this.createUserBalance(userId);
        return newBalance;
      }

      return {
        seeds: data.seeds,
        coins: data.coins,
        xp: data.xp,
        badges: data.badges || [],
      };
    } catch (error) {
      console.error('Error fetching balance:', error);
      return null;
    }
  },

  async createUserBalance(userId: string): Promise<RewardBalance> {
    try {
      const { data, error } = await supabase
        .from('reward_balances')
        .insert({
          user_id: userId,
          seeds: 0,
          coins: 0,
          xp: 0,
          badges: [],
        })
        .select()
        .single();

      if (error) throw error;

      return {
        seeds: data.seeds,
        coins: data.coins,
        xp: data.xp,
        badges: data.badges || [],
      };
    } catch (error) {
      console.error('Error creating balance:', error);
      return { seeds: 0, coins: 0, xp: 0, badges: [] };
    }
  },

  async createReward(reward: Omit<Reward, 'id' | 'createdAt'>): Promise<Reward | null> {
    try {
      const { data, error } = await supabase
        .from('rewards')
        .insert({
          user_id: reward.userId,
          type: reward.type,
          title: reward.title,
          description: reward.description,
          amount: reward.amount,
          currency: reward.currency,
          metadata: reward.metadata || {},
          claimed: reward.claimed || false,
          claimed_at: reward.claimedAt,
          expires_at: reward.expiresAt,
        })
        .select()
        .single();

      if (error) throw error;

      return data as Reward;
    } catch (error) {
      console.error('Error creating reward:', error);
      return null;
    }
  },

  async claimReward(rewardId: string): Promise<ClaimRewardResponse> {
    try {
      const { data, error } = await supabase.rpc('claim_reward', {
        reward_uuid: rewardId,
      });

      if (error) throw error;

      if (!data.success) {
        return {
          success: false,
          error: data.error,
        } as ClaimRewardResponse;
      }

      return {
        success: true,
        reward: data.reward,
        newBalance: data.newBalance,
      };
    } catch (error) {
      console.error('Error claiming reward:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to claim reward',
      } as ClaimRewardResponse;
    }
  },

  async updateReward(rewardId: string, updates: Partial<Reward>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('rewards')
        .update({
          claimed: updates.claimed,
          claimed_at: updates.claimedAt,
        })
        .eq('id', rewardId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error updating reward:', error);
      return false;
    }
  },

  async deleteReward(rewardId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('rewards').delete().eq('id', rewardId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting reward:', error);
      return false;
    }
  },

  async syncLocalRewards(localRewards: Reward[]): Promise<void> {
    try {
      const unsyncedRewards = localRewards.filter((r) => !r.synced);

      for (const reward of unsyncedRewards) {
        await this.createReward(reward);
      }
    } catch (error) {
      console.error('Error syncing rewards:', error);
    }
  },

  async getRewardHistory(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('reward_claims')
        .select('*, rewards(*)')
        .eq('user_id', userId)
        .order('claimed_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching reward history:', error);
      return [];
    }
  },
};
