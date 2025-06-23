import React, { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { AuthForm } from './components/AuthForm'
import { Dashboard } from './components/Dashboard'

function App() {
  const { user, loading, signUp, signIn } = useAuth()
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(false)

  const handleAuth = async (email: string, password: string, fullName?: string) => {
    setAuthLoading(true)
    setAuthError(null)

    try {
      if (authMode === 'login') {
        const { error } = await signIn(email, password)
        if (error) {
          setAuthError(error.message)
        }
      } else {
        if (!fullName) {
          setAuthError('Full name is required')
          return
        }
        const { error } = await signUp(email, password, fullName)
        if (error) {
          setAuthError(error.message)
        }
      }
    } catch (error) {
      setAuthError('An unexpected error occurred')
    } finally {
      setAuthLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <AuthForm
        mode={authMode}
        onSubmit={handleAuth}
        loading={authLoading}
        error={authError}
        onModeChange={() => {
          setAuthMode(authMode === 'login' ? 'signup' : 'login')
          setAuthError(null)
        }}
      />
    )
  }

  return <Dashboard />
}

export default App