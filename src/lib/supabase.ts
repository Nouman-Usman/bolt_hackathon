import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
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

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Users
  getUser: async (id: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id);
    
    if (error) {
      return { data: null, error };
    }
    
    // Return the first user if found, otherwise null
    return { data: data && data.length > 0 ? data[0] : null, error: null };
  },

  updateUser: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  createUser: async (userData: any) => {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    return { data, error };
  },

  // Subscriptions
  getUserSubscription: async (userId: string) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    return { data, error };
  },

  createSubscription: async (subscriptionData: any) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single();
    return { data, error };
  },

  updateSubscription: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Study Plans
  getUserStudyPlans: async (userId: string) => {
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('active', true)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createStudyPlan: async (planData: any) => {
    const { data, error } = await supabase
      .from('study_plans')
      .insert(planData)
      .select()
      .single();
    return { data, error };
  },

  // Study Sessions
  getUserStudySessions: async (userId: string, startDate?: string, endDate?: string) => {
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
  },

  createStudySession: async (sessionData: any) => {
    const { data, error } = await supabase
      .from('study_sessions')
      .insert(sessionData)
      .select()
      .single();
    return { data, error };
  },

  updateStudySession: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('study_sessions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Quizzes
  getUserQuizzes: async (userId: string) => {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createQuiz: async (quizData: any) => {
    const { data, error } = await supabase
      .from('quizzes')
      .insert(quizData)
      .select()
      .single();
    return { data, error };
  },

  updateQuiz: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('quizzes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Flashcards
  getUserFlashcards: async (userId: string, subject?: string) => {
    let query = supabase
      .from('flashcards')
      .select('*')
      .eq('user_id', userId);

    if (subject) {
      query = query.eq('subject', subject);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  },

  createFlashcard: async (flashcardData: any) => {
    const { data, error } = await supabase
      .from('flashcards')
      .insert(flashcardData)
      .select()
      .single();
    return { data, error };
  },

  updateFlashcard: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('flashcards')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // Chat Conversations
  getUserConversations: async (userId: string) => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    return { data, error };
  },

  createConversation: async (conversationData: any) => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert(conversationData)
      .select()
      .single();
    return { data, error };
  },

  updateConversation: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('chat_conversations')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  // User Progress
  getUserProgress: async (userId: string, subject?: string) => {
    let query = supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId);

    if (subject) {
      query = query.eq('subject', subject);
    }

    const { data, error } = await query.order('last_studied', { ascending: false });
    return { data, error };
  },

  updateProgress: async (userId: string, subject: string, topic: string, updates: any) => {
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
  },

  // Campaigns
  getActiveCampaigns: async () => {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('active', true)
      .lte('valid_from', new Date().toISOString())
      .gte('valid_to', new Date().toISOString())
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Add-on Purchases
  getUserAddOns: async (userId: string) => {
    const { data, error } = await supabase
      .from('add_on_purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createAddOnPurchase: async (purchaseData: any) => {
    const { data, error } = await supabase
      .from('add_on_purchases')
      .insert(purchaseData)
      .select()
      .single();
    return { data, error };
  }
};