import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, Recommendation } from '../lib/supabase'
import { Lightbulb, Brain, Heart, Activity, Users, Target, CheckCircle, X } from 'lucide-react'

const Recommendations: React.FC = () => {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchRecommendations()
    }
  }, [user])

  const fetchRecommendations = async () => {
    if (!user) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false)
        .order('priority', { ascending: true })

      if (error) throw error
      setRecommendations(data || [])
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recommendations')
        .update({ completed: true })
        .eq('id', id)

      if (error) throw error
      await fetchRecommendations()
    } catch (error) {
      console.error('Error updating recommendation:', error)
    }
  }

  const handleDismiss = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recommendations')
        .delete()
        .eq('id', id)

      if (error) throw error
      await fetchRecommendations()
    } catch (error) {
      console.error('Error dismissing recommendation:', error)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'therapy': return Brain
      case 'mindfulness': return Heart
      case 'activity': return Activity
      case 'lifestyle': return Target
      case 'community': return Users
      default: return Lightbulb
    }
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'therapy': return 'bg-purple-100 text-purple-800'
      case 'mindfulness': return 'bg-green-100 text-green-800'
      case 'activity': return 'bg-blue-100 text-blue-800'
      case 'lifestyle': return 'bg-orange-100 text-orange-800'
      case 'community': return 'bg-teal-100 text-teal-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const staticRecommendations = [
    {
      id: 1,
      type: 'therapy',
      title: 'Consider Professional Therapy',
      description: 'Based on your recent assessments, speaking with a licensed therapist could provide valuable support and coping strategies.',
      priority: 1,
      icon: Brain,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 2,
      type: 'mindfulness',
      title: 'Daily Meditation Practice',
      description: 'Your stress levels indicate you might benefit from a 10-minute daily mindfulness meditation routine.',
      priority: 1,
      icon: Heart,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 3,
      type: 'activity',
      title: 'Increase Physical Activity',
      description: 'Regular exercise can significantly improve mood and reduce anxiety. Try 30 minutes of moderate activity daily.',
      priority: 2,
      icon: Activity,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 4,
      type: 'lifestyle',
      title: 'Improve Sleep Schedule',
      description: 'Your sleep data shows irregular patterns. Establishing a consistent bedtime routine could help.',
      priority: 2,
      icon: Target,
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 5,
      type: 'community',
      title: 'Join Support Groups',
      description: 'Connecting with others who share similar experiences can provide valuable peer support.',
      priority: 3,
      icon: Users,
      color: 'bg-orange-100 text-orange-800'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const displayRecommendations = recommendations.length > 0 ? recommendations : staticRecommendations as any

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Personalized Recommendations</h1>
          <p className="text-gray-600 mt-1">AI-powered suggestions based on your data and progress</p>
        </div>
        
        <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          <span className="text-sm text-blue-700 font-medium">
            {displayRecommendations.filter((r: any) => r.priority === 1).length} High Priority
          </span>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {displayRecommendations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">You've completed all current recommendations. Keep up the great work!</p>
          </div>
        ) : (
          displayRecommendations.map((rec: any) => {
            const Icon = getIcon(rec.type)
            const color = getColor(rec.type)
          
            return (
              <div key={rec.id} className="bg-white rounded-lg shadow border-l-4 border-blue-500 p-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${color.replace('text-', 'bg-').replace('-800', '-100')}`}>
                    <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-').replace('-100', '-600')}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${color}`}>
                          {rec.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          rec.priority === 1 ? 'bg-red-100 text-red-800' :
                          rec.priority === 2 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          Priority {rec.priority}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{rec.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleComplete(rec.id)}
                          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Complete
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                          Learn More
                        </button>
                      </div>

                      <button
                        onClick={() => handleDismiss(rec.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Recommendation Sources */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How We Generate Recommendations</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4">
            <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Behavioral Analysis</h4>
            <p className="text-sm text-gray-600">Your sleep, mood, and activity patterns</p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Assessment Results</h4>
            <p className="text-sm text-gray-600">PHQ-9, GAD-7, and other screening scores</p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
              <Lightbulb className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Evidence-Based</h4>
            <p className="text-sm text-gray-600">Research-backed interventions and strategies</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Recommendations