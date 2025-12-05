'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

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
        const responseText = await response.text();

        if (!response.ok) {
          // Đọc error message từ response body nếu có
          let errorMessage = 'Failed to get B2 token';

          try {
            const errorData = JSON.parse(responseText) as {
              error?: string;
              status?: number;
            };
            if (errorData.error) {
              errorMessage = errorData.error;
            }
          } catch {
            // Nếu không parse được JSON, dùng text trực tiếp
            if (responseText) {
              errorMessage = responseText;
            }
          }

          // Thêm thông báo cụ thể cho lỗi 401
          if (response.status === 401) {
            errorMessage =
              'B2 authorization token is invalid or expired. Please check B2_AUTHORIZATION_TOKEN configuration.';
          }

          console.error(
            'B2 token API error:',
            errorMessage,
            'Status:',
            response.status
          );
          throw new Error(errorMessage);
        }

        const data = JSON.parse(responseText) as { token: string };
        setToken(data.token);
        setError(null);
      } catch (err) {
        console.error('Error fetching B2 token:', err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to load image authorization';
        setError(errorMessage);
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
