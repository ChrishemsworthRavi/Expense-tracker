import React from 'react'
import { Edit, Trash2, Calendar, Tag, DollarSign } from 'lucide-react'
import { Expense } from '../types'
import { format } from 'date-fns'

interface ExpenseListProps {
  expenses: Expense[]
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => Promise<{ error: string | null }>
}

export function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await onDelete(id)
    }
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
        <p className="text-gray-500 mb-6">Start tracking your expenses by adding your first one.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Your Expenses</h2>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-3xl font-bold text-blue-600">
              ${totalAmount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{expense.title}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Tag className="w-3 h-3 mr-1" />
                    {expense.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {format(new Date(expense.date), 'MMM dd, yyyy')}
                  </span>
                </div>

                {expense.description && (
                  <p className="text-gray-600 text-sm">{expense.description}</p>
                )}
              </div>

              <div className="flex items-center space-x-4 ml-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ${expense.amount.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(expense)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit expense"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id, expense.title)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}