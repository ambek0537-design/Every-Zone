export type MessageType = 
  | 'TEXT' 
  | 'IMAGE' 
  | 'VIDEO' 
  | 'FILE' 
  | 'VOICE_NOTE' 
  | 'PDF' 
  | 'LOCATION' 
  | 'PRODUCT_CARD' 
  | 'PROPERTY_CARD' 
  | 'JOB_CARD' 
  | 'SERVICE_CARD';

export interface Reaction {
  emoji: string;
  userId: string;
}

export interface CardContent {
  id: string;
  name?: string;
  title?: string;
  price?: string | number;
  image?: string;
  photo?: string;
  location?: string;
  country?: string;
  salary?: string;
  agency?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  messageType: MessageType;
  content: string | null;
  mediaUrl: string | null;
  isRead: boolean;
  createdAt: Date | string;
  
  // Extended features stored securely in database/memory or serialized metadata
  replyToMessageId?: string | null;
  reactions?: Reaction[];
  isForwarded?: boolean;
  deletedForUserIds?: string[]; // Delete for me list
  isDeletedForEveryone?: boolean; // Delete for everyone flag
  cardMetadata?: CardContent | null; // For sharing products, jobs, properties, services
}
