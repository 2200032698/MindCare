import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Activity, 
  Brain, 
  Target, 
  Users, 
  Heart,
  BarChart3,
  Lightbulb
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Behavioral Data', href: '/behavioral-data', icon: Activity },
  { name: 'Risk Assessment', href: '/risk-assessment', icon: Brain },
  { name: 'Recommendations', href: '/recommendations', icon: Lightbulb },
  { name: 'Progress Tracking', href: '/progress', icon: BarChart3 },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Wellness Tools', href: '/wellness', icon: Heart },
  { name: 'Goals', href: '/goals', icon: Target },
]

const Sidebar: React.FC = () => {
  return (
    <div className="bg-white w-64 shadow-lg">
      <div className="flex items-center justify-center h-20 border-b border-gray-200">
        <Heart className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">MindCare</span>
      </div>
      
      <nav className="mt-8 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default Sidebar