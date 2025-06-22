import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Auth helpers with strong security
export const auth = {
  signUp: async (email: string, password: string, userData: any) => {
    // Validate password strength
    if (password.length < 8) {
      return { data: null, error: { message: 'Password must be at least 8 characters long' } };
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { data: null, error: { message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' } };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: userData
      }
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    return { data, error };
  },

  updatePassword: async (password: string) => {
    // Validate password strength
    if (password.length < 8) {
      return { data: null, error: { message: 'Password must be at least 8 characters long' } };
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return { data: null, error: { message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' } };
    }

    const { data, error } = await supabase.auth.updateUser({
      password
    });
    return { data, error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  getCurrentSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  refreshSession: async () => {
    const { data, error } = await supabase.auth.refreshSession();
    return { data, error };
  }
};

// Database helpers with proper error handling
export const db = {
  // Users
  getUser: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      return { data, error };
    } catch (error) {
      console.error('Database error in getUser:', error);
      return { data: null, error };
    }
  },

  createUser: async (userData: any) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          ...userData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        })
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Database error in createUser:', error);
      return { data: null, error };
    }
  },

  updateUser: async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString(),
          last_active: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Database error in updateUser:', error);
      return { data: null, error };
    }
  },

  // Subscriptions
  getUserSubscription: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();
      return { data, error };
    } catch (error) {
      console.error('Database error in getUserSubscription:', error);
      return { data: null, error };
    }
  },

  createSubscription: async (subscriptionData: any) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          ...subscriptionData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Database error in createSubscription:', error);
      return { data: null, error };
    }
  },

  updateSubscription: async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Database error in updateSubscription:', error);
      return { data: null, error };
    }
  },

  // Study Plans
  getUserStudyPlans: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', userId)
        .eq('active', true)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      console.error('Database error in getUserStudyPlans:', error);
      return { data: null, error };
    }
  },

  createStudyPlan: async (planData: any) => {
    try {
      const { data, error } = await supabase
        .from('study_plans')
        .insert({
          ...planData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Database error in createStudyPlan:', error);
      return { data: null, error };
    }
  },

  // Study Sessions
  getUserStudySessions: async (userId: string, startDate?: string, endDate?: string) => {
    try {
      let query = supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId);

      if (startDate) {
        query = query.gte('scheduled_for', startDate);
      }
      if (endDate) {
        query = query.lte('scheduled_for', endDate);
      }

      const { data, error } = await query.order('scheduled_for', { ascending: true });
      return { data, error };
    } catch (error) {
      console.error('Database error in getUserStudySessions:', error);
      return { data: null, error };
    }
  },

  createStudySession: async (sessionData: any) => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          ...sessionData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Database error in createStudySession:', error);
      return { data: null, error };
    }
  },

  updateStudySession: async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Database error in updateStudySession:', error);
      return { data: null, error };
    }
  },

  // Quizzes
  getUserQuizzes: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      console.error('Database error in getUserQuizzes:', error);
      return { data: null, error };
    }
  },

  createQuiz: async (quizData: any) => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          ...quizData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Database error in createQuiz:', error);
      return { data: null, error };
    }
  },

  updateQuiz: async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Database error in updateQuiz:', error);
      return { data: null, error };
    }
  },

  // Flashcards
  getUserFlashcards: async (userId: string, subject?: string) => {
    try {
      let query = supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId);

      if (subject) {
        query = query.eq('subject', subject);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      console.error('Database error in getUserFlashcards:', error);
      return { data: null, error };
    }
  },

  createFlashcard: async (flashcardData: any) => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .insert({
          ...flashcardData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Database error in createFlashcard:', error);
      return { data: null, error };
    }
  },

  updateFlashcard: async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('flashcards')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Database error in updateFlashcard:', error);
      return { data: null, error };
    }
  },

  // Chat Conversations
  getUserConversations: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      return { data, error };
    } catch (error) {
      console.error('Database error in getUserConversations:', error);
      return { data: null, error };
    }
  },

  createConversation: async (conversationData: any) => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          ...conversationData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Database error in createConversation:', error);
      return { data: null, error };
    }
  },

  updateConversation: async (id: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .update({ 
          ...updates, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Database error in updateConversation:', error);
      return { data: null, error };
    }
  },

  // User Progress
  getUserProgress: async (userId: string, subject?: string) => {
    try {
      let query = supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (subject) {
        query = query.eq('subject', subject);
      }

      const { data, error } = await query.order('last_studied', { ascending: false });
      return { data, error };
    } catch (error) {
      console.error('Database error in getUserProgress:', error);
      return { data: null, error };
    }
  },

  updateProgress: async (userId: string, subject: string, topic: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          subject,
          topic,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Database error in updateProgress:', error);
      return { data: null, error };
    }
  },

  // Campaigns
  getActiveCampaigns: async () => {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('active', true)
        .lte('valid_from', new Date().toISOString())
        .gte('valid_to', new Date().toISOString())
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      console.error('Database error in getActiveCampaigns:', error);
      return { data: null, error };
    }
  },

  // Add-on Purchases
  getUserAddOns: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('add_on_purchases')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      return { data, error };
    } catch (error) {
      console.error('Database error in getUserAddOns:', error);
      return { data: null, error };
    }
  },

  createAddOnPurchase: async (purchaseData: any) => {
    try {
      const { data, error } = await supabase
        .from('add_on_purchases')
        .insert({
          ...purchaseData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      return { data, error };
    } catch (error) {
      console.error('Database error in createAddOnPurchase:', error);
      return { data: null, error };
    }
  }
};

// Security utilities
export const security = {
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      errors.push('Password should contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  sanitizeInput: (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  }
};