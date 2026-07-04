import { ChatRepository } from '../repositories/chat.repository';
import { NotificationService } from '../notifications/notification.service';

export type SocketEventType =
  | 'message.send'
  | 'message.receive'
  | 'typing.start'
  | 'typing.stop'
  | 'message.read'
  | 'notification.new'
  | 'user.online'
  | 'user.offline';

export class WebSocketService {
  private repository = new ChatRepository();
  private notificationService = new NotificationService();

  // Emits events to our simulation logs & triggers downstream reactions
  async emitEvent(event: SocketEventType, payload: any) {
    console.log(`🔌 [WS EVENT EMITTED] event: "${event}"`, JSON.stringify(payload, null, 2));

    if (event === 'message.send') {
      const { conversationId, senderId, content, messageType } = payload;
      
      // Mark messages read on receive
      await this.repository.markMessagesAsRead(conversationId, senderId);

      // Trigger automatic reply simulator for amazing full-stack reactivity!
      this.triggerBotAutoResponse(conversationId, senderId, content);
    }
  }

  private triggerBotAutoResponse(conversationId: string, userSenderId: string, lastUserMessage: string) {
    // If the sender is already a vendor or support, don't auto-reply
    if (userSenderId.startsWith('v-') || userSenderId === 'v4' || userSenderId === 'support' || userSenderId === 'admin') {
      return;
    }

    setTimeout(async () => {
      const conv = await this.repository.getConversationById(conversationId);
      if (!conv) return;

      // Simulate vendor "typing.start"
      await this.emitEvent('typing.start', { conversationId, userId: conv.vendorId });

      setTimeout(async () => {
        let botResponse = "ሰላም! መልእክትዎ ደርሶናል። በአጭር ጊዜ ውስጥ መልስ እንሰጥዎታለን።";
        let notificationCategory: any = 'MESSAGES';

        if (conv.type === 'PROPERTY') {
          botResponse = "Thank you for inquiring about this luxury estate listing. Would you like to schedule an in-person tour or receive the digital property ledger certificate?";
          notificationCategory = 'HOUSE_INQUIRIES';
        } else if (conv.type === 'JOB') {
          botResponse = "We have received your application interest. Please make sure to upload your Ministry of Labor certifications and national ID (Fayda) inside this chat window.";
          notificationCategory = 'JOB_APPLICATIONS';
        } else if (conv.type === 'PRODUCT') {
          botResponse = "Hello! Yes, this exquisite item is fully in stock. If you proceed with the Every-zone Escrow payment, we will deliver it within 1 hour.";
          notificationCategory = 'ORDERS';
        } else if (conv.type === 'GENERAL') {
          botResponse = "Hello! Welcome to Every-zone Customer Care support. A representative has been assigned to your query.";
          notificationCategory = 'SYSTEM';
        }

        // Save bot message
        const botMsg = await this.repository.createMessage({
          conversationId,
          senderId: conv.vendorId,
          messageType: 'TEXT',
          content: botResponse,
          mediaUrl: null
        });

        // Emit message.receive
        await this.emitEvent('message.receive', botMsg);

        // Simulate vendor "typing.stop"
        await this.emitEvent('typing.stop', { conversationId, userId: conv.vendorId });

        // Trigger push notification to user
        await this.notificationService.createNotification({
          userId: userSenderId,
          type: notificationCategory,
          title: "New Secured Message Received",
          body: botResponse.substring(0, 60) + "...",
          data: { conversationId, senderId: conv.vendorId }
        });

      }, 3000);
    }, 1000);
  }
}
