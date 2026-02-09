import { useState } from 'react';
import { useCollection, useFirestore } from '../hooks/useFirestore';
import { orderBy, where } from 'firebase/firestore';
import { Target, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

const CATEGORIES = ['Health', 'Career', 'Personal', 'Financial', 'Education', 'Relationships'];
const STATUSES = ['not-started', 'in-progress', 'completed'];

const Goals = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Personal',
    status: 'not-started',
    year: currentYear,
  });

  const { data: goals, loading } = useCollection('goals', [
    where('year', '==', selectedYear),
    orderBy('createdAt', 'desc')
  ]);

  const { addDocument, updateDocument, deleteDocument } = useFirestore('goals');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingGoal) {
        await updateDocument(editingGoal.id, formData);
        setEditingGoal(null);
      } else {
        await addDocument(formData);
        setIsAddingGoal(false);
      }
      
      setFormData({
        title: '',
        category: 'Personal',
        status: 'not-started',
        year: currentYear,
      });
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      category: goal.category,
      status: goal.status,
      year: goal.year,
    });
    setIsAddingGoal(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteDocument(id);
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsAddingGoal(false);
    setEditingGoal(null);
    setFormData({
      title: '',
      category: 'Personal',
      status: 'not-started',
      year: currentYear,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400';
      case 'in-progress':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Health: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      Career: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      Personal: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      Financial: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      Education: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      Relationships: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    };
    return colors[category] || colors.Personal;
  };

  const goalsByCategory = goals.reduce((acc, goal) => {
    if (!acc[goal.category]) {
      acc[goal.category] = [];
    }
    acc[goal.category].push(goal);
    return acc;
  }, {});

  const completedCount = goals.filter(g => g.status === 'completed').length;
  const progressPercentage = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Yearly Goals
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and achieve your goals for {selectedYear}
          </p>
        </div>
        <button
          onClick={() => setIsAddingGoal(true)}
          className="btn btn-primary h-11 px-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Goal
        </button>
      </div>

      {/* Year Selector & Progress */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <label className="label text-gray-700 dark:text-gray-300">Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="input w-32"
            >
              {[...Array(5)].map((_, i) => {
                const year = currentYear - 2 + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {completedCount} of {goals.length} completed
            </p>
            <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAddingGoal || editingGoal) && (
        <div className="card p-6 animate-slide-down">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {editingGoal ? 'Edit Goal' : 'Add New Goal'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label block mb-2">Goal Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input w-full"
                placeholder="e.g., Run a marathon"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label block mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input w-full"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label block mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input w-full"
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="label block mb-2">Year</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="input w-full"
                  min={2020}
                  max={2030}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary">
                <Check className="w-4 h-4 mr-2" />
                {editingGoal ? 'Update' : 'Add'} Goal
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-shimmer h-24 rounded-xl"></div>
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="card p-12 text-center">
          <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No goals yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start by adding your first goal for {selectedYear}
          </p>
          <button
            onClick={() => setIsAddingGoal(true)}
            className="btn btn-primary mx-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Your First Goal
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(goalsByCategory).map(([category, categoryGoals]) => (
            <div key={category}>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className={`px-3 py-1 rounded-lg text-sm ${getCategoryColor(category)}`}>
                  {category}
                </span>
                <span className="text-sm font-normal text-gray-500">
                  ({categoryGoals.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="card p-5 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(goal.status)}`}>
                        {goal.status.replace('-', ' ')}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(goal)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {goal.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Target className="w-4 h-4" />
                      <span>{goal.year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals;
