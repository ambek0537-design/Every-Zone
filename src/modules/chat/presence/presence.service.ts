import { ChatRepository } from '../repositories/chat.repository';

export class PresenceService {
  private repository = new ChatRepository();

  async setUserOnline(userId: string, online: boolean) {
    return await this.repository.updateUserPresence(userId, online);
  }

  async getUserPresence(userId: string) {
    return await this.repository.getUserPresence(userId);
  }
}
