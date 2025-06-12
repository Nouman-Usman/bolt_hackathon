Project Title: StudyGenius - AI Study Coach for Pakistani Board Exams

Description:
StudyGenius is an AI-powered learning platform designed to help Pakistani students excel in their board exams. It offers personalized study plans, AI-driven quizzes, flashcards, a chatbot tutor, and progress tracking, tailored to the Pakistani curriculum. The platform supports both English and Urdu languages, catering to a diverse student base.

Key Features:

Personalized Study Plans: AI-generated study schedules based on exam dates and available study time.
AI-Powered Quizzes: Adaptive quizzes to test knowledge and identify areas for improvement.
Flashcards: Interactive flashcards for memorizing key concepts.
AI Tutor Chatbot: 24/7 AI-powered tutor to answer questions and provide guidance.
Progress Tracking: Detailed analytics to monitor progress and identify strengths and weaknesses.
Multi-Language Support: Full support for both English and Urdu languages.
Subscription Plans: Offers free and premium subscription plans with varying levels of access.
Folder Structure:

nouman-usman-bolt_hackathon/
├── README.md
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── .env.example
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── common/
│   │   │   ├── LanguageToggle.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── PremiumBadge.tsx
│   │   │   ├── ProgressCard.tsx
│   │   │   └── UpgradePrompt.tsx
│   │   ├── dashboard/
│   │   │   ├── QuickActionCard.tsx
│   │   │   └── StudyStreakCard.tsx
│   │   ├── layout/
│   │   │   └── Layout.tsx
│   │   └── payment/
│   │       ├── AddOnCard.tsx
│   │       ├── CampaignBanner.tsx
│   │       ├── CheckoutForm.tsx
│   │       ├── InstitutionalPricing.tsx
│   │   └── PricingCard.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── StripeContext.tsx
│   │   ├── SubscriptionContext.tsx
│   │   └── UserContext.tsx
│   ├── lib/
│   │   └── supabase.ts
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   ├── ChatbotPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── EnhancedPricingPage.tsx
│   │   ├── FlashcardsPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── OnboardingPage.tsx
│   │   ├── PaymentSuccessPage.tsx
│   │   ├── PricingPage.tsx
│   │   ├── QuizPage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── StudyPlanPage.tsx
│   ├── types/
│   │   ├── database.ts
│   │   ├── study.ts
│   │   ├── subscription.ts
│   │   └── user.ts
│   └── utils/
│       └── translations.ts
├── supabase/
│   ├── functions/
│   │   ├── create-checkout-session/
│   │   │   └── index.ts
│   │   └── stripe-webhook/
│   │       └── index.ts
│   └── migrations/
│       └── 20250612090657_violet_bonus.sql
└── .bolt/
    ├── config.json
    └── prompt
Technology Stack:

Frontend: React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React
Backend: Supabase (PostgreSQL, Authentication, Storage, Edge Functions), Stripe
Other: Stripe.js, React Router, recharts
Setup Instructions:

Clone the repository:

git clone <repository_url>
cd <repository_directory>
Install dependencies:

npm install
Environment Variables:
Create a .env file in the root directory and add the following environment variables:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
Supabase Setup:

Create a Supabase project and update the .env file with your project URL and keys.
Run the SQL migrations located in the supabase/migrations directory to create the necessary database tables.
Set up the Supabase Edge Functions for Stripe integration (see "Stripe Integration" below).
Stripe Integration:

Create a Stripe account and obtain your API keys.
Set up the Stripe webhook by deploying the stripe-webhook Edge Function. Make sure to configure the STRIPE_WEBHOOK_SECRET environment variable.
Configure the create-checkout-session Edge Function for handling subscription signups.
Run the Application:

npm run dev
Key Components:

src/App.tsx: Main application component that defines the routes and wraps the app with context providers.
src/components/auth/ProtectedRoute.tsx: Component for protecting routes that require authentication.
src/contexts: Contains context providers for authentication, user data, Stripe, and subscriptions.
src/lib/supabase.ts: Initializes the Supabase client and provides helper functions for interacting with the database.
src/pages: Contains the different pages of the application (Home, Onboarding, StudyPlan, Quiz, etc.).
supabase/functions: Contains the Supabase Edge Functions for Stripe integration:
create-checkout-session: Creates a Stripe Checkout Session for handling subscriptions.
stripe-webhook: Handles Stripe webhook events for subscription updates.
supabase/migrations: Contains the SQL migrations for setting up the database schema.
Stripe Integration:

The application uses Stripe for handling payments and subscriptions. The key files involved in the Stripe integration are:

.env: Contains Stripe API keys and webhook secret.
src/contexts/StripeContext.tsx: Provides the Stripe context using @stripe/react-stripe-js.
src/pages/PricingPage.tsx and src/pages/EnhancedPricingPage.tsx: Handle subscription plan selection and initiation of the checkout process.
supabase/functions/create-checkout-session/index.ts: Creates Stripe checkout sessions.
supabase/functions/stripe-webhook/index.ts: Handles Stripe webhook events to update subscription statuses in the database.
Database Schema:
The database schema is defined in the SQL migration file: supabase/migrations/20250612090657_violet_bonus.sql which includes tables for:

Users
Subscriptions
Institutions
Study Plans
Study Sessions
Quizzes
Flashcards
Chat Conversations
User Progress
Campaigns
Add-on Purchases
Contributing:
Contributions are welcome! Please follow these steps:

Fork the repository.
Create a new branch for your feature or bug fix.
Make your changes and commit them with clear, descriptive messages.
Test your changes thoroughly.
Submit a pull request.
License:
This project is open source and available under the MIT License.
