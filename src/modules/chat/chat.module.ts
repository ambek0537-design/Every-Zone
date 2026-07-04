import { Express } from 'express';
import { chatRouter, notificationsRouter } from './controllers/chat.controller';

export function registerChatModule(app: Express) {
  // Chat Module API Bindings (Standard and Client)
  app.use('/api/chat', chatRouter);
  app.use('/chat', chatRouter);

  // Notification Engine API Bindings
  app.use('/api/notifications', notificationsRouter);
  app.use('/notifications', notificationsRouter);

  console.log('⭐ [CHATS & NOTIFICATIONS MODULE] Fully registered Every-zone Secure Chat, FCM simulators, Presence trackers, and Notification Center.');
}
