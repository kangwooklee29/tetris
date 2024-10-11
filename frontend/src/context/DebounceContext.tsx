// context/DebounceContext.tsx
import React, { createContext, useContext, useRef } from 'react';

interface DebounceProviderProps {
  children: React.ReactNode;
}

const DebounceContext = createContext<{ debounceRef: React.MutableRefObject<NodeJS.Timeout | null> }>({ debounceRef: { current: null } });

export const DebounceProvider: React.FC<DebounceProviderProps> = ({ children }) => {
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  return (
    <DebounceContext.Provider value={{ debounceRef }}>
      {children}
    </DebounceContext.Provider>
  );
};

export const useDebounce = () => useContext(DebounceContext);
