/*
  # Initial Schema for StudyGenius

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `grade` (text)
      - `board` (text)
      - `subjects` (text array)
      - `language_preference` (text)
      - `exam_date` (date)
      - `weekly_available_hours` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `last_active` (timestamp)

    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `plan_type` (text)
      - `status` (text)
      - `start_date` (timestamp)
      - `end_date` (timestamp)
      - `auto_renew` (boolean)
      - `stripe_subscription_id` (text)
      - `stripe_customer_id` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `institutions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `type` (text)
      - `student_count` (integer)
      - `contact_person` (jsonb)
      - `address` (jsonb)
      - `subscription_plan` (text)
      - `features` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `study_plans`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `description` (text)
      - `start_date` (date)
      - `end_date` (date)
      - `weekly_hours` (integer)
      - `subjects` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `study_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `study_plan_id` (uuid, foreign key)
      - `subject` (text)
      - `topics` (text array)
      - `planned_duration_minutes` (integer)
      - `actual_duration_minutes` (integer)
      - `completed` (boolean)
      - `scheduled_for` (timestamp)
      - `completed_at` (timestamp)
      - `notes` (text)
      - `created_at` (timestamp)

    - `quizzes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `subject` (text)
      - `question_count` (integer)
      - `duration_minutes` (integer)
      - `type` (text)
      - `difficulty` (text)
      - `questions` (jsonb)
      - `completed` (boolean)
      - `score` (integer)
      - `total_marks` (integer)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)

    - `flashcards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `subject` (text)
      - `chapter` (text)
      - `front_text` (text)
      - `front_text_urdu` (text)
      - `back_text` (text)
      - `back_text_urdu` (text)
      - `difficulty` (text)
      - `mastery_level` (integer)
      - `last_reviewed` (timestamp)
      - `created_at` (timestamp)

    - `chat_conversations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `title` (text)
      - `subject` (text)
      - `messages` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `subject` (text)
      - `topic` (text)
      - `progress_percentage` (integer)
      - `mastery_level` (integer)
      - `time_spent_minutes` (integer)
      - `last_studied` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `campaigns`
      - `id` (uuid, primary key)
      - `name` (text)
      - `name_urdu` (text)
      - `type` (text)
      - `discount_percentage` (integer)
      - `valid_from` (timestamp)
      - `valid_to` (timestamp)
      - `applicable_plans` (text array)
      - `active` (boolean)
      - `description` (text)
      - `description_urdu` (text)
      - `sponsor_name` (text)
      - `target_audience` (text)
      - `created_at` (timestamp)

    - `add_on_purchases`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `add_on_id` (text)
      - `add_on_type` (text)
      - `price` (integer)
      - `currency` (text)
      - `status` (text)
      - `expires_at` (timestamp)
      - `stripe_payment_intent_id` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
    - Add policies for institutional users to access their institution's data
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  grade text,
  board text,
  subjects text[] DEFAULT '{}',
  language_preference text DEFAULT 'english',
  exam_date date,
  weekly_available_hours integer DEFAULT 10,
  institution_id uuid,
  role text DEFAULT 'student',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_active timestamptz DEFAULT now()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  plan_type text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'active',
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  auto_renew boolean DEFAULT true,
  stripe_subscription_id text,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Institutions table
CREATE TABLE IF NOT EXISTS institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  student_count integer DEFAULT 0,
  contact_person jsonb,
  address jsonb,
  subscription_plan text DEFAULT 'institutional_basic',
  features text[] DEFAULT '{}',
  admin_users uuid[] DEFAULT '{}',
  teacher_users uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Study plans table
CREATE TABLE IF NOT EXISTS study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date NOT NULL,
  weekly_hours integer DEFAULT 10,
  subjects text[] DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Study sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  study_plan_id uuid REFERENCES study_plans(id) ON DELETE SET NULL,
  subject text NOT NULL,
  topics text[] DEFAULT '{}',
  planned_duration_minutes integer NOT NULL,
  actual_duration_minutes integer,
  completed boolean DEFAULT false,
  scheduled_for timestamptz NOT NULL,
  completed_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  subject text NOT NULL,
  question_count integer NOT NULL,
  duration_minutes integer,
  type text NOT NULL DEFAULT 'mcq',
  difficulty text NOT NULL DEFAULT 'medium',
  questions jsonb DEFAULT '[]',
  completed boolean DEFAULT false,
  score integer,
  total_marks integer,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Flashcards table
CREATE TABLE IF NOT EXISTS flashcards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  chapter text NOT NULL,
  front_text text NOT NULL,
  front_text_urdu text,
  back_text text NOT NULL,
  back_text_urdu text,
  difficulty text DEFAULT 'medium',
  mastery_level integer DEFAULT 0,
  last_reviewed timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Chat conversations table
CREATE TABLE IF NOT EXISTS chat_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  subject text,
  messages jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  topic text NOT NULL,
  progress_percentage integer DEFAULT 0,
  mastery_level integer DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  last_studied timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, subject, topic)
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_urdu text NOT NULL,
  type text NOT NULL,
  discount_percentage integer NOT NULL,
  valid_from timestamptz NOT NULL,
  valid_to timestamptz NOT NULL,
  applicable_plans text[] DEFAULT '{}',
  active boolean DEFAULT true,
  description text,
  description_urdu text,
  sponsor_name text,
  target_audience text,
  created_at timestamptz DEFAULT now()
);

-- Add-on purchases table
CREATE TABLE IF NOT EXISTS add_on_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  add_on_id text NOT NULL,
  add_on_type text NOT NULL,
  price integer NOT NULL,
  currency text DEFAULT 'PKR',
  status text DEFAULT 'active',
  expires_at timestamptz,
  stripe_payment_intent_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE add_on_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for subscriptions table
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for study_plans table
CREATE POLICY "Users can manage own study plans"
  ON study_plans
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for study_sessions table
CREATE POLICY "Users can manage own study sessions"
  ON study_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for quizzes table
CREATE POLICY "Users can manage own quizzes"
  ON quizzes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for flashcards table
CREATE POLICY "Users can manage own flashcards"
  ON flashcards
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for chat_conversations table
CREATE POLICY "Users can manage own conversations"
  ON chat_conversations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_progress table
CREATE POLICY "Users can manage own progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for campaigns table (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read campaigns"
  ON campaigns
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for add_on_purchases table
CREATE POLICY "Users can manage own add-on purchases"
  ON add_on_purchases
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for institutions table
CREATE POLICY "Institution admins can read their institution"
  ON institutions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = ANY(admin_users));

CREATE POLICY "Institution admins can update their institution"
  ON institutions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = ANY(admin_users));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_scheduled ON study_sessions(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_quizzes_user_id ON quizzes(user_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_subject ON quizzes(subject);
CREATE INDEX IF NOT EXISTS idx_flashcards_user_id ON flashcards(user_id);
CREATE INDEX IF NOT EXISTS idx_flashcards_subject ON flashcards(subject);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON campaigns(active);
CREATE INDEX IF NOT EXISTS idx_campaigns_dates ON campaigns(valid_from, valid_to);

-- Insert sample campaigns
INSERT INTO campaigns (name, name_urdu, type, discount_percentage, valid_from, valid_to, applicable_plans, description, description_urdu, sponsor_name, target_audience) VALUES
('Ramadan Mubarak Special', 'رمضان مبارک اسپیشل', 'ramadan', 30, '2024-03-10', '2024-04-10', ARRAY['premium_monthly', 'premium_yearly'], 'Special discount for the holy month of Ramadan', 'رمضان کے مقدس مہینے کے لیے خصوصی رعایت', NULL, NULL),
('Board Exam Rush', 'بورڈ امتحان رش', 'exam_rush', 25, '2024-02-01', '2024-05-31', ARRAY['premium_monthly', 'premium_yearly'], 'Last-minute preparation discount for board exams', 'بورڈ امتحانات کی آخری وقت کی تیاری کے لیے رعایت', NULL, NULL),
('Rural Education Support', 'دیہی تعلیم کی سپورٹ', 'rural_support', 50, '2024-01-01', '2024-12-31', ARRAY['premium_monthly', 'premium_yearly'], 'Supporting education in rural areas of Pakistan', 'پاکستان کے دیہی علاقوں میں تعلیم کی حمایت', 'Education Foundation Pakistan', 'rural students');