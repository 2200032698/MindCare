import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase, MentalHealthAssessment } from '../lib/supabase'
import { Brain, AlertTriangle, CheckCircle, TrendingUp, X } from 'lucide-react'

const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself or that you are a failure',
  'Trouble concentrating on things',
  'Moving or speaking slowly, or being fidgety or restless',
  'Thoughts that you would be better off dead'
]

const GAD7_QUESTIONS = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid, as if something awful might happen'
]

const RiskAssessment: React.FC = () => {
  const { user } = useAuth()
  const [currentAssessment, setCurrentAssessment] = useState<'phq9' | 'gad7' | null>(null)
  const [assessmentHistory, setAssessmentHistory] = useState<MentalHealthAssessment[]>([])
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<number, number>>({})

  useEffect(() => {
    if (user) {
      fetchAssessmentHistory()
    }
  }, [user])

  const fetchAssessmentHistory = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('mental_health_assessments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setAssessmentHistory(data || [])
    } catch (error) {
      console.error('Error fetching assessments:', error)
    }
  }

  const startAssessment = (type: 'phq9' | 'gad7') => {
    setCurrentAssessment(type)
    setCurrentStep(0)
    setResponses({})
  }

  const handleResponse = (value: number) => {
    const questions = currentAssessment === 'phq9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS
    const newResponses = { ...responses, [currentStep]: value }
    setResponses(newResponses)

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      submitAssessment(newResponses)
    }
  }

  const submitAssessment = async (finalResponses: Record<number, number>) => {
    if (!user) return

    setLoading(true)
    try {
      const score = Object.values(finalResponses).reduce((sum, val) => sum + val, 0)
      let riskLevel: 'low' | 'moderate' | 'high' = 'low'

      if (currentAssessment === 'phq9') {
        if (score >= 15) riskLevel = 'high'
        else if (score >= 10) riskLevel = 'moderate'
      } else {
        if (score >= 15) riskLevel = 'high'
        else if (score >= 10) riskLevel = 'moderate'
      }

      const { error } = await supabase
        .from('mental_health_assessments')
        .insert([{
          user_id: user.id,
          assessment_type: currentAssessment!,
          score,
          responses: finalResponses,
          risk_level: riskLevel
        }])

      if (error) throw error

      await fetchAssessmentHistory()
      setCurrentAssessment(null)
      setResponses({})
      setCurrentStep(0)
    } catch (error) {
      console.error('Error submitting assessment:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLatestAssessment = (type: 'phq9' | 'gad7') => {
    return assessmentHistory.find(a => a.assessment_type === type)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Risk Assessment</h1>
          <p className="text-gray-600 mt-1">Monitor your mental health with validated screening tools</p>
        </div>
      </div>

      {/* Assessment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">PHQ-9 Depression Screening</h3>
                <p className="text-sm text-gray-600">9-question depression assessment</p>
              </div>
            </div>
          </div>

          {getLatestAssessment('phq9') ? (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last completed</span>
                <span className="text-gray-900">
                  {new Date(getLatestAssessment('phq9')!.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-500">Score</span>
                <span className={`font-medium ${
                  getLatestAssessment('phq9')!.risk_level === 'high' ? 'text-red-600' :
                  getLatestAssessment('phq9')!.risk_level === 'moderate' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {getLatestAssessment('phq9')!.score} ({getLatestAssessment('phq9')!.risk_level})
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-4">Not yet completed</p>
          )}

          <button
            onClick={() => startAssessment('phq9')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Take Assessment
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">GAD-7 Anxiety Screening</h3>
                <p className="text-sm text-gray-600">7-question anxiety assessment</p>
              </div>
            </div>
          </div>

          {getLatestAssessment('gad7') ? (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last completed</span>
                <span className="text-gray-900">
                  {new Date(getLatestAssessment('gad7')!.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-500">Score</span>
                <span className={`font-medium ${
                  getLatestAssessment('gad7')!.risk_level === 'high' ? 'text-red-600' :
                  getLatestAssessment('gad7')!.risk_level === 'moderate' ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {getLatestAssessment('gad7')!.score} ({getLatestAssessment('gad7')!.risk_level})
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-4">Not yet completed</p>
          )}

          <button
            onClick={() => startAssessment('gad7')}
            className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Take Assessment
          </button>
        </div>
      </div>

      {/* Assessment History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment History</h3>

        {assessmentHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No assessments completed yet. Take your first assessment above.</p>
        ) : (
          <div className="space-y-4">
            {assessmentHistory.map((assessment, index) => {
              const displayName = assessment.assessment_type === 'phq9' ? 'PHQ-9' : 'GAD-7'
              const isPhq9 = assessment.assessment_type === 'phq9'
              const prevScore = assessmentHistory.find((a, i) =>
                i > index && a.assessment_type === assessment.assessment_type
              )?.score
              const trend = prevScore ? (assessment.score > prevScore ? 'up' : assessment.score < prevScore ? 'down' : 'same') : 'same'

              return (
                <div key={assessment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${isPhq9 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                      <Brain className={`h-5 w-5 ${isPhq9 ? 'text-blue-600' : 'text-orange-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{displayName}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(assessment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">Score: {assessment.score}</p>
                      <p className={`text-sm capitalize ${
                        assessment.risk_level === 'low' ? 'text-green-600' :
                        assessment.risk_level === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {assessment.risk_level} Risk
                      </p>
                    </div>

                    <div className="flex items-center">
                      <TrendingUp className={`h-4 w-4 ${
                        trend === 'up' ? 'text-red-500 rotate-45' :
                        trend === 'down' ? 'text-green-500 -rotate-45' : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Assessment Modal */}
      {currentAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentAssessment === 'phq9' ? 'PHQ-9 Depression Screening' : 'GAD-7 Anxiety Screening'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Question {currentStep + 1} of {currentAssessment === 'phq9' ? 9 : 7}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentAssessment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / (currentAssessment === 'phq9' ? 9 : 7)) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mb-8">
                <p className="text-lg text-gray-900 mb-6">
                  Over the last 2 weeks, how often have you been bothered by:
                </p>
                <p className="text-xl font-medium text-gray-900 mb-6">
                  {currentAssessment === 'phq9' ? PHQ9_QUESTIONS[currentStep] : GAD7_QUESTIONS[currentStep]}
                </p>

                <div className="space-y-3">
                  {[
                    { label: 'Not at all', value: 0 },
                    { label: 'Several days', value: 1 },
                    { label: 'More than half the days', value: 2 },
                    { label: 'Nearly every day', value: 3 }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleResponse(option.value)}
                      disabled={loading}
                      className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50"
                    >
                      <span className="font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Previous Question
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RiskAssessment