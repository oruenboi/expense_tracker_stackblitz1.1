import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import PeriodFilter from './PeriodFilter';
import ExpenseSummary from './ExpenseSummary';
import ExpenseList from './ExpenseList';
import EmailVerification from './EmailVerification';
import ExpenseChart from './ExpenseChart';
import ExpenseModal from './ExpenseModal';
import { Expense } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { addExpense, updateExpense, deleteExpense, getUserExpenses } from '../lib/db';
import { toast } from 'react-hot-toast';
import { Loader2, Plus } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [previousPeriodExpenses, setPreviousPeriodExpenses] = useState<Expense[]>([]);
  const [filterPeriod, setFilterPeriod] = useState('thisMonth');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  // Fetch expenses
  const fetchExpenses = useCallback(async () => {
    if (!user) return;
    try {
      const fetchedExpenses = await getUserExpenses(user.id);
      setExpenses(fetchedExpenses);
    } catch (error) {
      toast.error('Failed to fetch expenses');
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const filterExpenses = useCallback(() => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    let filteredExpenses = expenses;
    let previousPeriodStart = new Date();
    let previousPeriodEnd = new Date();
    let currentPeriodStart = new Date();

    const filterByDateRange = (start: Date, end: Date) => {
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= start && expenseDate <= end;
      });
    };

    switch (filterPeriod) {
      case 'thisWeek':
        filteredExpenses = filterByDateRange(startOfWeek, today);
        previousPeriodStart = new Date(startOfWeek);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
        previousPeriodEnd = new Date(startOfWeek);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        currentPeriodStart = startOfWeek;
        break;
      case 'thisMonth':
        filteredExpenses = filterByDateRange(startOfMonth, today);
        previousPeriodStart = new Date(startOfMonth);
        previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
        previousPeriodEnd = new Date(startOfMonth);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        currentPeriodStart = startOfMonth;
        break;
      case 'thisYear':
        filteredExpenses = filterByDateRange(startOfYear, today);
        previousPeriodStart = new Date(startOfYear);
        previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 1);
        previousPeriodEnd = new Date(startOfYear);
        previousPeriodEnd.setDate(previousPeriodEnd.getDate() - 1);
        currentPeriodStart = startOfYear;
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          const startDate = new Date(customStartDate);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(customEndDate);
          endDate.setHours(23, 59, 59, 999);
          filteredExpenses = filterByDateRange(startDate, endDate);
          const duration = endDate.getTime() - startDate.getTime();
          previousPeriodStart = new Date(startDate.getTime() - duration);
          previousPeriodEnd = new Date(startDate.getTime() - 1);
          currentPeriodStart = startDate;
        }
        break;
    }

    setFilteredExpenses(filteredExpenses);
    setPreviousPeriodExpenses(filterByDateRange(previousPeriodStart, previousPeriodEnd));
  }, [expenses, filterPeriod, customStartDate, customEndDate]);

  useEffect(() => {
    filterExpenses();
  }, [filterExpenses]);

  const handleAddExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!user) return;
    try {
      const expenseId = await addExpense(user.id, expense);
      const newExpense = { ...expense, id: expenseId };
      setExpenses(prev => [...prev, newExpense]);
      toast.success('Expense added successfully');
    } catch (error) {
      toast.error('Failed to add expense');
      console.error('Error adding expense:', error);
    }
  };

  const handleEditExpense = async (id: string, updatedExpense: Omit<Expense, 'id'>) => {
    try {
      await updateExpense(id, updatedExpense);
      setExpenses(prev => prev.map(expense => 
        expense.id === id ? { ...updatedExpense, id } : expense
      ));
      toast.success('Expense updated successfully');
    } catch (error) {
      toast.error('Failed to update expense');
      console.error('Error updating expense:', error);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await deleteExpense(id);
      setExpenses(prev => prev.filter(expense => expense.id !== id));
      toast.success('Expense deleted successfully');
    } catch (error) {
      toast.error('Failed to delete expense');
      console.error('Error deleting expense:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Expense Tracker</h1>
      <EmailVerification />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Expense Distribution</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus size={20} />
              Add Expense
            </button>
          </div>
          <PeriodFilter
            filterPeriod={filterPeriod}
            setFilterPeriod={setFilterPeriod}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            customEndDate={customEndDate}
            setCustomEndDate={setCustomEndDate}
          />
          <div className="mt-4">
            <ExpenseChart expenses={filteredExpenses} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <ExpenseSummary 
            expenses={filteredExpenses} 
            previousPeriodExpenses={previousPeriodExpenses}
            filterPeriod={filterPeriod}
          />
        </div>
      </div>

      <ExpenseList
        expenses={filteredExpenses}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  );
};

export default Dashboard;