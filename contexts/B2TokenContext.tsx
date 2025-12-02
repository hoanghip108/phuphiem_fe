'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface B2TokenContextType {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const B2TokenContext = createContext<B2TokenContextType>({
  token: null,
  loading: true,
  error: null,
});

export function B2TokenProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch token một lần khi component mount
    const fetchToken = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/b2/token');
        if (!response.ok) {
          throw new Error('Failed to get B2 token');
        }
        const data = (await response.json()) as { token: string };
        setToken(data.token);
        setError(null);
      } catch (err) {
        console.error('Error fetching B2 token:', err);
        setError('Failed to load image authorization');
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  return (
    <B2TokenContext.Provider value={{ token, loading, error }}>
      {children}
    </B2TokenContext.Provider>
  );
}

export function useB2Token() {
  return useContext(B2TokenContext);
}

