/**
 * CENTRALIZED API SYSTEM (Every-zone API Layer)
 * Aligns screens -> hooks -> services -> api -> backend
 */

export const api = {
  // 1. Authentication & OAuth
  auth: {
    async getGoogleUrl() {
      const res = await fetch("/api/auth/google/url");
      return res.json();
    },
    async fetchCurrentUser(token: string) {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Session expired.");
      return res.json();
    }
  },

  // 2. Wallet Operations
  wallet: {
    async getBalance(token: string) {
      const res = await fetch("/api/wallet/balance", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.json();
    },
    async deposit(token: string, amount: number, method: string) {
      const res = await fetch("/api/wallet/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount, method })
      });
      return res.json();
    },
    async transfer(token: string, toPhoneOrEmail: string, amount: number, note?: string) {
      const res = await fetch("/api/wallet/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ toPhoneOrEmail, amount, note })
      });
      return res.json();
    }
  },

  // 3. Marketplace Operations
  marketplace: {
    async fetchProducts() {
      const res = await fetch("/api/marketplace/products");
      return res.json();
    },
    async fetchVendors() {
      const res = await fetch("/api/marketplace/vendors");
      return res.json();
    }
  },

  // 4. Real Estate Operations
  realEstate: {
    async fetchProperties() {
      const res = await fetch("/api/realestate/properties");
      return res.json();
    },
    async bookAppointment(token: string, propertyId: string, dateTime: string, notes?: string) {
      const res = await fetch("/api/realestate/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ propertyId, dateTime, notes })
      });
      return res.json();
    }
  },

  // 5. Overseas Employment Services
  jobs: {
    async fetchJobs() {
      const res = await fetch("/api/overseas/jobs");
      return res.json();
    },
    async applyJob(token: string, jobId: string, documentUrl?: string) {
      const res = await fetch("/api/overseas/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ jobId, documentUrl })
      });
      return res.json();
    }
  },

  // 6. Matchmaking System
  matchmaking: {
    async fetchMatches(token: string) {
      const res = await fetch("/api/matchmaking/matches", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.json();
    },
    async action(token: string, profileId: string, action: "like" | "pass" | "block") {
      const res = await fetch("/api/matchmaking/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ profileId, action })
      });
      return res.json();
    }
  }
};
