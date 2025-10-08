import { BehavioralData, MentalHealthAssessment } from './supabase'

// Mock ML models for mental health risk assessment
export class MentalHealthMLModels {
  
  // Risk assessment based on behavioral patterns
  static assessRiskLevel(
    behavioralData: BehavioralData[],
    assessments: MentalHealthAssessment[]
  ): 'low' | 'moderate' | 'high' {
    let riskScore = 0
    
    // Analyze sleep patterns
    const sleepData = behavioralData.filter(d => d.data_type === 'sleep')
    const avgSleep = sleepData.reduce((sum, d) => sum + d.value, 0) / sleepData.length
    
    if (avgSleep < 6) riskScore += 2
    else if (avgSleep < 7) riskScore += 1
    
    // Analyze stress levels
    const stressData = behavioralData.filter(d => d.data_type === 'stress')
    const avgStress = stressData.reduce((sum, d) => sum + d.value, 0) / stressData.length
    
    if (avgStress > 7) riskScore += 2
    else if (avgStress > 5) riskScore += 1
    
    // Analyze mood patterns
    const moodData = behavioralData.filter(d => d.data_type === 'mood')
    const avgMood = moodData.reduce((sum, d) => sum + d.value, 0) / moodData.length
    
    if (avgMood < 4) riskScore += 2
    else if (avgMood < 6) riskScore += 1
    
    // Consider recent assessments
    const recentAssessment = assessments.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0]
    
    if (recentAssessment) {
      if (recentAssessment.score > 15) riskScore += 3
      else if (recentAssessment.score > 10) riskScore += 2
      else if (recentAssessment.score > 5) riskScore += 1
    }
    
    // Determine risk level
    if (riskScore >= 6) return 'high'
    if (riskScore >= 3) return 'moderate'
    return 'low'
  }
  
  // Generate personalized recommendations
  static generateRecommendations(
    riskLevel: 'low' | 'moderate' | 'high',
    behavioralData: BehavioralData[]
  ): Array<{ type: string; title: string; description: string; priority: number }> {
    const recommendations = []
    
    // Sleep-based recommendations
    const sleepData = behavioralData.filter(d => d.data_type === 'sleep')
    const avgSleep = sleepData.reduce((sum, d) => sum + d.value, 0) / sleepData.length
    
    if (avgSleep < 7) {
      recommendations.push({
        type: 'lifestyle',
        title: 'Improve Sleep Hygiene',
        description: 'Create a consistent bedtime routine and aim for 7-8 hours of sleep nightly.',
        priority: riskLevel === 'high' ? 1 : 2
      })
    }
    
    // Stress-based recommendations
    const stressData = behavioralData.filter(d => d.data_type === 'stress')
    const avgStress = stressData.reduce((sum, d) => sum + d.value, 0) / stressData.length
    
    if (avgStress > 6) {
      recommendations.push({
        type: 'mindfulness',
        title: 'Daily Stress Management',
        description: 'Practice deep breathing exercises and progressive muscle relaxation.',
        priority: 1
      })
    }
    
    // General recommendations based on risk level
    if (riskLevel === 'high') {
      recommendations.push({
        type: 'therapy',
        title: 'Professional Support',
        description: 'Consider scheduling a session with a mental health professional.',
        priority: 1
      })
    }
    
    if (riskLevel === 'moderate') {
      recommendations.push({
        type: 'activity',
        title: 'Physical Activity',
        description: 'Engage in 30 minutes of moderate exercise daily.',
        priority: 2
      })
    }
    
    recommendations.push({
      type: 'community',
      title: 'Connect with Others',
      description: 'Join our community forums to share experiences and get support.',
      priority: 3
    })
    
    return recommendations
  }
  
  // Predict mood trends
  static predictMoodTrend(behavioralData: BehavioralData[]): {
    trend: 'improving' | 'stable' | 'declining'
    confidence: number
  } {
    const moodData = behavioralData
      .filter(d => d.data_type === 'mood')
      .sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime())
    
    if (moodData.length < 3) {
      return { trend: 'stable', confidence: 0.3 }
    }
    
    const recent = moodData.slice(-7) // Last 7 data points
    const earlier = moodData.slice(-14, -7) // Previous 7 data points
    
    const recentAvg = recent.reduce((sum, d) => sum + d.value, 0) / recent.length
    const earlierAvg = earlier.reduce((sum, d) => sum + d.value, 0) / earlier.length
    
    const difference = recentAvg - earlierAvg
    const confidence = Math.min(Math.abs(difference) / 2, 0.9)
    
    if (difference > 0.5) return { trend: 'improving', confidence }
    if (difference < -0.5) return { trend: 'declining', confidence }
    return { trend: 'stable', confidence: Math.max(confidence, 0.6) }
  }
}