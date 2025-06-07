import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isYesterday, startOfDay } from 'date-fns'
import ApperIcon from '../components/ApperIcon'
import { activityService, contactService, dealService } from '../services'

const ACTIVITY_TYPES = ['Call', 'Email', 'Meeting', 'Note', 'Task', 'Follow-up']
const TYPE_ICONS = {
  'Call': 'Phone',
  'Email': 'Mail',
  'Meeting': 'Calendar',
  'Note': 'FileText',
  'Task': 'CheckSquare',
  'Follow-up': 'Clock'
}

const TYPE_COLORS = {
  'Call': 'bg-blue-500',
  'Email': 'bg-green-500',
  'Meeting': 'bg-purple-500',
  'Note': 'bg-yellow-500',
  'Task': 'bg-orange-500',
  'Follow-up': 'bg-red-500'
}

const ActivityItem = ({ activity, contact, deal, onEdit, onDelete, onToggleComplete }) => {
  const formatDate = (date) => {
    const activityDate = new Date(date)
    if (isToday(activityDate)) return 'Today'
    if (isYesterday(activityDate)) return 'Yesterday'
    return format(activityDate, 'MMM d, yyyy')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 4 }}
      className={`bg-white dark:bg-surface-800 rounded-lg p-4 shadow-card border border-surface-200 dark:border-surface-700 group ${
        activity.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${TYPE_COLORS[activity.type]} flex-shrink-0`}>
          <ApperIcon name={TYPE_ICONS[activity.type]} className="w-5 h-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={`font-medium ${activity.completed ? 'line-through text-surface-500' : 'text-surface-900 dark:text-white'}`}>
                {activity.description}
              </p>
              <div className="flex items-center space-x-4 mt-1 text-sm text-surface-500">
                <span className="flex items-center space-x-1">
                  <ApperIcon name="Clock" className="w-3 h-3" />
                  <span>{formatDate(activity.timestamp)}</span>
                </span>
                {contact && (
                  <span className="flex items-center space-x-1">
                    <ApperIcon name="User" className="w-3 h-3" />
                    <span>{contact.name}</span>
                  </span>
                )}
                {deal && (
                  <span className="flex items-center space-x-1">
                    <ApperIcon name="TrendingUp" className="w-3 h-3" />
                    <span>{deal.title}</span>
                  </span>
                )}
              </div>
            </div>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleComplete(activity.id, !activity.completed)}
                className={`p-1 rounded ${
                  activity.completed 
                    ? 'text-green-500 hover:text-green-700' 
                    : 'text-surface-400 hover:text-green-500'
                }`}
              >
                <ApperIcon name={activity.completed ? 'CheckCircle' : 'Circle'} className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onEdit(activity)}
                className="p-1 text-surface-400 hover:text-primary rounded"
              >
                <ApperIcon name="Edit2" className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(activity.id)}
                className="p-1 text-surface-400 hover:text-red-500 rounded"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const ActivityForm = ({ activity, contacts, deals, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    type: activity?.type || 'Call',
    description: activity?.description || '',
    contactId: activity?.contactId || '',
    dealId: activity?.dealId || '',
    timestamp: activity?.timestamp ? new Date(activity.timestamp).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    completed: activity?.completed || false
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.description.trim()) {
      toast.error('Description is required')
      return
    }

    setSaving(true)
    try {
      const activityData = {
        ...formData,
        timestamp: new Date(formData.timestamp),
        contactId: formData.contactId || null,
        dealId: formData.dealId || null
      }

      if (activity) {
        await activityService.update(activity.id, activityData)
        toast.success('Activity updated successfully')
      } else {
        await activityService.create(activityData)
        toast.success('Activity created successfully')
      }
      onSave()
    } catch (error) {
      toast.error('Failed to save activity')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
            {activity ? 'Edit Activity' : 'New Activity'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 text-surface-400 hover:text-surface-600 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              {ACTIVITY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
              placeholder="Describe the activity..."
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Contact
            </label>
            <select
              value={formData.contactId}
              onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              <option value="">Select a contact (optional)</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>{contact.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Deal
            </label>
            <select
              value={formData.dealId}
              onChange={(e) => setFormData({ ...formData, dealId: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              <option value="">Select a deal (optional)</option>
              {deals.map(deal => (
                <option key={deal.id} value={deal.id}>{deal.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.timestamp}
              onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="completed"
              checked={formData.completed}
              onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
              className="w-4 h-4 text-primary bg-surface-100 border-surface-300 rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="completed" className="ml-2 text-sm text-surface-700 dark:text-surface-300">
              Mark as completed
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <motion.button
              type="submit"
              disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="w-4 h-4" />
                  <span>Save Activity</span>
                </>
              )}
            </motion.button>
            <motion.button
              type="button"
              onClick={onCancel}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

const Activities = () => {
  const [activities, setActivities] = useState([])
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)
  const [filter, setFilter] = useState('all') // 'all', 'pending', 'completed'
  const [typeFilter, setTypeFilter] = useState('all')

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ])
      setActivities(activitiesData)
      setContacts(contactsData)
      setDeals(dealsData)
    } catch (err) {
      setError(err.message || 'Failed to load activities')
      toast.error('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (activityId) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return

    try {
      await activityService.delete(activityId)
      toast.success('Activity deleted successfully')
      loadData()
    } catch (error) {
      toast.error('Failed to delete activity')
    }
  }

  const handleEdit = (activity) => {
    setEditingActivity(activity)
    setShowForm(true)
  }

  const handleToggleComplete = async (activityId, completed) => {
    try {
      await activityService.update(activityId, { completed })
      toast.success(completed ? 'Activity marked as completed' : 'Activity marked as pending')
      loadData()
    } catch (error) {
      toast.error('Failed to update activity')
    }
  }

  const handleFormSave = () => {
    setShowForm(false)
    setEditingActivity(null)
    loadData()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingActivity(null)
  }

  const getContactById = (contactId) => {
    return contacts.find(contact => contact.id === contactId)
  }

  const getDealById = (dealId) => {
    return deals.find(deal => deal.id === dealId)
  }

  const filteredActivities = activities
    .filter(activity => {
      if (filter === 'pending') return !activity.completed
      if (filter === 'completed') return activity.completed
      return true
    })
    .filter(activity => {
      if (typeFilter === 'all') return true
      return activity.type === typeFilter
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  // Group activities by date
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    const date = startOfDay(new Date(activity.timestamp)).toISOString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(activity)
    return groups
  }, {})

  if (loading) {
    return (
      <div className="h-full overflow-auto p-6">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-surface-200 rounded w-1/3"></div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-card animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-surface-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">Failed to Load Activities</h3>
          <p className="text-surface-500 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Activities</h1>
            <p className="text-surface-500 mt-1">Track all your customer interactions</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Activity</span>
          </motion.button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filter === 'all' 
                  ? 'bg-white dark:bg-surface-800 text-surface-900 dark:text-white shadow-sm' 
                  : 'text-surface-600 dark:text-surface-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filter === 'pending' 
                  ? 'bg-white dark:bg-surface-800 text-surface-900 dark:text-white shadow-sm' 
                  : 'text-surface-600 dark:text-surface-300'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filter === 'completed' 
                  ? 'bg-white dark:bg-surface-800 text-surface-900 dark:text-white shadow-sm' 
                  : 'text-surface-600 dark:text-surface-300'
              }`}
            >
              Completed
            </button>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
          >
            <option value="all">All Types</option>
            {ACTIVITY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </motion.div>

        {/* Activities Timeline */}
        {Object.keys(groupedActivities).length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="Calendar" className="w-16 h-16 text-surface-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium text-surface-900 dark:text-white">No activities found</h3>
            <p className="mt-2 text-surface-500">
              {filter !== 'all' || typeFilter !== 'all' 
                ? 'Try adjusting your filters or add a new activity' 
                : 'Start tracking your customer interactions'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Add First Activity
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedActivities)
              .sort(([a], [b]) => new Date(b) - new Date(a))
              .map(([date, dayActivities]) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                      {isToday(new Date(date)) ? 'Today' :
                       isYesterday(new Date(date)) ? 'Yesterday' :
                       format(new Date(date), 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <div className="flex-1 h-px bg-surface-200 dark:bg-surface-700"></div>
                    <span className="text-sm text-surface-500">{dayActivities.length} activities</span>
                  </div>
                  
                  <div className="space-y-3">
                    {dayActivities.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ActivityItem
                          activity={activity}
                          contact={getContactById(activity.contactId)}
                          deal={getDealById(activity.dealId)}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onToggleComplete={handleToggleComplete}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>

      {/* Activity Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ActivityForm
            activity={editingActivity}
            contacts={contacts}
            deals={deals}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Activities