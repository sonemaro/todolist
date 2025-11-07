export type CareItemType = 'plant' | 'pet';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface CareTips {
  light?: string;
  water?: string;
  temperature?: string;
  notes?: string;
}

export interface CareItem {
  id: string;
  userId: string;
  type: CareItemType;
  name: string;
  image?: string;
  description?: string;
  tips?: CareTips;
  sharedWith?: string[];
  createdAt: Date;
}

export interface CareTask {
  id: string;
  careItemId: string;
  userId: string;
  title: string;
  dueDate: Date;
  repeat: RepeatType;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
}

export interface CareItemWithTasks extends CareItem {
  tasks: CareTask[];
}
