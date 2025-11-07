export type CareItemType = 'plant' | 'pet';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface CareItem {
  id: string;
  userId: string;
  type: CareItemType;
  name: string;
  image?: string;
  description?: string;
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
  createdAt: Date;
}

export interface CareItemWithTasks extends CareItem {
  tasks: CareTask[];
}
