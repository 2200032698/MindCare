import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  age: number | null
  role: 'user' | 'therapist' | 'admin'
  created_at: string
  updated_at: string
}

export interface BehavioralData {
  id: string
  user_id: string
  data_type: 'sleep' | 'activity' | 'stress' | 'heart_rate' | 'mood'
  value: number
  unit: string | null
  recorded_at: string
  source: 'wearable' | 'manual' | 'survey'
}

export interface MentalHealthAssessment {
  id: string
  user_id: string
  assessment_type: 'phq9' | 'gad7' | 'stress_scale' | 'wellness_check'
  score: number
  responses: Record<string, any>
  risk_level: 'low' | 'moderate' | 'high'
  created_at: string
}

export interface Recommendation {
  id: string
  user_id: string
  type: 'therapy' | 'mindfulness' | 'activity' | 'community' | 'lifestyle'
  title: string
  description: string
  priority: number
  completed: boolean
  created_at: string
}

export interface CommunityPost {
  id: string
  user_id: string
  title: string
  content: string
  category: 'general' | 'anxiety' | 'depression' | 'stress' | 'success' | 'resources'
  anonymous: boolean
  created_at: string
  profiles?: { username: string | null; full_name: string | null }
}

export interface CommunityComment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  profiles?: { username: string | null; full_name: string | null }
}