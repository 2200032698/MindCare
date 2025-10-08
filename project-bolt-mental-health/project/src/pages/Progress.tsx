import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, BehavioralData, MentalHealthAssessment } from '../lib/supabase'
import { TrendingUp, TrendingDown, Minus, Target, Award, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { format } from 'date-fns'

const Progress: React.FC = () => {
  const { user } = useAuth()
  const [behavioralData, setBehavioralData] = useState<BehavioralData[]>([])
  const [assessments, setAssessments] = useState<MentalHealthAssessment[]>([])
  const [timeRange, setTimeRange] = useState(30)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user, timeRange])

  const fetchData = async () => {
    if (!user) return
    try {
      setLoading(true)
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - timeRange)

      const { data: behavioral, error: behavioralError } = await supabase
        .from('behavioral_data')
        .select('*')
        .eq('user_id', user.id)
        .gte('recorded_at', startDate.toISOString())
        .order('recorded_at', { ascending: true })

      if (behavioralError) throw behavioralError
      setBehavioralData(behavioral || [])

      const { data: assessmentData, error: assessmentError } = await supabase
        .from('mental_health_assessments')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      if (assessmentError) throw assessmentError
      setAssessments(assessmentData || [])
    } catch (error) {
      console.error('Error fetching progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMoodData = () => {
    const moodData = behavioralData.filter(d => d.data_type === 'mood')
    return moodData.map(d => ({
      date: format(new Date(d.recorded_at), 'MM/dd'),
      mood: d.value
    }))
  }

  const getSleepData = () => {
    const sleepData = behavioralData.filter(d => d.data_type === 'sleep')
    return sleepData.map(d => ({
      date: format(new Date(d.recorded_at), 'MM/dd'),
      sleep: d.value
    }))
  }

  const calculateMoodStability = () => {
    const moodData = behavioralData.filter(d => d.data_type === 'mood')
    if (moodData.length === 0) return 0
    const targetRange = moodData.filter(d => d.value >= 5 && d.value <= 8)
    return Math.round((targetRange.length / moodData.length) * 100)
  }

  const calculateStreak = () => {
    const dates = [...new Set(behavioralData.map(d => format(new Date(d.recorded_at), 'yyyy-MM-dd')))]
    return dates.length
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor your mental health journey over time</p>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 3 months</option>
            <option value={180}>Last 6 months</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overall Progress</p>
              <p className="text-2xl font-semibold text-green-600">+15%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Compared to last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Mood Stability</p>
              <p className="text-2xl font-semibold text-blue-600">{calculateMoodStability()}%</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Days within target range</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Goals Completed</p>
              <p className="text-2xl font-semibold text-purple-600">12/15</p>
            </div>
            <Award className="h-8 w-8 text-purple-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Streak</p>
              <p className="text-2xl font-semibold text-orange-600">{calculateStreak()}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Days of data logging</p>
        </div>
      </div>

      {/* Progress Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Trends</h3>
          {getMoodData().length > 0 ? (
            <ResponsiveContainer width="100%" height={256}>
              <LineChart data={getMoodData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  domain={[0, 10]}
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>No mood data available for this time period</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sleep Quality</h3>
          {getSleepData().length > 0 ? (
            <ResponsiveContainer width="100%" height={256}>
              <AreaChart data={getSleepData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  domain={[0, 12]}
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sleep"
                  stroke="#8b5cf6"
                  fill="#c4b5fd"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>No sleep data available for this time period</p>
            </div>
          )}
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Milestones</h3>
        
        <div className="space-y-4">
          {[
            { title: '30 Days of Consistent Tracking', date: '3 days ago', type: 'achievement', icon: Calendar },
            { title: 'Mood Improved by 20%', date: '1 week ago', type: 'progress', icon: TrendingUp },
            { title: 'Completed First Assessment', date: '2 weeks ago', type: 'milestone', icon: Award },
            { title: 'Sleep Quality Stabilized', date: '3 weeks ago', type: 'progress', icon: Target }
          ].map((milestone, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className={`p-2 rounded-lg ${
                milestone.type === 'achievement' ? 'bg-yellow-100' :
                milestone.type === 'progress' ? 'bg-green-100' : 'bg-blue-100'
              }`}>
                <milestone.icon className={`h-5 w-5 ${
                  milestone.type === 'achievement' ? 'text-yellow-600' :
                  milestone.type === 'progress' ? 'text-green-600' : 'text-blue-600'
                }`} />
              </div>
              
              <div className="flex-1">
                <p className="font-medium text-gray-900">{milestone.title}</p>
                <p className="text-sm text-gray-500">{milestone.date}</p>
              </div>
              
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                milestone.type === 'achievement' ? 'bg-yellow-100 text-yellow-800' :
                milestone.type === 'progress' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {milestone.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-900">Positive Trend</h4>
            </div>
            <p className="text-sm text-green-800">
              Your mood scores have been consistently improving over the past 3 weeks, 
              showing great progress with your current strategies.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center mb-2">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-900">Pattern Recognition</h4>
            </div>
            <p className="text-sm text-blue-800">
              Your best mood days correlate with 7+ hours of sleep and regular physical activity. 
              Consider maintaining these habits.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Progress