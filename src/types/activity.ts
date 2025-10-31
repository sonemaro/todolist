export type ActivityType =
  | 'task_complete'
  | 'reward_claim'
  | 'level_up'
  | 'streak'
  | 'profile_edit'
  | 'login'
  | 'achievement';

export interface Activity {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  title: string;
  description?: string;
  metadata: Record<string, any>;
  points_earned: number;
  created_at: string;
}

export interface ActivitySummary {
  date: string;
  activity_count: number;
  points_total: number;
  task_completions: number;
  rewards_claimed: number;
}

export type NotificationType =
  | 'reward'
  | 'milestone'
  | 'level_up'
  | 'streak'
  | 'achievement'
  | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  action_url?: string;
  metadata: Record<string, any>;
  read: boolean;
  dismissed: boolean;
  created_at: string;
  expires_at?: string | null;
}

export interface PrivacySettings {
  id: string;
  user_id: string;
  show_completed_tasks: boolean;
  show_rewards: boolean;
  show_badges: boolean;
  show_activity_log: boolean;
  show_profile_stats: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ProgressChartData {
  daily: ChartDataPoint[];
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
}
