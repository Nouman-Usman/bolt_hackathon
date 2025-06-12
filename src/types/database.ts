export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          grade: string | null
          board: string | null
          subjects: string[] | null
          language_preference: string | null
          exam_date: string | null
          weekly_available_hours: number | null
          institution_id: string | null
          role: string | null
          created_at: string
          updated_at: string
          last_active: string | null
        }
        Insert: {
          id: string
          email: string
          name: string
          grade?: string | null
          board?: string | null
          subjects?: string[] | null
          language_preference?: string | null
          exam_date?: string | null
          weekly_available_hours?: number | null
          institution_id?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
          last_active?: string | null
        }
        Update: {
          id?: string
          email?: string
          name?: string
          grade?: string | null
          board?: string | null
          subjects?: string[] | null
          language_preference?: string | null
          exam_date?: string | null
          weekly_available_hours?: number | null
          institution_id?: string | null
          role?: string | null
          created_at?: string
          updated_at?: string
          last_active?: string | null
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string | null
          plan_type: string
          status: string
          start_date: string | null
          end_date: string | null
          auto_renew: boolean | null
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          plan_type?: string
          status?: string
          start_date?: string | null
          end_date?: string | null
          auto_renew?: boolean | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          plan_type?: string
          status?: string
          start_date?: string | null
          end_date?: string | null
          auto_renew?: boolean | null
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      institutions: {
        Row: {
          id: string
          name: string
          type: string
          student_count: number | null
          contact_person: Json | null
          address: Json | null
          subscription_plan: string | null
          features: string[] | null
          admin_users: string[] | null
          teacher_users: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: string
          student_count?: number | null
          contact_person?: Json | null
          address?: Json | null
          subscription_plan?: string | null
          features?: string[] | null
          admin_users?: string[] | null
          teacher_users?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: string
          student_count?: number | null
          contact_person?: Json | null
          address?: Json | null
          subscription_plan?: string | null
          features?: string[] | null
          admin_users?: string[] | null
          teacher_users?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      study_plans: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string | null
          start_date: string
          end_date: string
          weekly_hours: number | null
          subjects: string[] | null
          active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description?: string | null
          start_date: string
          end_date: string
          weekly_hours?: number | null
          subjects?: string[] | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          weekly_hours?: number | null
          subjects?: string[] | null
          active?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string | null
          study_plan_id: string | null
          subject: string
          topics: string[] | null
          planned_duration_minutes: number
          actual_duration_minutes: number | null
          completed: boolean | null
          scheduled_for: string
          completed_at: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          study_plan_id?: string | null
          subject: string
          topics?: string[] | null
          planned_duration_minutes: number
          actual_duration_minutes?: number | null
          completed?: boolean | null
          scheduled_for: string
          completed_at?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          study_plan_id?: string | null
          subject?: string
          topics?: string[] | null
          planned_duration_minutes?: number
          actual_duration_minutes?: number | null
          completed?: boolean | null
          scheduled_for?: string
          completed_at?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      quizzes: {
        Row: {
          id: string
          user_id: string | null
          title: string
          subject: string
          question_count: number
          duration_minutes: number | null
          type: string
          difficulty: string
          questions: Json | null
          completed: boolean | null
          score: number | null
          total_marks: number | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          subject: string
          question_count: number
          duration_minutes?: number | null
          type?: string
          difficulty?: string
          questions?: Json | null
          completed?: boolean | null
          score?: number | null
          total_marks?: number | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          subject?: string
          question_count?: number
          duration_minutes?: number | null
          type?: string
          difficulty?: string
          questions?: Json | null
          completed?: boolean | null
          score?: number | null
          total_marks?: number | null
          completed_at?: string | null
          created_at?: string
        }
      }
      flashcards: {
        Row: {
          id: string
          user_id: string | null
          subject: string
          chapter: string
          front_text: string
          front_text_urdu: string | null
          back_text: string
          back_text_urdu: string | null
          difficulty: string | null
          mastery_level: number | null
          last_reviewed: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          subject: string
          chapter: string
          front_text: string
          front_text_urdu?: string | null
          back_text: string
          back_text_urdu?: string | null
          difficulty?: string | null
          mastery_level?: number | null
          last_reviewed?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          subject?: string
          chapter?: string
          front_text?: string
          front_text_urdu?: string | null
          back_text?: string
          back_text_urdu?: string | null
          difficulty?: string | null
          mastery_level?: number | null
          last_reviewed?: string | null
          created_at?: string
        }
      }
      chat_conversations: {
        Row: {
          id: string
          user_id: string | null
          title: string
          subject: string | null
          messages: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          subject?: string | null
          messages?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          subject?: string | null
          messages?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string | null
          subject: string
          topic: string
          progress_percentage: number | null
          mastery_level: number | null
          time_spent_minutes: number | null
          last_studied: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          subject: string
          topic: string
          progress_percentage?: number | null
          mastery_level?: number | null
          time_spent_minutes?: number | null
          last_studied?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          subject?: string
          topic?: string
          progress_percentage?: number | null
          mastery_level?: number | null
          time_spent_minutes?: number | null
          last_studied?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          name: string
          name_urdu: string
          type: string
          discount_percentage: number
          valid_from: string
          valid_to: string
          applicable_plans: string[] | null
          active: boolean | null
          description: string | null
          description_urdu: string | null
          sponsor_name: string | null
          target_audience: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_urdu: string
          type: string
          discount_percentage: number
          valid_from: string
          valid_to: string
          applicable_plans?: string[] | null
          active?: boolean | null
          description?: string | null
          description_urdu?: string | null
          sponsor_name?: string | null
          target_audience?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_urdu?: string
          type?: string
          discount_percentage?: number
          valid_from?: string
          valid_to?: string
          applicable_plans?: string[] | null
          active?: boolean | null
          description?: string | null
          description_urdu?: string | null
          sponsor_name?: string | null
          target_audience?: string | null
          created_at?: string
        }
      }
      add_on_purchases: {
        Row: {
          id: string
          user_id: string | null
          add_on_id: string
          add_on_type: string
          price: number
          currency: string | null
          status: string | null
          expires_at: string | null
          stripe_payment_intent_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          add_on_id: string
          add_on_type: string
          price: number
          currency?: string | null
          status?: string | null
          expires_at?: string | null
          stripe_payment_intent_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          add_on_id?: string
          add_on_type?: string
          price?: number
          currency?: string | null
          status?: string | null
          expires_at?: string | null
          stripe_payment_intent_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}