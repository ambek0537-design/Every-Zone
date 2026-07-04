export interface UserInterestProfile {
  userId: string;
  preferredCategories: string[];
  preferredLocation: string;
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  budgetMin?: number;
  budgetMax?: number;
  languages: string[];
}

export class UserInterestService {
  private profiles = new Map<string, UserInterestProfile>();

  getUserProfile(userId: string): UserInterestProfile {
    let profile = this.profiles.get(userId);
    if (!profile) {
      profile = {
        userId,
        preferredCategories: ["cat-1", "cat-2"],
        preferredLocation: "Addis Ababa",
        languages: ["English", "Amharic"]
      };
      this.profiles.set(userId, profile);
    }
    return profile;
  }

  updateUserProfile(userId: string, updates: Partial<UserInterestProfile>): UserInterestProfile {
    const existing = this.getUserProfile(userId);
    const updated = { ...existing, ...updates };
    this.profiles.set(userId, updated);
    return updated;
  }
}
