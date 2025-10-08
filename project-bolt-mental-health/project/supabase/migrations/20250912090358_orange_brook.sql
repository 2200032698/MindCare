/*
  # Mental Health Platform Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, references auth.users)
      - `username` (text)
      - `full_name` (text)
      - `age` (integer)
      - `role` (text) - user, therapist, admin
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `behavioral_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `data_type` (text) - sleep, activity, stress, heart_rate
      - `value` (numeric)
      - `unit` (text)
      - `recorded_at` (timestamp)
      - `source` (text) - wearable, manual, survey
    
    - `mental_health_assessments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `assessment_type` (text) - phq9, gad7, stress_scale
      - `score` (integer)
      - `responses` (jsonb)
      - `risk_level` (text) - low, moderate, high
      - `created_at` (timestamp)
    
    - `recommendations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text) - therapy, mindfulness, activity, community
      - `title` (text)
      - `description` (text)
      - `priority` (integer)
      - `completed` (boolean)
      - `created_at` (timestamp)
    
    - `community_posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `content` (text)
      - `category` (text)
      - `anonymous` (boolean)
      - `created_at` (timestamp)
    
    - `community_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references community_posts)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to access their own data
    - Add policies for therapists to access assigned clients
    - Add policies for community features
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  age integer,
  role text DEFAULT 'user' CHECK (role IN ('user', 'therapist', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create behavioral_data table
CREATE TABLE IF NOT EXISTS behavioral_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  data_type text NOT NULL CHECK (data_type IN ('sleep', 'activity', 'stress', 'heart_rate', 'mood')),
  value numeric NOT NULL,
  unit text,
  recorded_at timestamptz DEFAULT now(),
  source text DEFAULT 'manual' CHECK (source IN ('wearable', 'manual', 'survey'))
);

-- Create mental_health_assessments table
CREATE TABLE IF NOT EXISTS mental_health_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  assessment_type text NOT NULL CHECK (assessment_type IN ('phq9', 'gad7', 'stress_scale', 'wellness_check')),
  score integer NOT NULL,
  responses jsonb,
  risk_level text DEFAULT 'low' CHECK (risk_level IN ('low', 'moderate', 'high')),
  created_at timestamptz DEFAULT now()
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('therapy', 'mindfulness', 'activity', 'community', 'lifestyle')),
  title text NOT NULL,
  description text NOT NULL,
  priority integer DEFAULT 1,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create community_posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'general' CHECK (category IN ('general', 'anxiety', 'depression', 'stress', 'success', 'resources')),
  anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create community_comments table
CREATE TABLE IF NOT EXISTS community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavioral_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE mental_health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Behavioral data policies
CREATE POLICY "Users can manage own behavioral data"
  ON behavioral_data FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Mental health assessments policies
CREATE POLICY "Users can manage own assessments"
  ON mental_health_assessments FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Recommendations policies
CREATE POLICY "Users can view own recommendations"
  ON recommendations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own recommendations"
  ON recommendations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Community posts policies
CREATE POLICY "Anyone can view community posts"
  ON community_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create community posts"
  ON community_posts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own community posts"
  ON community_posts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Community comments policies
CREATE POLICY "Anyone can view community comments"
  ON community_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create community comments"
  ON community_comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own community comments"
  ON community_comments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());