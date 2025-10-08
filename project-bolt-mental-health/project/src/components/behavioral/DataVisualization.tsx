import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { BehavioralData } from '../../lib/supabase'
import { format, subDays, eachDayOfInterval } from 'date-fns'

interface DataVisualizationProps {
  data: BehavioralData[]
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data }) => {
  const [selectedType, setSelectedType] = useState('mood')
  const [timeRange, setTimeRange] = useState(30)

  // Filter and process data for visualization
  const processData = (dataType: string, days: number) => {
    const endDate = new Date()
    const startDate = subDays(endDate, days)
    
    // Get all days in range
    const allDays = eachDayOfInterval({ start: startDate, end: endDate })
    
    // Filter data for the selected type and time range
    const filteredData = data
      .filter(d => d.data_type === dataType)
      .filter(d => new Date(d.recorded_at) >= startDate)
    
    // Group by date and calculate average
    const groupedData = allDays.map(day => {
      const dayData = filteredData.filter(d => 
        format(new Date(d.recorded_at), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      )
      
      const average = dayData.length > 0 
        ? dayData.reduce((sum, d) => sum + d.value, 0) / dayData.length
        : null
      
      return {
        date: format(day, 'MMM dd'),
        value: average,
        fullDate: day,
        count: dayData.length
      }
    })
    
    return groupedData
  }

  const chartData = processData(selectedType, timeRange)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Data Visualization</h3>
        
        <div className="flex space-x-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="mood">Mood</option>
            <option value="stress">Stress</option>
            <option value="sleep">Sleep</option>
            <option value="activity">Activity</option>
            <option value="heart_rate">Heart Rate</option>
          </select>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              domain={selectedType === 'sleep' ? [0, 12] : selectedType === 'heart_rate' ? [50, 150] : [0, 10]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              labelFormatter={(value, payload) => {
                const item = payload?.[0]?.payload
                return item ? format(item.fullDate, 'MMM dd, yyyy') : value
              }}
              formatter={(value, name) => [
                value ? `${Number(value).toFixed(1)} ${getUnit(selectedType)}` : 'No data',
                name
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6' }}
              connectNulls={false}
              name={selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t">
        <div className="text-center">
          <p className="text-sm text-gray-500">Average</p>
          <p className="text-lg font-semibold text-gray-900">
            {calculateAverage(chartData)} {getUnit(selectedType)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Highest</p>
          <p className="text-lg font-semibold text-gray-900">
            {calculateMax(chartData)} {getUnit(selectedType)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Lowest</p>
          <p className="text-lg font-semibold text-gray-900">
            {calculateMin(chartData)} {getUnit(selectedType)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">Entries</p>
          <p className="text-lg font-semibold text-gray-900">
            {data.filter(d => d.data_type === selectedType).length}
          </p>
        </div>
      </div>
    </div>
  )
}

const getUnit = (type: string) => {
  switch (type) {
    case 'sleep': return 'hrs'
    case 'heart_rate': return 'bpm'
    default: return '/10'
  }
}

const calculateAverage = (data: any[]) => {
  const validData = data.filter(d => d.value !== null)
  if (validData.length === 0) return '0.0'
  const avg = validData.reduce((sum, d) => sum + d.value, 0) / validData.length
  return avg.toFixed(1)
}

const calculateMax = (data: any[]) => {
  const validData = data.filter(d => d.value !== null)
  if (validData.length === 0) return '0.0'
  return Math.max(...validData.map(d => d.value)).toFixed(1)
}

const calculateMin = (data: any[]) => {
  const validData = data.filter(d => d.value !== null)
  if (validData.length === 0) return '0.0'
  return Math.min(...validData.map(d => d.value)).toFixed(1)
}

export default DataVisualization