import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { auth, db } from '../lib/supabase';
import { UserProfile } from '../types/user';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
  updateProfile: async () => ({ error: null }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { user: currentUser } = await auth.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        await loadUserProfile(currentUser.id);
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await loadUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await db.getUser(userId);
      if (error) {
        console.error('Error loading user profile:', error);
        setUserProfile(null);
        return;
      }
      
      if (data) {
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
        // No user profile found yet (e.g., during signup race condition)
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      const { data, error } = await auth.signUp(email, password, {
        name: userData.name,
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

      if (data.user) {
        // Create user profile in database
        const { error: dbError } = await db.createUser({
          id: data.user.id,
          email: data.user.email,
          name: userData.name,
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
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await auth.signIn(email, password);
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    try {
      const { data, error } = await db.updateUser(user.id, {
        name: updates.name,
        grade: updates.grade,
        board: updates.board,
        subjects: updates.subjects,
        language_preference: updates.languagePreference,
        exam_date: updates.examDate,
        weekly_available_hours: updates.weeklyAvailableHours,
        last_active: new Date().toISOString(),
      });

      if (error) {
        return { error };
      }

      if (data) {
        setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};