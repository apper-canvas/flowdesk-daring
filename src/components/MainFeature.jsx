import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { contactService, dealService, activityService } from '../services'

const QuickActionCard = ({ title, description, icon, color, onClick, loading }) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card border border-surface-200 dark:border-surface-700 cursor-pointer group"
  >
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform`}>
      <ApperIcon name={icon} className="w-6 h-6 text-white" />
    </div>
    <h3 className="font-semibold text-surface-900 dark:text-white mb-2">{title}</h3>
    <p className="text-surface-500 text-sm">{description}</p>
    {loading && (
      <div className="mt-3 w-full h-1 bg-surface-200 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        />
      </div>
    )}
  </motion.div>
)

const QuickContactForm = ({ onSubmit, onCancel, submitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required')
      return
    }
    onSubmit(formData)
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="relative">
        <input
          type="text"
          placeholder="Contact Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all"
          required
        />
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-primary"
          initial={{ width: 0 }}
          animate={{ width: formData.name ? '100%' : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="relative">
        <input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all"
          required
        />
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-primary"
          initial={{ width: 0 }}
          animate={{ width: formData.email ? '100%' : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Company (Optional)"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all"
        />
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-primary"
          initial={{ width: 0 }}
          animate={{ width: formData.company ? '100%' : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex space-x-3 pt-2">
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Adding...</span>
            </>
          ) : (
            <>
              <ApperIcon name="UserPlus" className="w-4 h-4" />
              <span>Add Contact</span>
            </>
          )}
        </motion.button>
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
        >
          Cancel
        </motion.button>
      </div>
    </motion.form>
  )
}

const QuickDealForm = ({ contacts, onSubmit, onCancel, submitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    contactId: '',
    value: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.contactId) {
      toast.error('Deal title and contact are required')
      return
    }
    onSubmit({
      ...formData,
      value: parseFloat(formData.value) || 0
    })
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="relative">
        <input
          type="text"
          placeholder="Deal Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all"
          required
        />
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-primary"
          initial={{ width: 0 }}
          animate={{ width: formData.title ? '100%' : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="relative">
        <select
          value={formData.contactId}
          onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
          className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white appearance-none"
          required
        >
          <option value="">Select Contact</option>
          {contacts.map(contact => (
            <option key={contact.id} value={contact.id}>{contact.name}</option>
          ))}
        </select>
        <ApperIcon name="ChevronDown" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400 pointer-events-none" />
      </div>

      <div className="relative">
        <input
          type="number"
          placeholder="Deal Value ($)"
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all"
          min="0"
          step="0.01"
        />
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-primary"
          initial={{ width: 0 }}
          animate={{ width: formData.value ? '100%' : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex space-x-3 pt-2">
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating...</span>
            </>
          ) : (
            <>
              <ApperIcon name="TrendingUp" className="w-4 h-4" />
              <span>Create Deal</span>
            </>
          )}
        </motion.button>
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
        >
          Cancel
        </motion.button>
      </div>
    </motion.form>
  )
}

const QuickActivityForm = ({ contacts, deals, onSubmit, onCancel, submitting }) => {
  const [formData, setFormData] = useState({
    type: 'Call',
    description: '',
    contactId: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.description.trim()) {
      toast.error('Activity description is required')
      return
    }
    onSubmit({
      ...formData,
      contactId: formData.contactId || null
    })
  }

  const activityTypes = ['Call', 'Email', 'Meeting', 'Note', 'Task']

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid grid-cols-5 gap-2">
        {activityTypes.map(type => (
          <motion.button
            key={type}
            type="button"
            onClick={() => setFormData({ ...formData, type })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
              formData.type === type
                ? 'bg-primary text-white'
                : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
          >
            {type}
          </motion.button>
        ))}
      </div>

      <div className="relative">
        <textarea
          placeholder="What did you do?"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all resize-none"
          rows="3"
          required
        />
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-primary"
          initial={{ width: 0 }}
          animate={{ width: formData.description ? '100%' : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="relative">
        <select
          value={formData.contactId}
          onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
          className="w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white appearance-none"
        >
          <option value="">Select Contact (Optional)</option>
          {contacts.map(contact => (
            <option key={contact.id} value={contact.id}>{contact.name}</option>
          ))}
        </select>
        <ApperIcon name="ChevronDown" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400 pointer-events-none" />
      </div>

      <div className="flex space-x-3 pt-2">
        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Logging...</span>
            </>
          ) : (
            <>
              <ApperIcon name="Calendar" className="w-4 h-4" />
              <span>Log Activity</span>
            </>
          )}
        </motion.button>
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
        >
          Cancel
        </motion.button>
      </div>
    </motion.form>
  )
}

const MainFeature = () => {
  const [activeForm, setActiveForm] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState({
    contact: false,
    deal: false,
    activity: false
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contactsData, dealsData] = await Promise.all([
          contactService.getAll(),
          dealService.getAll()
        ])
        setContacts(contactsData)
        setDeals(dealsData)
      } catch (error) {
        console.error('Failed to load data:', error)
      }
    }
    loadData()
  }, [])

  const handleQuickContact = async (formData) => {
    setSubmitting(true)
    try {
      await contactService.create(formData)
      toast.success('Contact added successfully!')
      setActiveForm(null)
      // Reload contacts
      const updatedContacts = await contactService.getAll()
      setContacts(updatedContacts)
    } catch (error) {
      toast.error('Failed to add contact')
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuickDeal = async (formData) => {
    setSubmitting(true)
    try {
      await dealService.create({ ...formData, stage: 'Lead', status: 'Open', probability: 25 })
      toast.success('Deal created successfully!')
      setActiveForm(null)
      // Reload deals
      const updatedDeals = await dealService.getAll()
      setDeals(updatedDeals)
    } catch (error) {
      toast.error('Failed to create deal')
    } finally {
      setSubmitting(false)
    }
  }

  const handleQuickActivity = async (formData) => {
    setSubmitting(true)
    try {
      await activityService.create({
        ...formData,
        timestamp: new Date(),
        completed: false
      })
      toast.success('Activity logged successfully!')
      setActiveForm(null)
    } catch (error) {
      toast.error('Failed to log activity')
    } finally {
      setSubmitting(false)
    }
  }

  const handleActionClick = (action) => {
    setLoading({ ...loading, [action]: true })
    setTimeout(() => {
      setLoading({ ...loading, [action]: false })
      setActiveForm(action)
    }, 800)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden"
    >
      <div className="p-6 border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-surface-900 dark:text-white">Quick Actions</h3>
        </div>
        <p className="text-surface-500">Fast-track your CRM workflow with instant actions</p>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {!activeForm ? (
            <motion.div
              key="actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <QuickActionCard
                title="Add Contact"
                description="Quickly add a new contact to your CRM"
                icon="UserPlus"
                color="bg-blue-500"
                onClick={() => handleActionClick('contact')}
                loading={loading.contact}
              />
              <QuickActionCard
                title="Create Deal"
                description="Start tracking a new sales opportunity"
                icon="TrendingUp"
                color="bg-green-500"
                onClick={() => handleActionClick('deal')}
                loading={loading.deal}
              />
              <QuickActionCard
                title="Log Activity"
                description="Record your latest customer interaction"
                icon="Calendar"
                color="bg-purple-500"
                onClick={() => handleActionClick('activity')}
                loading={loading.activity}
              />
            </motion.div>
          ) : (
            <motion.div key="form" className="max-w-md mx-auto">
              {activeForm === 'contact' && (
                <QuickContactForm
                  onSubmit={handleQuickContact}
                  onCancel={() => setActiveForm(null)}
                  submitting={submitting}
                />
              )}
              {activeForm === 'deal' && (
                <QuickDealForm
                  contacts={contacts}
                  onSubmit={handleQuickDeal}
                  onCancel={() => setActiveForm(null)}
                  submitting={submitting}
                />
              )}
              {activeForm === 'activity' && (
                <QuickActivityForm
                  contacts={contacts}
                  deals={deals}
                  onSubmit={handleQuickActivity}
                  onCancel={() => setActiveForm(null)}
                  submitting={submitting}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default MainFeature