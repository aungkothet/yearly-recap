import { useState, useMemo } from 'react';
import { useCollection, useFirestore } from '../hooks/useFirestore';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Filter
} from 'lucide-react';

const TRANSACTION_CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'],
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Other Expense']
};

const Finance = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(format(currentDate, 'yyyy-MM'));
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const { data: transactions, loading } = useCollection('transactions', []);

  const { addDocument, updateDocument, deleteDocument } = useFirestore('transactions');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
      };

      if (editingTransaction) {
        await updateDocument(editingTransaction.id, transactionData);
        setEditingTransaction(null);
      } else {
        await addDocument(transactionData);
        setIsAddingTransaction(false);
      }
      
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        date: format(new Date(), 'yyyy-MM-dd'),
      });
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      date: format(transaction.date?.toDate ? transaction.date.toDate() : new Date(transaction.date), 'yyyy-MM-dd'),
    });
    setIsAddingTransaction(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteDocument(id);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsAddingTransaction(false);
    setEditingTransaction(null);
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: 'Food',
      date: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  // Filter transactions by selected month
  const monthlyTransactions = useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    const monthStart = startOfMonth(new Date(parseInt(year), parseInt(month) - 1));
    const monthEnd = endOfMonth(new Date(parseInt(year), parseInt(month) - 1));

    return transactions
      .filter(t => {
        const transactionDate = t.date?.toDate ? t.date.toDate() : new Date(t.date);
        const isInMonth = transactionDate >= monthStart && transactionDate <= monthEnd;
        const matchesType = filterType === 'all' || t.type === filterType;
        return isInMonth && matchesType;
      })
      .sort((a, b) => {
        // Sort by date descending
        const aDate = a.date?.toDate ? a.date.toDate() : new Date(a.date);
        const bDate = b.date?.toDate ? b.date.toDate() : new Date(b.date);
        return bDate.getTime() - aDate.getTime();
      });
  }, [transactions, selectedMonth, filterType]);

  // Calculate monthly summary
  const monthlySummary = useMemo(() => {
    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }, [monthlyTransactions]);

  // Group transactions by category
  const transactionsByCategory = useMemo(() => {
    return monthlyTransactions.reduce((acc, transaction) => {
      const key = `${transaction.type}-${transaction.category}`;
      if (!acc[key]) {
        acc[key] = {
          category: transaction.category,
          type: transaction.type,
          total: 0,
          count: 0,
        };
      }
      acc[key].total += Number(transaction.amount);
      acc[key].count += 1;
      return acc;
    }, {});
  }, [monthlyTransactions]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Financial Tracker
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your income and expenses
          </p>
        </div>
        <button
          onClick={() => setIsAddingTransaction(true)}
          className="btn btn-primary h-11 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Month Selector & Filters */}
      <div className="card p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="input w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            {['all', 'income', 'expense'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                  filterType === type
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-green-900 dark:text-green-300">Income</h3>
          </div>
          <p className="text-3xl font-bold text-green-700 dark:text-green-400">
            ${monthlySummary.income.toLocaleString()}
          </p>
        </div>

        <div className="card p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-500/20">
              <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-sm font-medium text-red-900 dark:text-red-300">Expenses</h3>
          </div>
          <p className="text-3xl font-bold text-red-700 dark:text-red-400">
            ${monthlySummary.expenses.toLocaleString()}
          </p>
        </div>

        <div className={`card p-6 bg-gradient-to-br ${
          monthlySummary.balance >= 0
            ? 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800'
            : 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${monthlySummary.balance >= 0 ? 'bg-blue-500/20' : 'bg-orange-500/20'}`}>
              <DollarSign className={`w-6 h-6 ${
                monthlySummary.balance >= 0 
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-orange-600 dark:text-orange-400'
              }`} />
            </div>
            <h3 className={`text-sm font-medium ${
              monthlySummary.balance >= 0
                ? 'text-blue-900 dark:text-blue-300'
                : 'text-orange-900 dark:text-orange-300'
            }`}>Balance</h3>
          </div>
          <p className={`text-3xl font-bold ${
            monthlySummary.balance >= 0
              ? 'text-blue-700 dark:text-blue-400'
              : 'text-orange-700 dark:text-orange-400'
          }`}>
            ${Math.abs(monthlySummary.balance).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      {Object.keys(transactionsByCategory).length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Category Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.values(transactionsByCategory).map((item, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  item.type === 'income'
                    ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20'
                    : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {item.count} {item.count === 1 ? 'transaction' : 'transactions'}
                  </span>
                </div>
                <p className={`text-xl font-bold ${
                  item.type === 'income'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  ${item.total.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {(isAddingTransaction || editingTransaction) && (
        <div className="card p-6 animate-slide-down">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {editingTransaction ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label block mb-2">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., Grocery shopping"
                  required
                />
              </div>

              <div>
                <label className="label block mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="input w-full"
                  placeholder="0.00"
                  required
                  min="0"
                />
              </div>

              <div>
                <label className="label block mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input w-full"
                  required
                />
              </div>

              <div>
                <label className="label block mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    setFormData({ 
                      ...formData, 
                      type: newType,
                      category: TRANSACTION_CATEGORIES[newType][0]
                    });
                  }}
                  className="input w-full"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="label block mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input w-full"
                >
                  {TRANSACTION_CATEGORIES[formData.type].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary">
                <Check className="w-4 h-4 mr-2" />
                {editingTransaction ? 'Update' : 'Add'} Transaction
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-shimmer h-20 rounded-xl"></div>
          ))}
        </div>
      ) : monthlyTransactions.length === 0 ? (
        <div className="card p-12 text-center">
          <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No transactions yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start tracking your finances by adding your first transaction
          </p>
          <button
            onClick={() => setIsAddingTransaction(true)}
            className="btn btn-primary mx-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Transaction
          </button>
        </div>
      ) : (
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Transactions ({monthlyTransactions.length})
          </h2>
          <div className="space-y-2">
            {monthlyTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`p-3 rounded-lg ${
                    transaction.type === 'income'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {transaction.type === 'income' ? (
                      <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {transaction.description}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>
                        {transaction.date?.toDate 
                          ? format(transaction.date.toDate(), 'MMM dd, yyyy')
                          : 'No date'
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xl font-bold ${
                    transaction.type === 'income'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toLocaleString()}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(transaction)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
