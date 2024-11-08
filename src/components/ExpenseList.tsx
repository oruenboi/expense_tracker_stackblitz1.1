import React, { useState, useMemo } from 'react';
import { Expense } from '../types';
import ExpenseForm from './ExpenseForm';
import { Edit, Trash2, ChevronUp, ChevronDown, Search } from 'lucide-react';
import { getCategoryColor } from '../utils/categoryColors';

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (id: string, expense: Omit<Expense, 'id'>) => void;
  onDelete: (id: string) => void;
}

type SortField = 'date' | 'amount' | 'description' | 'category';
type SortDirection = 'asc' | 'desc';

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  const categories = useMemo(() => {
    const uniqueCategories = new Set(expenses.map(expense => expense.category));
    return ['all', ...Array.from(uniqueCategories)];
  }, [expenses]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedExpenses = useMemo(() => {
    return expenses
      .filter(expense => {
        const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            expense.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
        const matchesAmount = (!minAmount || expense.amount >= parseFloat(minAmount)) &&
                            (!maxAmount || expense.amount <= parseFloat(maxAmount));
        return matchesSearch && matchesCategory && matchesAmount;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'date':
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            break;
          case 'amount':
            comparison = a.amount - b.amount;
            break;
          case 'description':
            comparison = a.description.localeCompare(b.description);
            break;
          case 'category':
            comparison = a.category.localeCompare(b.category);
            break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [expenses, searchTerm, categoryFilter, minAmount, maxAmount, sortField, sortDirection]);

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
  };

  const handleUpdate = (updatedExpense: Omit<Expense, 'id'>) => {
    if (editingId) {
      onEdit(editingId, updatedExpense);
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  const cancelDelete = () => {
    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Expenses</h2>
      
      <div className="mb-6 space-y-4">
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Min Amount"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />

          <input
            type="number"
            placeholder="Max Amount"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Sort Headers */}
        <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-gray-50 dark:bg-gray-600 rounded-lg">
          <button
            onClick={() => handleSort('description')}
            className="flex items-center gap-1 text-left font-semibold text-gray-600 dark:text-gray-200"
          >
            Description <SortIcon field="description" />
          </button>
          <button
            onClick={() => handleSort('amount')}
            className="flex items-center gap-1 text-left font-semibold text-gray-600 dark:text-gray-200"
          >
            Amount <SortIcon field="amount" />
          </button>
          <button
            onClick={() => handleSort('date')}
            className="flex items-center gap-1 text-left font-semibold text-gray-600 dark:text-gray-200"
          >
            Date <SortIcon field="date" />
          </button>
          <button
            onClick={() => handleSort('category')}
            className="flex items-center gap-1 text-left font-semibold text-gray-600 dark:text-gray-200"
          >
            Category <SortIcon field="category" />
          </button>
        </div>
      </div>

      {filteredAndSortedExpenses.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No expenses found matching your filters.</p>
      ) : (
        <ul className="space-y-4">
          {filteredAndSortedExpenses.map((expense) => (
            <li key={expense.id} className="bg-gray-50 dark:bg-gray-600 p-4 rounded shadow">
              {editingId === expense.id ? (
                <ExpenseForm onSubmit={handleUpdate} initialExpense={expense} />
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">{expense.description}</h3>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">${expense.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">{formatDate(expense.date)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: getCategoryColor(expense.category) }}>{expense.category}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200"
                        aria-label="Edit expense"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-500 hover:text-red-600 transition-colors duration-200"
                        aria-label="Delete expense"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  {deletingId === expense.id && (
                    <div className="col-span-4 mt-2 bg-red-100 dark:bg-red-900 p-2 rounded">
                      <p className="text-red-800 dark:text-red-200 mb-2">Are you sure you want to delete this expense?</p>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={confirmDelete}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-200"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="bg-gray-300 text-gray-800 px-2 py-1 rounded hover:bg-gray-400 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList;