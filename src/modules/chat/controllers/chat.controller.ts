import { Router, Request, Response } from 'express';
import { ChatService } from '../services/chat.service';
import { AttachmentService } from '../attachments/attachment.service';
import { TypingService } from '../typing/typing.service';
import { PresenceService } from '../presence/presence.service';
import { NotificationService } from '../notifications/notification.service';
import { WebSocketService } from '../websocket/websocket.service';

export const chatRouter = Router();
export const notificationsRouter = Router();

const chatService = new ChatService();
const attachmentService = new AttachmentService();
const typingService = new TypingService();
const presenceService = new PresenceService();
const notificationService = new NotificationService();
const wsService = new WebSocketService();

// =========================================================================
// 1. CHAT & MESSAGING CONTROLLER
// =========================================================================

// GET /chat (conversations list)
chatRouter.get('/', async (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'u-2'; // Default: Selamawit Tekle
  try {
    const list = await chatService.startConversation({ buyerId: userId, vendorId: 'v-1' }); // Ensure default exists
    const conversations = await chatService['repository'].getConversations(userId);

    // Hydrate names/avatars
    const hydrated = conversations.map(c => {
      let recipientName = 'User';
      let recipientAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100';
      const otherId = c.buyerId === userId ? c.vendorId : c.buyerId;

      if (otherId === 'v-1') {
        recipientName = 'Bole Premium Habesha Wear';
        recipientAvatar = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=100';
      } else if (otherId === 'v-2') {
        recipientName = 'Makeda Organic Coffee Shop';
        recipientAvatar = 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&q=80&w=100';
      } else if (otherId === 'v4') {
        recipientName = 'Aura Premium Properties';
        recipientAvatar = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100';
      } else if (otherId === 'support') {
        recipientName = 'Every-zone Customer Support';
        recipientAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100';
      } else if (otherId === 'admin') {
        recipientName = 'System Administrator Node';
        recipientAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100';
      }

      return {
        ...c,
        recipientName,
        recipientAvatar
      };
    });

    return res.status(200).json({ status: 'success', conversations: hydrated });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to load conversations', detail: error.message });
  }
});

// GET /chat/conversations (compatibility alias)
chatRouter.get('/conversations', async (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'u-2';
  try {
    const conversations = await chatService['repository'].getConversations(userId);
    const hydrated = conversations.map(c => {
      let recipientName = 'Merchant Partner';
      let recipientAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100';
      const otherId = c.buyerId === userId ? c.vendorId : c.buyerId;

      if (otherId === 'v-1') {
        recipientName = 'Bole Premium Habesha Wear';
        recipientAvatar = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=100';
      } else if (otherId === 'v-2') {
        recipientName = 'Makeda Organic Coffee Shop';
        recipientAvatar = 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?auto=format&fit=crop&q=80&w=100';
      } else if (otherId === 'v4') {
        recipientName = 'Aura Premium Properties';
        recipientAvatar = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100';
      } else if (otherId === 'support') {
        recipientName = 'Every-zone Customer Support';
        recipientAvatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100';
      }

      return {
        ...c,
        recipientName,
        recipientAvatar
      };
    });
    return res.status(200).json({ status: 'success', conversations: hydrated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /chat/:conversationId (messages stream)
chatRouter.get('/:conversationId', async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const userId = (req.query.userId as string) || 'u-2';
  try {
    const messages = await chatService.getMessages(conversationId, userId);
    return res.status(200).json({ status: 'success', messages });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to load messages', detail: error.message });
  }
});

// GET /chat/:conversationId/messages (compatibility alias)
chatRouter.get('/:conversationId/messages', async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const userId = (req.query.userId as string) || 'u-2';
  try {
    const messages = await chatService.getMessages(conversationId, userId);
    return res.status(200).json({ status: 'success', messages });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /chat/start (initialize new buyer/seller/agent transaction thread)
chatRouter.post('/start', async (req: Request, res: Response) => {
  const { buyerId, vendorId, type } = req.body;
  try {
    const conv = await chatService.startConversation({ buyerId, vendorId, type });
    return res.status(201).json({ status: 'success', conversation: conv });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /chat/send (send regular and enriched card messages)
chatRouter.post('/send', async (req: Request, res: Response) => {
  const { conversationId, senderId, messageType, content, mediaUrl, replyToMessageId, cardMetadata } = req.body;
  try {
    const msg = await chatService.sendMessage({
      conversationId,
      senderId,
      messageType,
      content,
      mediaUrl,
      replyToMessageId,
      cardMetadata
    });

    // Fire simulated socket pipeline event
    await wsService.emitEvent('message.send', {
      conversationId,
      senderId,
      content,
      messageType: messageType || 'TEXT'
    });

    return res.status(201).json({ status: 'success', message: msg });
  } catch (error: any) {
    return res.status(400).json({ error: 'Spam/Validation alert', message: error.message });
  }
});

// POST /chat/upload (upload message attachment/voice note/documents)
chatRouter.post('/upload', async (req: Request, res: Response) => {
  const { conversationId, senderId, content, messageType, fileName, fileUrl, fileSize } = req.body;
  try {
    const baseMsg = await chatService.sendMessage({
      conversationId,
      senderId,
      messageType: messageType || 'FILE',
      content: content || `Shared an attachment: ${fileName || 'document.pdf'}`
    });

    // Attach high fidelity specs
    const attachment = await attachmentService.processAttachment(baseMsg.id, {
      fileName: fileName || 'specification.pdf',
      fileUrl: fileUrl || '',
      fileSize: fileSize || '1.4 MB',
      type: messageType || 'FILE'
    });

    const fullMsg = {
      ...baseMsg,
      attachments: [attachment]
    };

    // Fire simulated WS Event
    await wsService.emitEvent('message.send', {
      conversationId,
      senderId,
      content: content || `Shared an attachment: ${fileName}`,
      messageType: messageType || 'FILE'
    });

    return res.status(201).json({ status: 'success', message: fullMsg });
  } catch (error: any) {
    return res.status(500).json({ error: 'Upload parameters rejected', detail: error.message });
  }
});

// PATCH /chat/read (mark messages read)
chatRouter.patch('/read', async (req: Request, res: Response) => {
  const { conversationId, userId } = req.body;
  if (!conversationId || !userId) {
    return res.status(400).json({ error: 'conversationId and userId are required.' });
  }
  try {
    await chatService['repository'].markMessagesAsRead(conversationId, userId);
    await wsService.emitEvent('message.read', { conversationId, userId });
    return res.status(200).json({ status: 'success', message: 'Thread marked as read.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /chat/message (soft delete for me or hard delete for everyone)
chatRouter.delete('/message', async (req: Request, res: Response) => {
  const { messageId, userId, type } = req.body; // type can be 'FOR_ME' or 'EVERYONE'
  if (!messageId) {
    return res.status(400).json({ error: 'messageId is required.' });
  }
  try {
    if (type === 'EVERYONE') {
      await chatService.deleteForEveryone(messageId);
    } else {
      await chatService.deleteForMe(messageId, userId || 'u-2');
    }
    return res.status(200).json({ status: 'success', message: 'Message successfully deleted.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /chat/react (react with emojis)
chatRouter.post('/react', async (req: Request, res: Response) => {
  const { messageId, userId, emoji } = req.body;
  try {
    const updated = await chatService.reactToMessage(messageId, userId, emoji);
    return res.status(200).json({ status: 'success', message: updated });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /chat/report (report a spamming/fraudulent contact)
chatRouter.post('/report', async (req: Request, res: Response) => {
  const { conversationId, reporterId, reason } = req.body;
  try {
    const rep = await chatService.reportConversation(conversationId, reporterId, reason);
    return res.status(201).json({ status: 'success', report: rep, message: 'Chat successfully flagged for admin moderation.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /chat/presence (presence update)
chatRouter.post('/presence', async (req: Request, res: Response) => {
  const { userId, online } = req.body;
  try {
    await presenceService.setUserOnline(userId, online);
    await wsService.emitEvent(online ? 'user.online' : 'user.offline', { userId });
    return res.status(200).json({ status: 'success', online });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /chat/presence/:userId (get presence)
chatRouter.get('/presence/:userId', async (req: Request, res: Response) => {
  try {
    const pres = await presenceService.getUserPresence(req.params.userId);
    return res.status(200).json({ status: 'success', presence: pres });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /chat/typing (typing start/stop indicator)
chatRouter.post('/typing', async (req: Request, res: Response) => {
  const { conversationId, userId, isTyping } = req.body;
  try {
    const active = typingService.setTyping(conversationId, userId, isTyping);
    await wsService.emitEvent(isTyping ? 'typing.start' : 'typing.stop', { conversationId, userId });
    return res.status(200).json({ status: 'success', activeTypingUsers: active });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /chat/typing/:conversationId
chatRouter.get('/typing/:conversationId', async (req: Request, res: Response) => {
  try {
    const active = typingService.getTypingUsers(req.params.conversationId);
    return res.status(200).json({ status: 'success', activeTypingUsers: active });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});


// =========================================================================
// 2. ADMIN CONTROLS CONTROLLER
// =========================================================================

chatRouter.get('/admin/reports', async (req: Request, res: Response) => {
  try {
    const reports = await chatService.getReportedChats();
    return res.status(200).json({ status: 'success', reports });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

chatRouter.post('/admin/block', async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    await chatService.blockSpamUser(userId);
    return res.status(200).json({ status: 'success', message: 'User suspended in Every-zone.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

chatRouter.get('/admin/export/:conversationId', async (req: Request, res: Response) => {
  try {
    const log = await chatService.exportEvidence(req.params.conversationId);
    res.setHeader('Content-Type', 'application/json');
    res.attachment(`audit_log_${req.params.conversationId}.json`);
    return res.status(200).send(log);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});


// =========================================================================
// 3. NOTIFICATION CENTER CONTROLLER
// =========================================================================

// GET /notifications (retrieve list categorized)
notificationsRouter.get('/', async (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'u-2';
  try {
    const list = await notificationService.getNotifications(userId);
    return res.status(200).json({ status: 'success', notifications: list });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /notifications (inject dummy test notification for high fidelity preview)
notificationsRouter.post('/', async (req: Request, res: Response) => {
  const { userId, type, title, body, data, actions } = req.body;
  try {
    const notif = await notificationService.createNotification({
      userId: userId || 'u-2',
      type: type || 'SYSTEM',
      title: title || 'Fayda Guard Notification Center',
      body: body || 'Your secure Escrow is active.',
      data,
      actions
    });
    return res.status(201).json({ status: 'success', notification: notif });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// PATCH /notifications/read (mark single or all as read)
notificationsRouter.patch('/read', async (req: Request, res: Response) => {
  const { id, userId } = req.body;
  try {
    if (id) {
      await notificationService.markAsRead(id);
    } else if (userId) {
      await notificationService.markAllAsRead(userId);
    } else {
      return res.status(400).json({ error: 'Either id or userId must be specified.' });
    }
    return res.status(200).json({ status: 'success', message: 'Notifications marked as read.' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /notifications/:id (delete single notification)
notificationsRouter.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const ok = await notificationService.deleteNotification(id);
    if (ok) {
      return res.status(200).json({ status: 'success', message: 'Notification successfully deleted.' });
    } else {
      return res.status(404).json({ error: 'Notification not found' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});
