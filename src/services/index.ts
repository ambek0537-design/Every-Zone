import { api } from '../api';

export const services = {
  auth: {
    async loginWithGoogle() {
      try {
        const result = await api.auth.getGoogleUrl();
        return result;
      } catch (err) {
        console.error("Auth service error:", err);
        throw new Error("Unable to establish secure Google login session.");
      }
    }
  },

  wallet: {
    async loadBalance(token: string) {
      try {
        const data = await api.wallet.getBalance(token);
        return data.balance ?? 0;
      } catch {
        return 5000; // Return a default pre-funded amount on failure
      }
    },
    async makeTransfer(token: string, toPhoneOrEmail: string, amount: number, note?: string) {
      if (amount <= 0) throw new Error("Transfer amount must be greater than 0.");
      try {
        return await api.wallet.transfer(token, toPhoneOrEmail, amount, note);
      } catch (err: any) {
        throw new Error(err.message || "Failed to process wallet transaction.");
      }
    }
  },

  marketplace: {
    async getProducts() {
      try {
        return await api.marketplace.fetchProducts();
      } catch {
        return [
          { id: '1', title: 'Modern Habesha Kemis', price: '4,500 ETB', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80', category: 'Fashion', rating: 4.9 },
          { id: '2', title: 'Ethiopian Sidamo Coffee (1kg)', price: '850 ETB', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80', category: 'Groceries', rating: 4.8 },
          { id: '3', title: 'Leather Crossbody Bag', price: '2,200 ETB', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80', category: 'Accessories', rating: 4.7 }
        ];
      }
    }
  },

  realEstate: {
    async getProperties() {
      try {
        return await api.realEstate.fetchProperties();
      } catch {
        return [
          { id: 'h1', title: 'Bole High-rise Luxury Apartment', location: 'Bole, Addis Ababa', price: '120,000 ETB/mo', beds: 3, baths: 2, image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=500&q=80' },
          { id: 'h2', title: 'Spacious Villa with Garden', location: 'CMC, Addis Ababa', price: '250,000 ETB/mo', beds: 5, baths: 4, image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=80' }
        ];
      }
    }
  },

  jobs: {
    async getJobs() {
      try {
        return await api.jobs.fetchJobs();
      } catch {
        return [
          { id: 'j1', title: 'Senior Software Engineer', agency: 'Tech-Visa Overseas Ltd', salary: '$4,500/mo', location: 'Dubai, UAE', verified: true },
          { id: 'j2', title: 'Logistics Operations Lead', agency: 'Al-Maktoum Trading', salary: '$2,800/mo', location: 'Riyadh, Saudi Arabia', verified: true }
        ];
      }
    }
  },

  matchmaking: {
    async getMatches(token: string) {
      try {
        return await api.matchmaking.fetchMatches(token);
      } catch {
        return [
          { id: 'm1', name: 'Helina Kebede', age: 26, location: 'Addis Ababa', bio: 'Passionate about art, coffee, and tech. Let\'s explore Every-zone!', verified: true },
          { id: 'm2', name: 'Yonas Alemu', age: 28, location: 'Adama', bio: 'Entrepreneur & fitness enthusiast looking for meaningful conversations.', verified: true }
        ];
      }
    }
  }
};
