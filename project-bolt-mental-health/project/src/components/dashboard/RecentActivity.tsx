import React from 'react'
import { BehavioralData, MentalHealthAssessment } from '../../lib/supabase'
import { Activity, Brain, Clock } from 'lucide-react'
import { format } from 'date-fns'

interface RecentActivityProps {
  behavioralData: BehavioralData[]
  assessments: MentalHealthAssessment[]
}

const RecentActivity: React.FC<RecentActivityProps> = ({ behavioralData, assessments }) => {
  // Combine and sort recent activities
  const activities = [
    ...behavioralData.slice(0, 10).map(d => ({
      type: 'data',
      title: `${d.data_type.charAt(0).toUpperCase() + d.data_type.slice(1)} Recorded`,
      description: `${d.value} ${d.unit || ''}`,
      timestamp: d.recorded_at,
      icon: Activity
    })),
    ...assessments.slice(0, 3).map(a => ({
      type: 'assessment',
      title: `${a.assessment_type.toUpperCase()} Assessment`,
      description: `Score: ${a.score} (${a.risk_level} risk)`,
      timestamp: a.created_at,
      icon: Brain
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <p>No recent activity. Start tracking your mental health data!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`flex-shrink-0 p-2 rounded-lg ${
              activity.type === 'assessment' ? 'bg-purple-100' : 'bg-blue-100'
            }`}>
              <activity.icon className={`h-4 w-4 ${
                activity.type === 'assessment' ? 'text-purple-600' : 'text-blue-600'
              }`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {format(new Date(activity.timestamp), 'MMM dd, yyyy hh:mm a')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentActivity