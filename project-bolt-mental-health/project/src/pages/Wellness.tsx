import React from 'react'
import { Heart, Zap, Moon, Sunrise, Music, Book } from 'lucide-react'

const Wellness: React.FC = () => {
  const activities = [
    {
      id: 1,
      title: 'Guided Meditation',
      description: '10-minute mindfulness session',
      duration: '10 min',
      category: 'mindfulness',
      icon: Heart,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 2,
      title: 'Breathing Exercise',
      description: '4-7-8 breathing technique',
      duration: '5 min',
      category: 'breathing',
      icon: Zap,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 3,
      title: 'Sleep Stories',
      description: 'Calming bedtime stories',
      duration: '15 min',
      category: 'sleep',
      icon: Moon,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 4,
      title: 'Morning Affirmations',
      description: 'Positive self-talk practice',
      duration: '3 min',
      category: 'affirmations',
      icon: Sunrise,
      color: 'bg-yellow-100 text-yellow-800'
    },
    {
      id: 5,
      title: 'Nature Sounds',
      description: 'Relaxing ambient sounds',
      duration: '30 min',
      category: 'audio',
      icon: Music,
      color: 'bg-indigo-100 text-indigo-800'
    },
    {
      id: 6,
      title: 'Journaling Prompts',
      description: 'Reflective writing exercises',
      duration: '15 min',
      category: 'journaling',
      icon: Book,
      color: 'bg-orange-100 text-orange-800'
    }
  ]

  const categories = [
    { id: 'all', name: 'All', count: activities.length },
    { id: 'mindfulness', name: 'Mindfulness', count: 1 },
    { id: 'breathing', name: 'Breathing', count: 1 },
    { id: 'sleep', name: 'Sleep', count: 1 },
    { id: 'affirmations', name: 'Affirmations', count: 1 },
    { id: 'audio', name: 'Audio', count: 1 },
    { id: 'journaling', name: 'Journaling', count: 1 }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wellness Tools</h1>
          <p className="text-gray-600 mt-1">Interactive exercises and activities for mental well-being</p>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => {
          const Icon = activity.icon
          
          return (
            <div key={activity.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${activity.color.replace('text-', 'bg-').replace('-800', '-100')}`}>
                    <Icon className={`h-6 w-6 ${activity.color.replace('bg-', 'text-').replace('-100', '-600')}`} />
                  </div>
                  <span className="text-sm text-gray-500">{activity.duration}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{activity.title}</h3>
                <p className="text-gray-600 mb-4">{activity.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${activity.color}`}>
                    {activity.category}
                  </span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    Start
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Wellness Activity</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
              <Heart className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">45</p>
            <p className="text-sm text-gray-600">Minutes this week</p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">12</p>
            <p className="text-sm text-gray-600">Sessions completed</p>
          </div>
          
          <div className="text-center p-4">
            <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
              <Moon className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-900">7</p>
            <p className="text-sm text-gray-600">Day streak</p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Recommendations</h3>
        <p className="text-gray-700 mb-4">
          Based on your recent stress levels, we recommend trying breathing exercises and meditation today.
        </p>
        
        <div className="flex space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
            Try Breathing Exercise
          </button>
          <button className="border border-blue-300 text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
            View All Recommendations
          </button>
        </div>
      </div>
    </div>
  )
}

export default Wellness