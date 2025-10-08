import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { X } from 'lucide-react'

interface DataEntryProps {
  onClose: () => void
  onDataAdded: () => void
}

const DataEntry: React.FC<DataEntryProps> = ({ onClose, onDataAdded }) => {
  const { user } = useAuth()
  const [dataType, setDataType] = useState<'sleep' | 'mood' | 'stress' | 'activity' | 'heart_rate'>('mood')
  const [value, setValue] = useState('')
  const [recordedAt, setRecordedAt] = useState(new Date().toISOString().slice(0, 16))
  const [source, setSource] = useState<'manual' | 'wearable' | 'survey'>('manual')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('behavioral_data')
        .insert([
          {
            user_id: user.id,
            data_type: dataType,
            value: parseFloat(value),
            unit: getUnit(dataType),
            recorded_at: new Date(recordedAt).toISOString(),
            source
          }
        ])

      if (error) throw error
      onDataAdded()
    } catch (error) {
      console.error('Error adding data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getUnit = (type: string) => {
    switch (type) {
      case 'sleep': return 'hours'
      case 'heart_rate': return 'bpm'
      default: return 'scale'
    }
  }

  const getMaxValue = (type: string) => {
    switch (type) {
      case 'sleep': return 24
      case 'heart_rate': return 200
      default: return 10
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Add Data Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Type
            </label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value as any)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="mood">Mood (1-10)</option>
              <option value="stress">Stress Level (1-10)</option>
              <option value="sleep">Sleep Hours</option>
              <option value="activity">Activity Level (1-10)</option>
              <option value="heart_rate">Heart Rate (BPM)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Value
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max={getMaxValue(dataType)}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {dataType === 'sleep' && 'Enter hours of sleep (e.g., 7.5)'}
              {dataType === 'heart_rate' && 'Enter beats per minute'}
              {!['sleep', 'heart_rate'].includes(dataType) && 'Rate from 1 (lowest) to 10 (highest)'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={recordedAt}
              onChange={(e) => setRecordedAt(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Source
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as any)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="manual">Manual Entry</option>
              <option value="wearable">Wearable Device</option>
              <option value="survey">Survey/Assessment</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DataEntry