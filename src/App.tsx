import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { StripeProvider } from './contexts/StripeContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import StudyPlanPage from './pages/StudyPlanPage';
import QuizPage from './pages/QuizPage';
import FlashcardsPage from './pages/FlashcardsPage';
import DashboardPage from './pages/DashboardPage';
import ChatbotPage from './pages/ChatbotPage';
import SettingsPage from './pages/SettingsPage';
import EnhancedPricingPage from './pages/EnhancedPricingPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <AuthProvider>
      <StripeProvider>
        <SubscriptionProvider>
          <UserProvider>
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/pricing" element={<EnhancedPricingPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<HomePage />} />
                <Route path="onboarding" element={<OnboardingPage />} />
                <Route path="study-plan" element={<StudyPlanPage />} />
                <Route path="quiz" element={<QuizPage />} />
                <Route path="flashcards" element={<FlashcardsPage />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="chat" element={<ChatbotPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </UserProvider>
        </SubscriptionProvider>
      </StripeProvider>
    </AuthProvider>
  );
}

export default App;