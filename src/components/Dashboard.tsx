import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useExpenses } from '../hooks/useExpenses'
import { ExpenseForm } from './ExpenseForm'
import { ExpenseList } from './ExpenseList'
import { Analytics } from './Analytics'
import { Header } from './Header'
import { Expense } from '../types'

export function Dashboard() {
  const { user } = useAuth()
  const { expenses, loading, addExpense, updateExpense, deleteExpense } = useExpenses(user?.id)
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [activeTab, setActiveTab] = useState<'expenses' | 'analytics'>('expenses')

  const handleAddExpense = async (expenseData: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const { error } = await addExpense(expenseData)
    if (!error) {
      setIsAddingExpense(false)
    }
    return { error }
  }

  const handleUpdateExpense = async (id: string, updates: Partial<Expense>) => {
    const { error } = await updateExpense(id, updates)
    if (!error) {
      setEditingExpense(null)
    }
    return { error }
  }

  const handleDeleteExpense = async (id: string) => {
    return await deleteExpense(id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onAddExpense={() => setIsAddingExpense(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'expenses' ? (
          <ExpenseList
            expenses={expenses}
            onEdit={setEditingExpense}
            onDelete={handleDeleteExpense}
          />
        ) : (
          <Analytics expenses={expenses} />
        )}
      </main>

      {(isAddingExpense || editingExpense) && (
        <ExpenseForm
          expense={editingExpense}
          onSubmit={editingExpense ? 
            (data) => handleUpdateExpense(editingExpense.id, data) : 
            handleAddExpense
          }
          onClose={() => {
            setIsAddingExpense(false)
            setEditingExpense(null)
          }}
        />
      )}
    </div>
  )
}