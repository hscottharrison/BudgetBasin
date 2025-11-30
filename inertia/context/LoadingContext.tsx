import React, { createContext, ReactNode, useEffect } from 'react'

export interface LoadingContextProps {
  isLoading: boolean;
}

export const LoadingContext = createContext<LoadingContextProps>({ isLoading: false });

export const LoadingProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = async function (input, init) {
      setIsLoading(true);
      try {
        const response = await originalFetch(input, init);
        setIsLoading(false);
        return response;
      } catch (error) {
        setIsLoading(false);
        throw error; // Re-throw to propagate the error
      }
    };
  }, [])

  const value= {
    isLoading,
  }
  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => React.useContext(LoadingContext);
