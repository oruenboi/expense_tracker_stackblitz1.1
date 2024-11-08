import React, { useState } from 'react';
import { Expense } from '../types';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  initialExpense?: Expense;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, initialExpense }) => {
  const [description, setDescription] = useState(initialExpense?.description || '');
  const [amount, setAmount] = useState(initialExpense?.amount.toString() || '');
  const [date, setDate] = useState(initialExpense?.date || '');
  const [category, setCategory] = useState(initialExpense?.category || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      description,
      amount: parseFloat(amount),
      date,
      category,
    });
    if (!initialExpense) {
      setDescription('');
      setAmount('');
      setDate('');
      setCategory('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block mb-1 text-gray-700 dark:text-gray-300">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="amount" className="block mb-1 text-gray-700 dark:text-gray-300">Amount</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          step="0.01"
          min="0"
          className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="date" className="block mb-1 text-gray-700 dark:text-gray-300">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="category" className="block mb-1 text-gray-700 dark:text-gray-300">Category</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
        >
          <option value="">Select a category</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        {initialExpense ? 'Update Expense' : 'Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;