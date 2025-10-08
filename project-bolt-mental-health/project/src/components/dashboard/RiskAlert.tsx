import React from 'react'
import { AlertTriangle, Heart, Phone } from 'lucide-react'

interface RiskAlertProps {
  riskLevel: 'moderate' | 'high'
}

const RiskAlert: React.FC<RiskAlertProps> = ({ riskLevel }) => {
  const isHighRisk = riskLevel === 'high'
  
  return (
    <div className={`rounded-lg p-4 ${
      isHighRisk ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
    }`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {isHighRisk ? (
            <AlertTriangle className="h-6 w-6 text-red-600" />
          ) : (
            <Heart className="h-6 w-6 text-yellow-600" />
          )}
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${
            isHighRisk ? 'text-red-800' : 'text-yellow-800'
          }`}>
            {isHighRisk ? 'High Risk Alert' : 'Elevated Risk Detected'}
          </h3>
          
          <div className={`mt-2 text-sm ${
            isHighRisk ? 'text-red-700' : 'text-yellow-700'
          }`}>
            <p>
              {isHighRisk 
                ? 'Our analysis indicates you may be experiencing significant mental health challenges. Please consider reaching out for professional support.'
                : 'Your recent data suggests some concerning patterns. Taking proactive steps now can help prevent escalation.'
              }
            </p>
          </div>
          
          <div className="mt-4 flex space-x-4">
            <button className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
              isHighRisk ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}>
              <Phone className="h-4 w-4 mr-2" />
              Find Help Now
            </button>
            
            <button className={`inline-flex items-center px-3 py-2 border ${
              isHighRisk ? 'border-red-300 text-red-700 hover:bg-red-50' : 'border-yellow-300 text-yellow-700 hover:bg-yellow-50'
            } text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}>
              View Resources
            </button>
          </div>
        </div>
      </div>
      
      {isHighRisk && (
        <div className="mt-4 p-3 bg-red-100 rounded-md">
          <p className="text-xs text-red-800">
            <strong>Crisis Resources:</strong> If you're in immediate danger, please call 911 or go to your nearest emergency room. 
            For mental health crisis support: National Suicide Prevention Lifeline: 988
          </p>
        </div>
      )}
    </div>
  )
}

export default RiskAlert