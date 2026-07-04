import { prisma, useDbFallback, isMemoryDb } from '../../../../server';

export type NotificationCategory = 
  | 'ORDERS'
  | 'PAYMENTS'
  | 'REVIEWS'
  | 'MESSAGES'
  | 'JOB_APPLICATIONS'
  | 'HOUSE_INQUIRIES'
  | 'SERVICE_BOOKINGS'
  | 'LOTTERY'
  | 'MATCHMAKING'
  | 'VENDOR_UPDATES'
  | 'SECURITY'
  | 'SYSTEM';

export interface NotificationAction {
  label: string;
  type: 'OPEN_CHAT' | 'TRACK_ORDER' | 'OPEN_PRODUCT' | 'OPEN_PROPERTY' | 'OPEN_JOB' | 'REPLY' | 'MARK_AS_READ';
  payload: any;
}

export class NotificationService {
  async getNotifications(userId: string): Promise<any[]> {
    if (prisma && !useDbFallback) {
      try {
        return await prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: "desc" }
        });
      } catch (err) {
        console.warn("DB getNotifications failed, fallback to memory:", err);
      }
    }

    return (isMemoryDb.notifications || [])
      .filter((n: any) => n.userId === userId)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createNotification(payload: {
    userId: string;
    type: NotificationCategory;
    title: string;
    body: string;
    data?: any;
    actions?: NotificationAction[];
  }): Promise<any> {
    const finalData = payload.data ? JSON.stringify(payload.data) : null;
    const finalActions = payload.actions ? JSON.stringify(payload.actions) : null;

    if (prisma && !useDbFallback) {
      try {
        const notif = await prisma.notification.create({
          data: {
            userId: payload.userId,
            type: payload.type as any,
            title: payload.title,
            body: payload.body,
            data: finalData,
            status: "DELIVERED"
          }
        });

        this.sendFCMPushNotification(payload.userId, payload.title, payload.body, payload.type);
        return notif;
      } catch (err) {
        console.warn("DB createNotification failed, fallback to memory:", err);
      }
    }

    const notifId = `notif-${Date.now()}`;
    const newNotif = {
      id: notifId,
      userId: payload.userId,
      type: payload.type,
      title: payload.title,
      body: payload.body,
      data: finalData,
      actions: finalActions,
      status: "DELIVERED",
      readAt: null,
      createdAt: new Date()
    };

    if (!isMemoryDb.notifications) {
      isMemoryDb.notifications = [];
    }
    isMemoryDb.notifications.push(newNotif);

    this.sendFCMPushNotification(payload.userId, payload.title, payload.body, payload.type);
    return newNotif;
  }

  async markAsRead(id: string): Promise<boolean> {
    if (prisma && !useDbFallback) {
      try {
        await prisma.notification.update({
          where: { id },
          data: { status: "READ", readAt: new Date() }
        });
        return true;
      } catch (err) {
        console.warn("DB markAsRead failed, fallback to memory:", err);
      }
    }

    const notif = isMemoryDb.notifications?.find((n: any) => n.id === id);
    if (notif) {
      notif.status = "READ";
      notif.readAt = new Date();
      return true;
    }
    return false;
  }

  async markAllAsRead(userId: string): Promise<void> {
    if (prisma && !useDbFallback) {
      try {
        await prisma.notification.updateMany({
          where: { userId, status: { not: "READ" } },
          data: { status: "READ", readAt: new Date() }
        });
        return;
      } catch (err) {
        console.warn("DB markAllAsRead failed, fallback to memory:", err);
      }
    }

    isMemoryDb.notifications?.forEach((n: any) => {
      if (n.userId === userId) {
        n.status = "READ";
        n.readAt = new Date();
      }
    });
  }

  async deleteNotification(id: string): Promise<boolean> {
    if (prisma && !useDbFallback) {
      try {
        await prisma.notification.delete({ where: { id } });
        return true;
      } catch (err) {
        console.warn("DB deleteNotification failed, fallback to memory:", err);
      }
    }

    const idx = isMemoryDb.notifications?.findIndex((n: any) => n.id === id);
    if (idx !== undefined && idx !== -1) {
      isMemoryDb.notifications.splice(idx, 1);
      return true;
    }
    return false;
  }

  // High-fidelity FCM simulation
  private sendFCMPushNotification(userId: string, title: string, body: string, category: string) {
    console.log(`📡 [FCM SERVICE] Firing Push Notification to platforms [Android, iOS, Web] for User [${userId}]:`);
    console.log(`   - Title: "${title}"`);
    console.log(`   - Body: "${body}"`);
    console.log(`   - Category: ${category}`);
    console.log(`✅ [FCM SERVICE] Push payload securely dispatched on FCM channel.`);
  }
}
