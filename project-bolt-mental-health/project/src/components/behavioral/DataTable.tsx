import React from 'react'
import { BehavioralData } from '../../lib/supabase'
import { format } from 'date-fns'
import { Edit, Trash2 } from 'lucide-react'

interface DataTableProps {
  data: BehavioralData[]
  onRefresh: () => void
}

const DataTable: React.FC<DataTableProps> = ({ data, onRefresh }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mood': return 'bg-blue-100 text-blue-800'
      case 'stress': return 'bg-red-100 text-red-800'
      case 'sleep': return 'bg-purple-100 text-purple-800'
      case 'activity': return 'bg-green-100 text-green-800'
      case 'heart_rate': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSourceBadge = (source: string) => {
    const colors = {
      manual: 'bg-gray-100 text-gray-800',
      wearable: 'bg-blue-100 text-blue-800',
      survey: 'bg-green-100 text-green-800'
    }
    return colors[source as keyof typeof colors] || colors.manual
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Entries</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No data entries yet. Add your first entry to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Entries</h3>
        <p className="text-sm text-gray-500">{data.length} total entries</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.slice(0, 50).map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(entry.data_type)}`}>
                    {entry.data_type.charAt(0).toUpperCase() + entry.data_type.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {entry.value} {entry.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSourceBadge(entry.source)}`}>
                    {entry.source}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(entry.recorded_at), 'MMM dd, yyyy hh:mm a')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > 50 && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Load more entries...
          </button>
        </div>
      )}
    </div>
  )
}

export default DataTable