export interface Expense {
  id: string
  user_id: string
  title: string
  amount: number
  category: string
  date: string
  description?: string | null
  created_at: string
  updated_at: string
}

export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Groceries',
  'Other'
] as const

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]