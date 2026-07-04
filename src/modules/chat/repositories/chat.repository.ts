import { prisma, useDbFallback, isMemoryDb } from '../../../../server';
import { Conversation } from '../conversations/conversation.types';
import { Message, Reaction } from '../messages/message.types';

export class ChatRepository {
  // ==========================================
  // CONVERSATIONS
  // ==========================================

  async getConversations(userId: string): Promise<any[]> {
    if (prisma && !useDbFallback) {
      try {
        const list = await prisma.conversation.findMany({
          where: {
            OR: [
              { buyerId: userId },
              { vendorId: userId }
            ]
          },
          orderBy: { updatedAt: "desc" }
        });
        return list;
      } catch (err) {
        console.warn("DB getConversations failed, falling back to memory:", err);
      }
    }

    // Memory Fallback
    return isMemoryDb.conversations
      .filter((c: any) => c.buyerId === userId || c.vendorId === userId)
      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async getConversationById(id: string): Promise<any | null> {
    if (prisma && !useDbFallback) {
      try {
        return await prisma.conversation.findUnique({ where: { id } });
      } catch (err) {
        console.warn("DB getConversationById failed, using memory:", err);
      }
    }

    return isMemoryDb.conversations.find((c: any) => c.id === id) || null;
  }

  async findExistingConversation(buyerId: string, vendorId: string, type: string): Promise<any | null> {
    if (prisma && !useDbFallback) {
      try {
        return await prisma.conversation.findFirst({
          where: { buyerId, vendorId, type: type as any }
        });
      } catch (err) {
        console.warn("DB findExistingConversation failed, using memory:", err);
      }
    }

    return isMemoryDb.conversations.find(
      (c: any) => c.buyerId === buyerId && c.vendorId === vendorId && c.type === type
    ) || null;
  }

  async createConversation(buyerId: string, vendorId: string, type: string): Promise<any> {
    if (prisma && !useDbFallback) {
      try {
        return await prisma.conversation.create({
          data: {
            buyerId,
            vendorId,
            type: type as any,
            lastMessageAt: new Date()
          }
        });
      } catch (err) {
        console.warn("DB createConversation failed, using memory:", err);
      }
    }

    const newConv = {
      id: `conv-${Date.now()}`,
      buyerId,
      vendorId,
      type,
      lastMessageAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'ACTIVE'
    };
    isMemoryDb.conversations.push(newConv);
    return newConv;
  }

  async updateConversationActivity(id: string): Promise<void> {
    if (prisma && !useDbFallback) {
      try {
        await prisma.conversation.update({
          where: { id },
          data: { lastMessageAt: new Date(), updatedAt: new Date() }
        });
        return;
      } catch (err) {
        console.warn("DB updateConversationActivity failed, using memory:", err);
      }
    }

    const conv = isMemoryDb.conversations.find((c: any) => c.id === id);
    if (conv) {
      conv.lastMessageAt = new Date();
      conv.updatedAt = new Date();
    }
  }

  // ==========================================
  // MESSAGES
  // ==========================================

  async getMessagesByConversation(conversationId: string, userId?: string): Promise<any[]> {
    if (prisma && !useDbFallback) {
      try {
        const messages = await prisma.message.findMany({
          where: { conversationId },
          orderBy: { createdAt: "asc" }
        });
        
        // Hydrate attachments
        const hydrated = await Promise.all(messages.map(async (msg) => {
          const attachments = await prisma.chatAttachment.findMany({ where: { messageId: msg.id } });
          return { ...msg, attachments };
        }));

        // Filter out deleted for me messages
        if (userId) {
          return hydrated.filter(m => {
            const extra = m.content && m.content.startsWith('{') ? JSON.parse(m.content) : null;
            if (extra?.deletedForUserIds?.includes(userId)) return false;
            return true;
          });
        }
        return hydrated;
      } catch (err) {
        console.warn("DB getMessagesByConversation failed, using memory:", err);
      }
    }

    // Memory list
    let list = isMemoryDb.messagesList
      .filter((m: any) => m.conversationId === conversationId)
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    // Hydrate memory messages with attachments
    const hydratedList = list.map((msg: any) => {
      const attachments = isMemoryDb.chatAttachments.filter((a: any) => a.messageId === msg.id);
      return { ...msg, attachments };
    });

    if (userId) {
      return hydratedList.filter((m: any) => {
        if (m.deletedForUserIds && m.deletedForUserIds.includes(userId)) return false;
        return true;
      });
    }

    return hydratedList;
  }

  async getMessageById(id: string): Promise<any | null> {
    if (prisma && !useDbFallback) {
      try {
        return await prisma.message.findUnique({ where: { id } });
      } catch (err) {
        console.warn("DB getMessageById failed, using memory:", err);
      }
    }

    return isMemoryDb.messagesList.find((m: any) => m.id === id) || null;
  }

  async createMessage(payload: {
    conversationId: string;
    senderId: string;
    messageType: string;
    content: string | null;
    mediaUrl: string | null;
    replyToMessageId?: string | null;
    cardMetadata?: any;
  }): Promise<any> {
    if (prisma && !useDbFallback) {
      try {
        // We pack replyToMessageId, reactions, cardMetadata, etc., into content or custom structures
        const finalContent = payload.cardMetadata 
          ? JSON.stringify({ text: payload.content, card: payload.cardMetadata, replyTo: payload.replyToMessageId })
          : payload.content;

        const msg = await prisma.message.create({
          data: {
            conversationId: payload.conversationId,
            senderId: payload.senderId,
            messageType: payload.messageType as any,
            content: finalContent,
            mediaUrl: payload.mediaUrl || null
          }
        });
        return msg;
      } catch (err) {
        console.warn("DB createMessage failed, falling back to memory:", err);
      }
    }

    const msgId = `msg-${Date.now()}`;
    const newMsg: any = {
      id: msgId,
      conversationId: payload.conversationId,
      senderId: payload.senderId,
      messageType: payload.messageType,
      content: payload.content,
      mediaUrl: payload.mediaUrl || null,
      isRead: false,
      createdAt: new Date(),
      replyToMessageId: payload.replyToMessageId || null,
      reactions: [] as Reaction[],
      deletedForUserIds: [] as string[],
      isDeletedForEveryone: false,
      cardMetadata: payload.cardMetadata || null
    };

    isMemoryDb.messagesList.push(newMsg);
    return newMsg;
  }

  async saveAttachment(messageId: string, fileName: string, fileUrl: string, fileSize?: string): Promise<any> {
    const sizeInt = fileSize ? parseInt(fileSize.replace(/[^0-9]/g, '')) || 1024 : 1024;
    
    if (prisma && !useDbFallback) {
      try {
        return await prisma.chatAttachment.create({
          data: {
            messageId,
            fileName,
            fileUrl,
            fileSize: sizeInt
          }
        });
      } catch (err) {
        console.warn("DB saveAttachment failed, using memory:", err);
      }
    }

    const newAtt = {
      id: `att-${Date.now()}`,
      messageId,
      fileName,
      fileUrl,
      fileSize: fileSize || "1.2 MB",
      createdAt: new Date()
    };
    isMemoryDb.chatAttachments.push(newAtt);
    return newAtt;
  }

  async markMessagesAsRead(conversationId: string, readerUserId: string): Promise<void> {
    if (prisma && !useDbFallback) {
      try {
        await prisma.message.updateMany({
          where: { conversationId, senderId: { not: readerUserId }, isRead: false },
          data: { isRead: true }
        });
        return;
      } catch (err) {
        console.warn("DB markMessagesAsRead failed, using memory:", err);
      }
    }

    isMemoryDb.messagesList.forEach((m: any) => {
      if (m.conversationId === conversationId && m.senderId !== readerUserId) {
        m.isRead = true;
      }
    });
  }

  async deleteMessageForMe(messageId: string, userId: string): Promise<any> {
    const msg = await this.getMessageById(messageId);
    if (!msg) return null;

    if (prisma && !useDbFallback) {
      try {
        let contentObj: any = { text: msg.content, deletedForUserIds: [] };
        if (msg.content && msg.content.startsWith('{')) {
          contentObj = JSON.parse(msg.content);
        }
        if (!contentObj.deletedForUserIds) contentObj.deletedForUserIds = [];
        if (!contentObj.deletedForUserIds.includes(userId)) {
          contentObj.deletedForUserIds.push(userId);
        }
        return await prisma.message.update({
          where: { id: messageId },
          data: { content: JSON.stringify(contentObj) }
        });
      } catch (err) {
        console.warn("DB deleteMessageForMe failed, using memory:", err);
      }
    }

    if (!msg.deletedForUserIds) msg.deletedForUserIds = [];
    if (!msg.deletedForUserIds.includes(userId)) {
      msg.deletedForUserIds.push(userId);
    }
    return msg;
  }

  async deleteMessageForEveryone(messageId: string): Promise<any> {
    const msg = await this.getMessageById(messageId);
    if (!msg) return null;

    if (prisma && !useDbFallback) {
      try {
        return await prisma.message.update({
          where: { id: messageId },
          data: { 
            content: "🚫 This message was deleted for everyone.",
            mediaUrl: null 
          }
        });
      } catch (err) {
        console.warn("DB deleteMessageForEveryone failed, using memory:", err);
      }
    }

    msg.content = "🚫 This message was deleted for everyone.";
    msg.mediaUrl = null;
    msg.isDeletedForEveryone = true;
    return msg;
  }

  async reactToMessage(messageId: string, userId: string, emoji: string): Promise<any> {
    const msg = await this.getMessageById(messageId);
    if (!msg) return null;

    if (prisma && !useDbFallback) {
      try {
        let contentObj: any = { text: msg.content, reactions: [] };
        if (msg.content && msg.content.startsWith('{')) {
          contentObj = JSON.parse(msg.content);
        }
        if (!contentObj.reactions) contentObj.reactions = [];
        // Remove existing reaction by same user
        contentObj.reactions = contentObj.reactions.filter((r: any) => r.userId !== userId);
        contentObj.reactions.push({ userId, emoji });
        
        return await prisma.message.update({
          where: { id: messageId },
          data: { content: JSON.stringify(contentObj) }
        });
      } catch (err) {
        console.warn("DB reactToMessage failed, using memory:", err);
      }
    }

    if (!msg.reactions) msg.reactions = [];
    msg.reactions = msg.reactions.filter((r: any) => r.userId !== userId);
    msg.reactions.push({ userId, emoji });
    return msg;
  }

  // ==========================================
  // PRESENCE
  // ==========================================

  async updateUserPresence(userId: string, online: boolean): Promise<any> {
    if (prisma && !useDbFallback) {
      try {
        return await prisma.userPresence.upsert({
          where: { userId },
          update: { online, lastSeen: new Date() },
          create: { userId, online, lastSeen: new Date() }
        });
      } catch (err) {
        console.warn("DB updateUserPresence failed, using memory:", err);
      }
    }

    const idx = isMemoryDb.userPresence.findIndex((p: any) => p.userId === userId);
    const presenceObj = { userId, online, lastSeen: new Date() };
    if (idx !== -1) {
      isMemoryDb.userPresence[idx] = presenceObj;
    } else {
      isMemoryDb.userPresence.push(presenceObj);
    }
    return presenceObj;
  }

  async getUserPresence(userId: string): Promise<any> {
    if (prisma && !useDbFallback) {
      try {
        return await prisma.userPresence.findUnique({ where: { userId } });
      } catch (err) {
        console.warn("DB getUserPresence failed, using memory:", err);
      }
    }

    return isMemoryDb.userPresence.find((p: any) => p.userId === userId) || { userId, online: false, lastSeen: null };
  }

  // ==========================================
  // SPAM & REPORTING CONTROL
  // ==========================================

  async createReport(conversationId: string, reporterId: string, reason: string): Promise<any> {
    const reportObj = {
      id: `rep-${Date.now()}`,
      conversationId,
      reporterId,
      reason,
      status: 'PENDING',
      createdAt: new Date()
    };
    if (isMemoryDb) {
      if (!(isMemoryDb as any).chatReports) {
        (isMemoryDb as any).chatReports = [] as any[];
      }
      (isMemoryDb as any).chatReports.push(reportObj);
    }
    
    // Also mark conversation as reported
    const conv = await this.getConversationById(conversationId);
    if (conv) {
      conv.status = 'REPORTED';
    }
    return reportObj;
  }

  async getReports(): Promise<any[]> {
    if (isMemoryDb) {
      if (!(isMemoryDb as any).chatReports) {
        (isMemoryDb as any).chatReports = [] as any[];
      }
      return (isMemoryDb as any).chatReports;
    }
    return [];
  }

  async blockUser(actingUserId: string, targetUserId: string): Promise<void> {
    if (isMemoryDb) {
      if (!(isMemoryDb as any).blockedUsers) {
        (isMemoryDb as any).blockedUsers = [] as any[];
      }
      (isMemoryDb as any).blockedUsers.push({
        id: `blk-${Date.now()}`,
        actingUserId,
        targetUserId,
        createdAt: new Date()
      });
    }
  }

  async isUserBlocked(userA: string, userB: string): Promise<boolean> {
    if (isMemoryDb) {
      if (!(isMemoryDb as any).blockedUsers) {
        (isMemoryDb as any).blockedUsers = [] as any[];
      }
      const record = (isMemoryDb as any).blockedUsers.find(
        (b: any) => (b.actingUserId === userA && b.targetUserId === userB) ||
                    (b.actingUserId === userB && b.targetUserId === userA)
      );
      return !!record;
    }
    return false;
  }

  async suspendUserInSystem(userId: string): Promise<void> {
    const user = isMemoryDb.users.find((u: any) => u.id === userId);
    if (user) {
      user.isSuspended = true;
    }
  }
}
