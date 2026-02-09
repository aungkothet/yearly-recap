import { useState, useMemo } from 'react';
import { useCollection, useFirestore } from '../hooks/useFirestore';
import { format } from 'date-fns';
import { BookOpen, Plus, Trash2, Edit2, Check, X, Calendar } from 'lucide-react';

const RECAP_TYPES = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

const Recaps = () => {
  const [isAddingRecap, setIsAddingRecap] = useState(false);
  const [editingRecap, setEditingRecap] = useState(null);
  const [selectedType, setSelectedType] = useState('All');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'Daily',
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const { data: allRecaps, loading } = useCollection('recaps', []);

  // Sort recaps by date in JavaScript to avoid index requirement
  const recaps = useMemo(() => {
    return [...allRecaps].sort((a, b) => {
      const aDate = a.date?.toDate ? a.date.toDate() : new Date(a.date);
      const bDate = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      return bDate.getTime() - aDate.getTime(); // desc order
    });
  }, [allRecaps]);

  const { addDocument, updateDocument, deleteDocument } = useFirestore('recaps');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const recapData = {
        ...formData,
        date: new Date(formData.date),
      };

      if (editingRecap) {
        await updateDocument(editingRecap.id, recapData);
        setEditingRecap(null);
      } else {
        await addDocument(recapData);
        setIsAddingRecap(false);
      }
      
      setFormData({
        title: '',
        content: '',
        type: 'Daily',
        date: format(new Date(), 'yyyy-MM-dd'),
      });
    } catch (error) {
      console.error('Error saving recap:', error);
    }
  };

  const handleEdit = (recap) => {
    setEditingRecap(recap);
    setFormData({
      title: recap.title,
      content: recap.content,
      type: recap.type,
      date: format(recap.date?.toDate ? recap.date.toDate() : new Date(recap.date), 'yyyy-MM-dd'),
    });
    setIsAddingRecap(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recap?')) {
      try {
        await deleteDocument(id);
      } catch (error) {
        console.error('Error deleting recap:', error);
      }
    }
  };

  const handleCancel = () => {
    setIsAddingRecap(false);
    setEditingRecap(null);
    setFormData({
      title: '',
      content: '',
      type: 'Daily',
      date: format(new Date(), 'yyyy-MM-dd'),
    });
  };

  const getTypeColor = (type) => {
    const colors = {
      Daily: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      Weekly: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      Monthly: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      Yearly: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    };
    return colors[type] || colors.Daily;
  };

  const filteredRecaps = selectedType === 'All' 
    ? recaps 
    : recaps.filter(r => r.type === selectedType);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Life Recaps
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Journal your thoughts and reflections
          </p>
        </div>
        <button
          onClick={() => setIsAddingRecap(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          New Recap
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="card p-2">
        <div className="flex gap-2 overflow-x-auto">
          {['All', ...RECAP_TYPES].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                selectedType === type
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {type}
              {type !== 'All' && (
                <span className="ml-2 text-xs opacity-75">
                  ({recaps.filter(r => r.type === type).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAddingRecap || editingRecap) && (
        <div className="card p-6 animate-slide-down">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {editingRecap ? 'Edit Recap' : 'New Recap'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., A Productive Monday"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input w-full"
                  >
                    {RECAP_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input w-full"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="label">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="input w-full min-h-[200px] resize-y"
                placeholder="Write your thoughts and reflections..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn btn-success">
                <Check className="w-4 h-4" />
                {editingRecap ? 'Update' : 'Save'} Recap
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recaps List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-shimmer h-32 rounded-xl"></div>
          ))}
        </div>
      ) : filteredRecaps.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No recaps yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {selectedType === 'All' 
              ? 'Start journaling your thoughts and reflections'
              : `No ${selectedType.toLowerCase()} recaps found`
            }
          </p>
          <button
            onClick={() => setIsAddingRecap(true)}
            className="btn btn-primary mx-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Your First Recap
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecaps.map((recap) => (
            <div
              key={recap.id}
              className="card p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <span className={`badge ${getTypeColor(recap.type)}`}>
                    {recap.type.toUpperCase()}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {recap.date?.toDate 
                        ? format(recap.date.toDate(), 'MMM dd, yyyy')
                        : 'No date'
                      }
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(recap)}
                    className="icon-btn"
                    title="Edit recap"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(recap.id)}
                    className="icon-btn-danger"
                    title="Delete recap"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {recap.title}
              </h3>
              
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                {recap.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recaps;
