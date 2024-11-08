import React from 'react';
import { Expense } from '../types';
import { getCategoryColor } from '../utils/categoryColors';

interface ExpenseSummaryProps {
  expenses: Expense[];
  previousPeriodExpenses: Expense[];
  filterPeriod: string;
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses, previousPeriodExpenses, filterPeriod }) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalPreviousPeriodExpenses = previousPeriodExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const previousExpensesByCategory = previousPeriodExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Combine current and previous categories
  const allCategories = new Set([...Object.keys(expensesByCategory), ...Object.keys(previousExpensesByCategory)]);

  const sortedCategories = Array.from(allCategories)
    .sort((a, b) => (expensesByCategory[b] || 0) - (expensesByCategory[a] || 0));

  const maxAmount = Math.max(...Object.values(expensesByCategory), 1); // Ensure non-zero denominator

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 'N/A (new expense)' : 'N/A';
    return ((current - previous) / previous * 100).toFixed(2) + '%';
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Expense Summary</h2>
      <div className="flex justify-between items-center mb-4">
        <p className="text-xl text-gray-800 dark:text-white">
          Total Expenses: {formatCurrency(totalExpenses)}
        </p>
        {filterPeriod !== 'all' && (
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Previous period: {formatCurrency(totalPreviousPeriodExpenses)}
            </p>
            <p className={`text-sm ${totalExpenses > totalPreviousPeriodExpenses ? 'text-red-500' : 'text-green-500'}`}>
              {calculatePercentageChange(totalExpenses, totalPreviousPeriodExpenses)}
              {totalExpenses > totalPreviousPeriodExpenses ? ' increase' : ' decrease'}
            </p>
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">Expenses by Category:</h3>
      {sortedCategories.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No expenses found for the current or previous period.</p>
      ) : (
        <ul className="space-y-2">
          {sortedCategories.map((category) => {
            const currentAmount = expensesByCategory[category] || 0;
            const previousAmount = previousExpensesByCategory[category] || 0;
            return (
              <li key={category} className="text-gray-600 dark:text-gray-300">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium" style={{ color: getCategoryColor(category) }}>{category}</span>
                  <div className="text-right">
                    <span>{formatCurrency(currentAmount)}</span>
                    {filterPeriod !== 'all' && (
                      <p className="text-xs">
                        Previous: {formatCurrency(previousAmount)}
                        <span className={`ml-2 ${currentAmount > previousAmount ? 'text-red-500' : 'text-green-500'}`}>
                          {calculatePercentageChange(currentAmount, previousAmount)}
                          {currentAmount > previousAmount ? ' increase' : ' decrease'}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(currentAmount / maxAmount) * 100}%`,
                      backgroundColor: getCategoryColor(category)
                    }}
                  ></div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ExpenseSummary;