import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Expense } from '../types'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'
import { TrendingUp, DollarSign, Calendar, PieChart as PieChartIcon } from 'lucide-react'

interface AnalyticsProps {
  expenses: Expense[]
}

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316']

export function Analytics({ expenses }: AnalyticsProps) {
  const analytics = useMemo(() => {
    const currentMonth = new Date()
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)

    // Filter current month expenses
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= monthStart && expenseDate <= monthEnd
    })

    // Total for current month
    const totalThisMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    // Category breakdown
    const categoryData = currentMonthExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    const categoryChartData = Object.entries(categoryData).map(([category, amount]) => ({
      category,
      amount,
      percentage: ((amount / totalThisMonth) * 100).toFixed(1)
    })).sort((a, b) => b.amount - a.amount)

    // Daily spending for current month
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const dailyData = days.map(day => {
      const dayExpenses = currentMonthExpenses.filter(expense => 
        isSameDay(new Date(expense.date), day)
      )
      const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      return {
        date: format(day, 'MMM dd'),
        amount: total
      }
    })

    // Average daily spending
    const averageDaily = totalThisMonth / days.length

    return {
      totalThisMonth,
      categoryChartData,
      dailyData,
      averageDaily,
      transactionCount: currentMonthExpenses.length
    }
  }, [expenses])

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <PieChartIcon className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No data to analyze</h3>
        <p className="text-gray-500">Add some expenses to see your analytics.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">This Month</p>
              <p className="text-2xl font-bold">${analytics.totalThisMonth.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Daily Average</p>
              <p className="text-2xl font-bold">${analytics.averageDaily.toFixed(2)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Transactions</p>
              <p className="text-2xl font-bold">{analytics.transactionCount}</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Categories</p>
              <p className="text-2xl font-bold">{analytics.categoryChartData.length}</p>
            </div>
            <PieChartIcon className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.categoryChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {analytics.categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Bar Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.categoryChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={100} />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
                <Bar dataKey="amount" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Daily Spending Line Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Spending This Month</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Amount']} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}