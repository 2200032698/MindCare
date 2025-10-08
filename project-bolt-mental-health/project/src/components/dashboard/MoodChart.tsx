import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BehavioralData } from '../../lib/supabase'
import { format } from 'date-fns'

interface MoodChartProps {
  behavioralData: BehavioralData[]
}

const MoodChart: React.FC<MoodChartProps> = ({ behavioralData }) => {
  // Process mood data for chart
  const moodData = behavioralData
    .filter(d => d.data_type === 'mood')
    .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
    .slice(-14) // Last 14 days
    .map(d => ({
      date: format(new Date(d.recorded_at), 'MM/dd'),
      mood: d.value,
      fullDate: d.recorded_at
    }))

  if (moodData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Trend</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No mood data available. Start tracking your daily mood!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Trend (Last 2 Weeks)</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip 
              labelFormatter={(value, payload) => {
                const item = payload?.[0]?.payload
                return item ? format(new Date(item.fullDate), 'MMM dd, yyyy') : value
              }}
              formatter={(value) => [`${value}/10`, 'Mood']}
            />
            <Line 
              type="monotone" 
              dataKey="mood" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <span>1 = Very Low</span>
        <span>10 = Excellent</span>
      </div>
    </div>
  )
}

export default MoodChart