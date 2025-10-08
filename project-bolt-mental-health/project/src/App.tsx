import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import BehavioralData from './pages/BehavioralData'
import RiskAssessment from './pages/RiskAssessment'
import Recommendations from './pages/Recommendations'
import Progress from './pages/Progress'
import Community from './pages/Community'
import Wellness from './pages/Wellness'
import Goals from './pages/Goals'
import Auth from './pages/Auth'

const AppContent: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return <Auth />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/behavioral-data" element={<BehavioralData />} />
        <Route path="/risk-assessment" element={<RiskAssessment />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/community" element={<Community />} />
        <Route path="/wellness" element={<Wellness />} />
        <Route path="/goals" element={<Goals />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App