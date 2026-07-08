import { useState, useEffect, useCallback } from 'react';
import { services } from '../services';

// 1. Authentication Hook
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('ez_user_token');
    const storedEmail = localStorage.getItem('ez_user_email');
    const storedName = localStorage.getItem('ez_user_fullName');
    const storedRole = localStorage.getItem('ez_user_role');

    if (storedToken && storedEmail) {
      setToken(storedToken);
      setUser({
        email: storedEmail,
        fullName: storedName || "Every-zone User",
        role: storedRole || "BUYER",
      });
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setToken(null);
  }, []);

  return { user, token, loading, logout, isAuthenticated: !!user };
}

// 2. Wallet Ecosystem Hook
export function useWallet() {
  const [balance, setBalance] = useState<number>(5000);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchBalance = useCallback(async () => {
    setLoading(true);
    try {
      const storedToken = localStorage.getItem('ez_user_token') || 'dummy';
      const bal = await services.wallet.loadBalance(storedToken);
      setBalance(bal);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendFunds = useCallback(async (to: string, amount: number, note?: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('ez_user_token') || 'dummy';
      const result = await services.wallet.makeTransfer(token, to, amount, note);
      
      // Update local state directly to reflect immediate changes in UI
      setBalance(prev => prev - amount);
      const newTx = {
        id: `tx_${Date.now()}`,
        type: 'Transfer',
        amount: `-${amount} ETB`,
        recipient: to,
        note: note || 'Every-zone Transfer',
        date: new Date().toLocaleDateString()
      };
      setTransactions(prev => [newTx, ...prev]);
      return result;
    } catch (err: any) {
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { balance, loading, transactions, fetchBalance, sendFunds };
}

// 3. Marketplace & Shop Hook
export function useMarketplace() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const prods = await services.marketplace.getProducts();
      setProducts(prods);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, loading, loadProducts };
}

// 4. Real Estate Hook
export function useRealEstate() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    try {
      const props = await services.realEstate.getProperties();
      setProperties(props);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { properties, loading, loadProperties };
}

// 5. Overseas Employment Hook
export function useJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const list = await services.jobs.getJobs();
      setJobs(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { jobs, loading, loadJobs };
}

// 6. Matchmaking Hook
export function useMatchmaking() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMatches = useCallback(async () => {
    setLoading(true);
    try {
      const list = await services.matchmaking.getMatches('dummy');
      setMatches(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { matches, loading, loadMatches };
}
