import { ConversationType } from '../conversations/conversation.types';
import { MessageType, CardContent } from '../messages/message.types';

export interface CreateConversationDto {
  buyerId: string;
  vendorId: string;
  type?: ConversationType;
}

export interface SendMessageDto {
  conversationId: string;
  senderId: string;
  messageType?: MessageType;
  content?: string;
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  replyToMessageId?: string;
  cardMetadata?: CardContent;
}

export interface ReactMessageDto {
  messageId: string;
  userId: string;
  emoji: string;
}

export interface ForwardMessageDto {
  messageId: string;
  targetConversationId: string;
  senderId: string;
}

export interface TypingIndicatorDto {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}

export interface PresenceUpdateDto {
  userId: string;
  online: boolean;
}

export interface ReportChatDto {
  conversationId: string;
  reporterId: string;
  reason: string;
}
