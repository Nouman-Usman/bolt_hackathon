StudyGenius - AI Study Coach for Pakistani Board Exams
======================================================

Description
-----------

StudyGenius is an AI-powered learning platform designed to help Pakistani students excel in their board exams. It offers personalized study plans, AI-driven quizzes, flashcards, a chatbot tutor, and progress tracking, tailored to the Pakistani curriculum. The platform supports both English and Urdu languages, catering to a diverse student base.

Key Features
------------

*   **Personalized Study Plans**: AI-generated study schedules based on exam dates and available study time.
    
*   **AI-Powered Quizzes**: Adaptive quizzes to test knowledge and identify areas for improvement.
    
*   **Flashcards**: Interactive flashcards for memorizing key concepts.
    
*   **AI Tutor Chatbot**: 24/7 AI-powered tutor to answer questions and provide guidance.
    
*   **Progress Tracking**: Detailed analytics to monitor progress and identify strengths and weaknesses.
    
*   **Multi-Language Support**: Full support for both English and Urdu languages.
    
*   **Subscription Plans**: Offers free and premium subscription plans with varying levels of access.
    

Technology Stack
----------------

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React
    
*   **Backend**: Supabase (PostgreSQL, Authentication, Storage, Edge Functions), Stripe
    
*   **Other**: Stripe.js, React Router, recharts
    

Setup Instructions
------------------

1.  git clone cd
    
2.  npm install
    
3.  VITE\_SUPABASE\_URL=your\_supabase\_project\_urlVITE\_SUPABASE\_ANON\_KEY=your\_supabase\_anon\_keySUPABASE\_SERVICE\_ROLE\_KEY=your\_supabase\_service\_role\_keyVITE\_STRIPE\_PUBLISHABLE\_KEY=your\_stripe\_publishable\_keySTRIPE\_SECRET\_KEY=your\_stripe\_secret\_keySTRIPE\_WEBHOOK\_SECRET=your\_stripe\_webhook\_secret
    
4.  **Supabase Setup**:
    
    *   Create a Supabase project and update the .env file with your project URL and keys.
        
    *   Run the SQL migrations located in the supabase/migrations directory to create the necessary database tables.
        
    *   Set up the Supabase Edge Functions for Stripe integration (see "Stripe Integration" below).
        
5.  **Stripe Integration**:
    
    *   Create a Stripe account and obtain your API keys.
        
    *   Set up the Stripe webhook by deploying the stripe-webhook Edge Function.
        
    *   Configure the STRIPE\_WEBHOOK\_SECRET environment variable.
        
    *   Configure the create-checkout-session Edge Function for handling subscription signups.
        
6.  npm run dev
    

Key Components
--------------

*   **src/App.tsx**: Main application component that defines the routes and wraps the app with context providers.
    
*   **src/components/auth/ProtectedRoute.tsx**: Component for protecting routes that require authentication.
    
*   **src/contexts**: Contains context providers for authentication, user data, Stripe, and subscriptions.
    
*   **src/lib/supabase.ts**: Initializes the Supabase client and provides helper functions for interacting with the database.
    
*   **src/pages**: Contains the different pages of the application (Home, Onboarding, StudyPlan, Quiz, etc.).
    
*   **supabase/functions**:
    
    *   create-checkout-session: Creates a Stripe Checkout Session for handling subscriptions.
        
    *   stripe-webhook: Handles Stripe webhook events for subscription updates.
        
*   **supabase/migrations**: Contains the SQL migrations for setting up the database schema.
    

Stripe Integration
------------------

The application uses Stripe for handling payments and subscriptions. The key files involved in the Stripe integration are:

*   .env: Contains Stripe API keys and webhook secret.
    
*   src/contexts/StripeContext.tsx: Provides the Stripe context using @stripe/react-stripe-js.
    
*   src/pages/PricingPage.tsx and src/pages/EnhancedPricingPage.tsx: Handle subscription plan selection and initiation of the checkout process.
    
*   supabase/functions/create-checkout-session/index.ts: Creates Stripe checkout sessions.
    
*   supabase/functions/stripe-webhook/index.ts: Handles Stripe webhook events to update subscription statuses in the database.
    

Database Schema
---------------

The database schema is defined in the SQL migration file: supabase/migrations/20250612090657\_violet\_bonus.sql, which includes tables for:

*   Users
    
*   Subscriptions
    
*   Institutions
    
*   Study Plans
    
*   Study Sessions
    
*   Quizzes
    
*   Flashcards
    
*   Chat Conversations
    
*   User Progress
    
*   Campaigns
    
*   Add-on Purchases
    

Contributing
------------

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
    
2.  Create a new branch for your feature or bug fix.
    
3.  Make your changes and commit them with clear, descriptive messages.
    
4.  Test your changes thoroughly.
    
5.  Submit a pull request.
    

License
-------

This project is open source and available under the MIT License.
