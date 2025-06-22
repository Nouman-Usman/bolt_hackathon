import React, { createContext, useContext } from 'react';

interface StripeContextType {
  // Placeholder for future Stripe integration
}

const StripeContext = createContext<StripeContextType>({});

export const useStripe = () => useContext(StripeContext);

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StripeContext.Provider value={{}}>
      {children}
    </StripeContext.Provider>
  );
};