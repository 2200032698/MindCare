import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, BehavioralData } from '../lib/supabase'
import { Plus, Download, Upload, Activity } from 'lucide-react'
import DataEntry from '../components/behavioral/DataEntry'
import DataVisualization from '../components/behavioral/DataVisualization'
import DataTable from '../components/behavioral/DataTable'

const BehavioralDataPage: React.FC = () => {
  const { user } = useAuth()
  const [data, setData] = useState<BehavioralData[]>([])
  const [loading, setLoading] = useState(true)
  const [showDataEntry, setShowDataEntry] = useState(false)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Fetch last 90 days of data
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

      const { data: behavioralData, error } = await supabase
        .from('behavioral_data')
        .select('*')
        .eq('user_id', user.id)
        .gte('recorded_at', ninetyDaysAgo.toISOString())
        .order('recorded_at', { ascending: false })

      if (error) throw error
      setData(behavioralData || [])
    } catch (error) {
      console.error('Error fetching behavioral data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDataAdded = () => {
    fetchData()
    setShowDataEntry(false)
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
          <h1 className="text-3xl font-bold text-gray-900">Behavioral Data</h1>
          <p className="text-gray-600 mt-1">Track and analyze your daily wellness metrics</p>
        </div>
        
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </button>
          
          <button
            onClick={() => setShowDataEntry(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Data
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['sleep', 'mood', 'stress', 'activity'].map(type => {
          const typeData = data.filter(d => d.data_type === type)
          const average = typeData.length > 0 
            ? typeData.reduce((sum, d) => sum + d.value, 0) / typeData.length
            : 0

          return (
            <div key={type} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 capitalize">{type}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {average.toFixed(1)}{type === 'sleep' ? 'h' : '/10'}
                  </p>
                  <p className="text-xs text-gray-500">{typeData.length} entries</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Data Visualization */}
      <DataVisualization data={data} />

      {/* Data Table */}
      <DataTable data={data} onRefresh={fetchData} />

      {/* Data Entry Modal */}
      {showDataEntry && (
        <DataEntry
          onClose={() => setShowDataEntry(false)}
          onDataAdded={handleDataAdded}
        />
      )}
    </div>
  )
}

export default BehavioralDataPage