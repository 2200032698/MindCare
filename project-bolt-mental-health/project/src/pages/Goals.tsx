import React, { useState } from 'react'
import { Target, Plus, CheckCircle, Clock, TrendingUp } from 'lucide-react'

const Goals: React.FC = () => {
  const [showCreateGoal, setShowCreateGoal] = useState(false)

  const goals = [
    {
      id: 1,
      title: 'Maintain mood above 6/10',
      description: 'Track daily mood and keep it consistently above 6',
      category: 'mood',
      target: 80,
      current: 65,
      unit: '% of days',
      deadline: '2024-02-29',
      status: 'in-progress'
    },
    {
      id: 2,
      title: 'Get 7+ hours of sleep',
      description: 'Improve sleep quality and duration',
      category: 'sleep',
      target: 7,
      current: 6.2,
      unit: 'hours avg',
      deadline: '2024-02-15',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Complete daily meditation',
      description: '10 minutes of mindfulness practice each day',
      category: 'mindfulness',
      target: 30,
      current: 30,
      unit: 'days',
      deadline: '2024-01-31',
      status: 'completed'
    },
    {
      id: 4,
      title: 'Reduce stress levels',
      description: 'Keep stress ratings below 5/10',
      category: 'stress',
      target: 5,
      current: 6.8,
      unit: 'avg rating',
      deadline: '2024-03-15',
      status: 'at-risk'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'at-risk':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressPercentage = (current: number, target: number, category: string) => {
    if (category === 'stress') {
      // For stress, lower is better
      return Math.max(0, Math.min(100, ((target - current) / target) * 100 + 100))
    }
    return Math.min(100, (current / target) * 100)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goals & Targets</h1>
          <p className="text-gray-600 mt-1">Set and track your mental health objectives</p>
        </div>
        
        <button
          onClick={() => setShowCreateGoal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </button>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Goals</p>
              <p className="text-2xl font-semibold text-gray-900">{goals.length}</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-green-600">
                {goals.filter(g => g.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-blue-600">
                {goals.filter(g => g.status === 'in-progress').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">At Risk</p>
              <p className="text-2xl font-semibold text-red-600">
                {goals.filter(g => g.status === 'at-risk').length}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = getProgressPercentage(goal.current, goal.target, goal.category)
          
          return (
            <div key={goal.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(goal.status)}`}>
                      {goal.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{goal.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>Target: {goal.target} {goal.unit}</span>
                    <span>Current: {goal.current} {goal.unit}</span>
                    <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress >= 100 ? 'bg-green-500' :
                      progress >= 75 ? 'bg-blue-500' :
                      progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-3">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  Edit Goal
                </button>
                {goal.status === 'completed' && (
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Celebrate 🎉
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Goal Modal */}
      {showCreateGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Goal</h2>
              
              <div className="text-center py-8 text-gray-500">
                <p>Goal creation form coming soon...</p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateGoal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Goals