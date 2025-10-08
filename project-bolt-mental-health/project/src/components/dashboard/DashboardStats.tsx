import React from 'react'
import { BehavioralData, MentalHealthAssessment } from '../../lib/supabase'
import { Activity, Brain, Beef as Sleep, Heart } from 'lucide-react'

interface DashboardStatsProps {
  behavioralData: BehavioralData[]
  assessments: MentalHealthAssessment[]
  riskLevel: 'low' | 'moderate' | 'high'
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  behavioralData,
  assessments,
  riskLevel
}) => {
  // Calculate stats
  const sleepData = behavioralData.filter(d => d.data_type === 'sleep')
  const avgSleep = sleepData.length > 0 
    ? sleepData.reduce((sum, d) => sum + d.value, 0) / sleepData.length
    : 0

  const moodData = behavioralData.filter(d => d.data_type === 'mood')
  const avgMood = moodData.length > 0
    ? moodData.reduce((sum, d) => sum + d.value, 0) / moodData.length
    : 0

  const stressData = behavioralData.filter(d => d.data_type === 'stress')
  const avgStress = stressData.length > 0
    ? stressData.reduce((sum, d) => sum + d.value, 0) / stressData.length
    : 0

  const recentAssessment = assessments.length > 0 ? assessments[0] : null

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-50'
      case 'moderate': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const stats = [
    {
      name: 'Average Sleep',
      value: `${avgSleep.toFixed(1)}h`,
      icon: Sleep,
      color: avgSleep >= 7 ? 'text-green-600' : avgSleep >= 6 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      name: 'Current Mood',
      value: `${avgMood.toFixed(1)}/10`,
      icon: Heart,
      color: avgMood >= 7 ? 'text-green-600' : avgMood >= 5 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      name: 'Stress Level',
      value: `${avgStress.toFixed(1)}/10`,
      icon: Activity,
      color: avgStress <= 3 ? 'text-green-600' : avgStress <= 6 ? 'text-yellow-600' : 'text-red-600'
    },
    {
      name: 'Risk Level',
      value: riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1),
      icon: Brain,
      color: getRiskColor(riskLevel)
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`${stat.color} p-2 rounded-lg`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
          
          {recentAssessment && stat.name === 'Risk Level' && (
            <div className="mt-4">
              <p className="text-xs text-gray-500">
                Last assessment: {new Date(recentAssessment.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default DashboardStats