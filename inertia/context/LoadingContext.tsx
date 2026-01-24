import React, { createContext, ReactNode, useEffect, useState, useRef } from 'react'

export interface LoadingContextProps {
  isLoading: boolean;
}

export const LoadingContext = createContext<LoadingContextProps>({ isLoading: false });

export const LoadingProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [activeRequests, setActiveRequests] = useState(0);
  const originalFetchRef = useRef<typeof window.fetch | null>(null);

  const isLoading = activeRequests > 0;

  useEffect(() => {
    originalFetchRef.current = window.fetch;
    const originalFetch = originalFetchRef.current;

    window.fetch = async function (input, init) {
      setActiveRequests((prev) => prev + 1);
      try {
        const response = await originalFetch(input, init);
        return response;
      } finally {
        setActiveRequests((prev) => prev - 1);
      }
    };

    return () => {
      if (originalFetchRef.current) {
        window.fetch = originalFetchRef.current;
      }
    };
  }, []);

  const value = {
    isLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => React.useContext(LoadingContext);
