import React from 'react';
import { X } from 'lucide-react';
import ExpenseForm from './ExpenseForm';
import { Expense } from '../types';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  initialExpense?: Expense;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSubmit, initialExpense }) => {
  if (!isOpen) return null;

  const handleSubmit = (expense: Omit<Expense, 'id'>) => {
    onSubmit(expense);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {initialExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
          <ExpenseForm onSubmit={handleSubmit} initialExpense={initialExpense} />
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;