import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Expense } from '../types'

export function useExpenses(userId: string | undefined) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setExpenses([])
      setLoading(false)
      return
    }

    fetchExpenses()
  }, [userId])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error

      setExpenses(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addExpense = async (expense: Omit<Expense, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expense, user_id: userId }])
        .select()
        .single()

      if (error) throw error

      setExpenses(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to add expense'
      return { data: null, error }
    }
  }

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      setExpenses(prev => prev.map(exp => exp.id === id ? data : exp))
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update expense'
      return { data: null, error }
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)

      if (error) throw error

      setExpenses(prev => prev.filter(exp => exp.id !== id))
      return { error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete expense'
      return { error }
    }
  }

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses
  }
}