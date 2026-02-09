import { useState, useMemo } from 'react';
import { useCollection } from '../hooks/useFirestore';
import { where } from 'firebase/firestore';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  BookOpen, 
  DollarSign,
  Plus,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Fetch current year's goals
  const { data: allGoals, loading: goalsLoading } = useCollection('goals', [
    where('year', '==', currentDate.getFullYear())
  ]);

  // Sort goals by createdAt in JavaScript
  const goals = useMemo(() => {
    return [...allGoals].sort((a, b) => {
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return bTime - aTime;
    });
  }, [allGoals]);

  // Fetch current month's transactions
  const { data: allTransactions, loading: transactionsLoading } = useCollection('transactions', []);

  // Sort transactions by date in JavaScript
  const transactions = useMemo(() => {
    return [...allTransactions].sort((a, b) => {
      const aDate = a.date?.toDate ? a.date.toDate() : new Date(a.date);
      const bDate = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      return bDate.getTime() - aDate.getTime();
    });
  }, [allTransactions]);

  // Fetch recent recaps
  const { data: allRecaps, loading: recapsLoading } = useCollection('recaps', []);

  // Sort recaps by date in JavaScript
  const recaps = useMemo(() => {
    return [...allRecaps].sort((a, b) => {
      const aDate = a.date?.toDate ? a.date.toDate() : new Date(a.date);
      const bDate = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      return bDate.getTime() - aDate.getTime();
    });
  }, [allRecaps]);

  // Calculate financial summary for current month
  const financialSummary = useMemo(() => {
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = t.date?.toDate ? t.date.toDate() : new Date(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    const income = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      income,
      expenses,
      balance: income - expenses,
      transactionCount: currentMonthTransactions.length
    };
  }, [transactions, monthStart, monthEnd]);

  // Calculate goals progress
  const goalsProgress = useMemo(() => {
    if (!goals.length) return 0;
    const completed = goals.filter(g => g.status === 'completed').length;
    return Math.round((completed / goals.length) * 100);
  }, [goals]);

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'primary' }) => (
    <div className="card p-6 hover:scale-105 transition-transform duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900/30`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
  );

  const QuickActionButton = ({ icon: Icon, label, onClick, color = 'primary' }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl border-2 border-dashed border-${color}-300 dark:border-${color}-700 hover:border-${color}-500 dark:hover:border-${color}-500 hover:bg-${color}-50 dark:hover:bg-${color}-900/20 transition-all duration-200 group w-full`}
    >
      <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 group-hover:scale-110 transition-transform`}>
        <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
      </div>
      <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </button>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {format(currentDate, 'MMMM yyyy')}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Balance"
          value={`$${financialSummary.balance.toLocaleString()}`}
          subtitle={`${financialSummary.transactionCount} transactions`}
          icon={DollarSign}
          color="primary"
        />
        <StatCard
          title="Income"
          value={`$${financialSummary.income.toLocaleString()}`}
          subtitle="This month"
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          title="Expenses"
          value={`$${financialSummary.expenses.toLocaleString()}`}
          subtitle="This month"
          icon={TrendingDown}
          color="red"
        />
        <StatCard
          title="Goals Progress"
          value={`${goalsProgress}%`}
          subtitle={`${goals.length} goals this year`}
          icon={Target}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionButton
            icon={Plus}
            label="Add Transaction"
            onClick={() => navigate('/finance')}
            color="primary"
          />
          <QuickActionButton
            icon={BookOpen}
            label="New Recap"
            onClick={() => navigate('/recaps')}
            color="purple"
          />
          <QuickActionButton
            icon={Target}
            label="Add Goal"
            onClick={() => navigate('/goals')}
            color="green"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Transactions</h2>
            <button
              onClick={() => navigate('/finance')}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {transactionsLoading ? (
              <div className="animate-shimmer h-16 rounded-lg"></div>
            ) : transactions.slice(0, 5).length > 0 ? (
              transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'income'
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.category}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    transaction.type === 'income'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No transactions yet
              </p>
            )}
          </div>
        </div>

        {/* Recent Recaps */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Recaps</h2>
            <button
              onClick={() => navigate('/recaps')}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recapsLoading ? (
              <div className="animate-shimmer h-16 rounded-lg"></div>
            ) : recaps.slice(0, 5).length > 0 ? (
              recaps.slice(0, 5).map((recap) => (
                <div
                  key={recap.id}
                  className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => navigate('/recaps')}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">
                      {recap.title}
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                      {recap.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {recap.content}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    {recap.date?.toDate ? format(recap.date.toDate(), 'MMM dd, yyyy') : 'No date'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No recaps yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
