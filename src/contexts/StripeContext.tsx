import React, { createContext, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

interface StripeContextType {
  // Add any Stripe-related context values here
}

const StripeContext = createContext<StripeContextType>({});

export const useStripe = () => useContext(StripeContext);

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeContext.Provider value={{}}>
        {children}
      </StripeContext.Provider>
    </Elements>
  );
};