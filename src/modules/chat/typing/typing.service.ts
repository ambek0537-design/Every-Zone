export class TypingService {
  // Map of conversationId -> Set of userIds who are typing
  private activeTyping = new Map<string, Set<string>>();
  private timeouts = new Map<string, NodeJS.Timeout>();

  setTyping(conversationId: string, userId: string, isTyping: boolean): string[] {
    if (!this.activeTyping.has(conversationId)) {
      this.activeTyping.set(conversationId, new Set<string>());
    }

    const set = this.activeTyping.get(conversationId)!;
    const timeoutKey = `${conversationId}:${userId}`;

    // Clear any existing timeout
    if (this.timeouts.has(timeoutKey)) {
      clearTimeout(this.timeouts.get(timeoutKey));
      this.timeouts.delete(timeoutKey);
    }

    if (isTyping) {
      set.add(userId);
      // Auto-expire after 6 seconds
      const timeout = setTimeout(() => {
        set.delete(userId);
        this.timeouts.delete(timeoutKey);
      }, 6000);
      this.timeouts.set(timeoutKey, timeout);
    } else {
      set.delete(userId);
    }

    return Array.from(set);
  }

  getTypingUsers(conversationId: string): string[] {
    const set = this.activeTyping.get(conversationId);
    return set ? Array.from(set) : [];
  }
}
