import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { auth, db, security } from '../lib/supabase';
import { UserProfile } from '../types/user';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  emailVerified: boolean;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<{ error: any; needsVerification?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  refreshSession: () => Promise<void>;
  resendVerification: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userProfile: null,
  loading: true,
  emailVerified: false,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  updatePassword: async () => ({ error: null }),
  updateProfile: async () => ({ error: null }),
  refreshSession: async () => {},
  resendVerification: async () => ({ error: null }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session: currentSession } = await auth.getCurrentSession();
        
        if (mounted) {
          console.log('Initial session:', currentSession?.user?.email);
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setEmailVerified(currentSession?.user?.email_confirmed_at ? true : false);
          
          if (currentSession?.user) {
            await loadUserProfile(currentSession.user.id);
          } else {
            // No session, set loading to false immediately
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setEmailVerified(session?.user?.email_confirmed_at ? true : false);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading user profile for:', userId);
      const { data, error } = await db.getUser(userId);
      
      if (error) {
        console.error('Error loading user profile:', error);
        // If error is because user doesn't exist, that's okay - they need onboarding
        setUserProfile(null);
        setLoading(false);
        return;
      }
      
      if (data) {
        console.log('User profile loaded:', data.name);
        setUserProfile({
          id: data.id,
          name: data.name,
          email: data.email,
          grade: data.grade as any,
          board: data.board as any,
          subjects: data.subjects as any[],
          languagePreference: data.language_preference as any,
          examDate: data.exam_date || undefined,
          weeklyAvailableHours: data.weekly_available_hours || undefined,
          createdAt: new Date(data.created_at),
          lastActive: data.last_active ? new Date(data.last_active) : undefined,
        });
      } else {
        console.log('No user profile found, user needs onboarding');
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
    } finally {
      // Always set loading to false after attempting to load profile
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      // Validate inputs
      if (!security.validateEmail(email)) {
        return { error: { message: 'Please enter a valid email address' } };
      }

      const passwordValidation = security.validatePassword(password);
      if (!passwordValidation.isValid) {
        return { error: { message: passwordValidation.errors[0] } };
      }

      // Sanitize inputs
      const sanitizedEmail = security.sanitizeInput(email.toLowerCase());
      const sanitizedName = security.sanitizeInput(userData.name || '');

      const { data, error } = await auth.signUp(sanitizedEmail, password, {
        name: sanitizedName,
        grade: userData.grade,
        board: userData.board,
        subjects: userData.subjects,
        language_preference: userData.languagePreference,
        exam_date: userData.examDate,
        weekly_available_hours: userData.weeklyAvailableHours,
      });

      if (error) {
        return { error };
      }

      if (data.user && !data.user.email_confirmed_at) {
        return { error: null, needsVerification: true };
      }

      if (data.user) {
        // Create user profile in database
        const { error: dbError } = await db.createUser({
          id: data.user.id,
          email: data.user.email,
          name: sanitizedName,
          grade: userData.grade,
          board: userData.board,
          subjects: userData.subjects || [],
          language_preference: userData.languagePreference || 'english',
          exam_date: userData.examDate,
          weekly_available_hours: userData.weeklyAvailableHours || 10,
        });

        if (dbError) {
          console.error('Error creating user profile:', dbError);
          return { error: dbError };
        }

        // Create default free subscription
        await db.createSubscription({
          user_id: data.user.id,
          plan_type: 'free',
          status: 'active',
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Validate inputs
      if (!security.validateEmail(email)) {
        return { error: { message: 'Please enter a valid email address' } };
      }

      if (!password) {
        return { error: { message: 'Password is required' } };
      }

      const sanitizedEmail = security.sanitizeInput(email.toLowerCase());
      const { error } = await auth.signIn(sanitizedEmail, password);
      
      if (error) {
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          return { error: { message: 'Invalid email or password. Please check your credentials and try again.' } };
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: { message: 'Please verify your email address before signing in.' } };
        }
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Signin error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await auth.signOut();
      if (!error) {
        setUser(null);
        setSession(null);
        setUserProfile(null);
        setEmailVerified(false);
      }
      return { error };
    } catch (error) {
      console.error('Signout error:', error);
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!security.validateEmail(email)) {
        return { error: { message: 'Please enter a valid email address' } };
      }

      const sanitizedEmail = security.sanitizeInput(email.toLowerCase());
      const { error } = await auth.resetPassword(sanitizedEmail);
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const passwordValidation = security.validatePassword(password);
      if (!passwordValidation.isValid) {
        return { error: { message: passwordValidation.errors[0] } };
      }

      const { error } = await auth.updatePassword(password);
      return { error };
    } catch (error) {
      console.error('Update password error:', error);
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    try {
      // Sanitize string inputs
      const sanitizedUpdates = {
        ...updates,
        name: updates.name ? security.sanitizeInput(updates.name) : undefined,
      };

      const { data, error } = await db.updateUser(user.id, {
        name: sanitizedUpdates.name,
        grade: sanitizedUpdates.grade,
        board: sanitizedUpdates.board,
        subjects: sanitizedUpdates.subjects,
        language_preference: sanitizedUpdates.languagePreference,
        exam_date: sanitizedUpdates.examDate,
        weekly_available_hours: sanitizedUpdates.weeklyAvailableHours,
      });

      if (error) {
        return { error };
      }

      if (data) {
        setUserProfile(prev => prev ? { ...prev, ...sanitizedUpdates } : null);
      }

      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
      } else if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
    } catch (error) {
      console.error('Refresh session error:', error);
    }
  };

  const resendVerification = async () => {
    try {
      if (!user?.email) {
        return { error: { message: 'No email address found' } };
      }

      const { error } = await auth.resetPassword(user.email);
      return { error };
    } catch (error) {
      console.error('Resend verification error:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userProfile,
        loading,
        emailVerified,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        refreshSession,
        resendVerification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};