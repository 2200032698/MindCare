import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, BehavioralData, MentalHealthAssessment, Recommendation } from '../lib/supabase'
import { MentalHealthMLModels } from '../lib/ml-models'
import DashboardStats from '../components/dashboard/DashboardStats'
import RecentActivity from '../components/dashboard/RecentActivity'
import MoodChart from '../components/dashboard/MoodChart'
import RecommendationsList from '../components/dashboard/RecommendationsList'
import RiskAlert from '../components/dashboard/RiskAlert'

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [behavioralData, setBehavioralData] = useState<BehavioralData[]>([])
  const [assessments, setAssessments] = useState<MentalHealthAssessment[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [riskLevel, setRiskLevel] = useState<'low' | 'moderate' | 'high'>('low')

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return

    try {
      setLoading(true)

      // Fetch behavioral data (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: behavioralData, error: behavioralError } = await supabase
        .from('behavioral_data')
        .select('*')
        .eq('user_id', user.id)
        .gte('recorded_at', thirtyDaysAgo.toISOString())
        .order('recorded_at', { ascending: false })

      if (behavioralError) throw behavioralError
      setBehavioralData(behavioralData || [])

      // Fetch assessments (last 3 months)
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

      const { data: assessments, error: assessmentsError } = await supabase
        .from('mental_health_assessments')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', threeMonthsAgo.toISOString())
        .order('created_at', { ascending: false })

      if (assessmentsError) throw assessmentsError
      setAssessments(assessments || [])

      // Calculate risk level
      const currentRisk = MentalHealthMLModels.assessRiskLevel(
        behavioralData || [],
        assessments || []
      )
      setRiskLevel(currentRisk)

      // Fetch existing recommendations
      const { data: recommendations, error: recommendationsError } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('priority', { ascending: true })

      if (recommendationsError) throw recommendationsError
      setRecommendations(recommendations || [])

      // Generate new recommendations if needed
      if ((recommendations || []).length < 3) {
        const newRecommendations = MentalHealthMLModels.generateRecommendations(
          currentRisk,
          behavioralData || []
        )

        // Insert new recommendations
        for (const rec of newRecommendations) {
          await supabase
            .from('recommendations')
            .insert([
              {
                user_id: user.id,
                ...rec
              }
            ])
        }

        // Refresh recommendations
        const { data: updatedRecs } = await supabase
          .from('recommendations')
          .select('*')
          .eq('user_id', user.id)
          .eq('completed', false)
          .order('priority', { ascending: true })

        setRecommendations(updatedRecs || [])
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {riskLevel !== 'low' && (
        <RiskAlert riskLevel={riskLevel} />
      )}

      <DashboardStats 
        behavioralData={behavioralData}
        assessments={assessments}
        riskLevel={riskLevel}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoodChart behavioralData={behavioralData} />
        <RecommendationsList recommendations={recommendations} />
      </div>

      <RecentActivity behavioralData={behavioralData} assessments={assessments} />
    </div>
  )
}

export default Dashboard