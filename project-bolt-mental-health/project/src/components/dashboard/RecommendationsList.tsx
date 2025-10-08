import React from 'react'
import { Recommendation } from '../../lib/supabase'
import { CheckCircle, Clock, Lightbulb, Activity, Users, Brain, Heart } from 'lucide-react'

interface RecommendationsListProps {
  recommendations: Recommendation[]
}

const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'therapy': return Brain
      case 'mindfulness': return Heart
      case 'activity': return Activity
      case 'community': return Users
      default: return Lightbulb
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'therapy': return 'bg-purple-100 text-purple-800'
      case 'mindfulness': return 'bg-green-100 text-green-800'
      case 'activity': return 'bg-blue-100 text-blue-800'
      case 'community': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <p>Loading personalized recommendations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personalized Recommendations</h3>
      
      <div className="space-y-4">
        {recommendations.slice(0, 5).map((rec) => {
          const Icon = getIcon(rec.type)
          
          return (
            <div key={rec.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                <Icon className="h-5 w-5 text-gray-600 mt-1" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">{rec.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(rec.type)}`}>
                    {rec.type}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600">{rec.description}</p>
                
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Priority: {rec.priority}
                  </span>
                  
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(rec.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <button className="flex-shrink-0 text-gray-400 hover:text-green-600">
                <CheckCircle className="h-5 w-5" />
              </button>
            </div>
          )
        })}
      </div>
      
      {recommendations.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all recommendations ({recommendations.length})
          </button>
        </div>
      )}
    </div>
  )
}

export default RecommendationsList