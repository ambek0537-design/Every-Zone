export type ConversationType = 'PRODUCT' | 'PROPERTY' | 'JOB' | 'GENERAL';

export interface Participant {
  userId: string;
  fullName: string;
  role: string;
  avatarUrl?: string | null;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  buyerId: string;
  vendorId: string;
  lastMessageAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Extended UI attributes
  recipientName?: string;
  recipientAvatar?: string;
  status?: 'ACTIVE' | 'ARCHIVED' | 'REPORTED' | 'BLOCKED';
  unreadCount?: number;
}
