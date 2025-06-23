import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { PlusCircle, BarChart3, CreditCard, LogOut, User } from 'lucide-react'

interface HeaderProps {
  activeTab: 'expenses' | 'analytics'
  onTabChange: (tab: 'expenses' | 'analytics') => void
  onAddExpense: () => void
}

export function Header({ activeTab, onTabChange, onAddExpense }: HeaderProps) {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">ExpenseTracker</h1>
            </div>

            <nav className="flex space-x-1">
              <button
                onClick={() => onTabChange('expenses')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === 'expenses'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Expenses</span>
              </button>
              <button
                onClick={() => onTabChange('analytics')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === 'analytics'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onAddExpense}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 transform hover:scale-105"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Expense</span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">{user?.user_metadata?.full_name || user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}