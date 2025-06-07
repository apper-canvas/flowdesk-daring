import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import { dealService, contactService } from '../services'

const DEAL_STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost']
const STAGE_COLORS = {
  'Lead': 'bg-gray-500',
  'Qualified': 'bg-blue-500',
  'Proposal': 'bg-yellow-500',
  'Negotiation': 'bg-orange-500',
  'Won': 'bg-green-500',
  'Lost': 'bg-red-500'
}

const DealCard = ({ deal, contact, onEdit, onDelete, onStageChange }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    whileHover={{ y: -2 }}
    className="bg-white dark:bg-surface-800 rounded-lg p-4 shadow-card border border-surface-200 dark:border-surface-700 group cursor-pointer"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h4 className="font-semibold text-surface-900 dark:text-white mb-1">{deal.title}</h4>
        <p className="text-surface-500 text-sm">{contact?.name || 'Unknown Contact'}</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation()
            onEdit(deal)
          }}
          className="p-1 text-surface-400 hover:text-primary rounded"
        >
          <ApperIcon name="Edit2" className="w-3 h-3" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation()
            onDelete(deal.id)
          }}
          className="p-1 text-surface-400 hover:text-red-500 rounded"
        >
          <ApperIcon name="Trash2" className="w-3 h-3" />
        </motion.button>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-surface-900 dark:text-white">
          ${deal.value?.toLocaleString() || '0'}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs text-white ${STAGE_COLORS[deal.stage] || 'bg-gray-500'}`}>
          {deal.stage}
        </span>
      </div>
      
      {deal.probability && (
        <div className="w-full bg-surface-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${deal.probability}%` }}
          ></div>
        </div>
      )}
      
      {deal.expectedCloseDate && (
        <div className="flex items-center space-x-1 text-xs text-surface-500">
          <ApperIcon name="Calendar" className="w-3 h-3" />
          <span>{new Date(deal.expectedCloseDate).toLocaleDateString()}</span>
        </div>
      )}
    </div>

    {/* Quick stage change buttons */}
    <div className="mt-3 flex justify-between">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation()
          const currentIndex = DEAL_STAGES.indexOf(deal.stage)
          if (currentIndex > 0) {
            onStageChange(deal.id, DEAL_STAGES[currentIndex - 1])
          }
        }}
        disabled={DEAL_STAGES.indexOf(deal.stage) === 0}
        className="text-xs px-2 py-1 rounded bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        ← Previous
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation()
          const currentIndex = DEAL_STAGES.indexOf(deal.stage)
          if (currentIndex < DEAL_STAGES.length - 1) {
            onStageChange(deal.id, DEAL_STAGES[currentIndex + 1])
          }
        }}
        disabled={DEAL_STAGES.indexOf(deal.stage) === DEAL_STAGES.length - 1}
        className="text-xs px-2 py-1 rounded bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next →
      </motion.button>
    </div>
  </motion.div>
)

const DealForm = ({ deal, contacts, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: deal?.title || '',
    value: deal?.value || '',
    stage: deal?.stage || 'Lead',
    contactId: deal?.contactId || '',
    probability: deal?.probability || 50,
    expectedCloseDate: deal?.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split('T')[0] : '',
    status: deal?.status || 'Open'
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.contactId) {
      toast.error('Title and contact are required')
      return
    }

    setSaving(true)
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value) || 0,
        probability: parseInt(formData.probability),
        expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate) : null
      }

      if (deal) {
        await dealService.update(deal.id, dealData)
        toast.success('Deal updated successfully')
      } else {
        await dealService.create(dealData)
        toast.success('Deal created successfully')
      }
      onSave()
    } catch (error) {
      toast.error('Failed to save deal')
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
        className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-surface-900 dark:text-white">
            {deal ? 'Edit Deal' : 'New Deal'}
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
              Deal Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
              placeholder="Enter deal title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Contact *
            </label>
            <select
              value={formData.contactId}
              onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
              required
            >
              <option value="">Select a contact</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>{contact.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Value ($)
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Probability (%)
              </label>
              <input
                type="number"
                value={formData.probability}
                onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
                min="0"
                max="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Stage
            </label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              {DEAL_STAGES.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Expected Close Date
            </label>
            <input
              type="date"
              value={formData.expectedCloseDate}
              onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white"
            >
              <option value="Open">Open</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
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
                  <span>Save Deal</span>
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

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingDeal, setEditingDeal] = useState(null)
  const [viewMode, setViewMode] = useState('pipeline') // 'pipeline' or 'list'

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ])
      setDeals(dealsData)
      setContacts(contactsData)
    } catch (err) {
      setError(err.message || 'Failed to load deals')
      toast.error('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (dealId) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return

    try {
      await dealService.delete(dealId)
      toast.success('Deal deleted successfully')
      loadData()
    } catch (error) {
      toast.error('Failed to delete deal')
    }
  }

  const handleEdit = (deal) => {
    setEditingDeal(deal)
    setShowForm(true)
  }

  const handleStageChange = async (dealId, newStage) => {
    try {
      await dealService.update(dealId, { stage: newStage })
      toast.success(`Deal moved to ${newStage}`)
      loadData()
    } catch (error) {
      toast.error('Failed to update deal stage')
    }
  }

  const handleFormSave = () => {
    setShowForm(false)
    setEditingDeal(null)
    loadData()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingDeal(null)
  }

  const getContactById = (contactId) => {
    return contacts.find(contact => contact.id === contactId)
  }

  const dealsByStage = DEAL_STAGES.reduce((acc, stage) => {
    acc[stage] = deals.filter(deal => deal.stage === stage && deal.status === 'Open')
    return acc
  }, {})

  if (loading) {
    return (
      <div className="h-full overflow-auto p-6">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-surface-200 rounded w-1/3"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {DEAL_STAGES.map(stage => (
              <div key={stage} className="space-y-3">
                <div className="h-6 bg-surface-200 rounded"></div>
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 shadow-card animate-pulse">
                    <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-surface-200 rounded w-1/2 mb-3"></div>
                    <div className="h-6 bg-surface-200 rounded w-full"></div>
                  </div>
                ))}
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
          <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">Failed to Load Deals</h3>
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
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Deals Pipeline</h1>
            <p className="text-surface-500 mt-1">Track your sales opportunities</p>
          </div>
          <div className="flex space-x-3">
            <div className="flex bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('pipeline')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'pipeline' 
                    ? 'bg-white dark:bg-surface-800 text-surface-900 dark:text-white shadow-sm' 
                    : 'text-surface-600 dark:text-surface-300'
                }`}
              >
                Pipeline
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-surface-800 text-surface-900 dark:text-white shadow-sm' 
                    : 'text-surface-600 dark:text-surface-300'
                }`}
              >
                List
              </button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>Add Deal</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Pipeline View */}
        {viewMode === 'pipeline' ? (
          deals.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="TrendingUp" className="w-16 h-16 text-surface-300 mx-auto" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-surface-900 dark:text-white">No deals yet</h3>
              <p className="mt-2 text-surface-500">Start tracking your sales opportunities</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowForm(true)}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Create First Deal
              </motion.button>
            </motion.div>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-6 gap-4 min-w-max">
                {DEAL_STAGES.map((stage, stageIndex) => (
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: stageIndex * 0.1 }}
                    className="min-w-[280px]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-surface-900 dark:text-white">{stage}</h3>
                      <span className={`w-3 h-3 rounded-full ${STAGE_COLORS[stage]}`}></span>
                    </div>
                    <div className="space-y-3">
                      <AnimatePresence>
                        {dealsByStage[stage]?.map((deal, dealIndex) => (
                          <motion.div
                            key={deal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: dealIndex * 0.05 }}
                          >
                            <DealCard
                              deal={deal}
                              contact={getContactById(deal.contactId)}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              onStageChange={handleStageChange}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      {(!dealsByStage[stage] || dealsByStage[stage].length === 0) && (
                        <div className="text-center py-8 text-surface-400 border-2 border-dashed border-surface-200 dark:border-surface-600 rounded-lg">
                          <ApperIcon name="Plus" className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">No deals in {stage}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )
        ) : (
          /* List View */
          <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-50 dark:bg-surface-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Deal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Stage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Probability</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                  {deals.map((deal, index) => (
                    <motion.tr
                      key={deal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-surface-50 dark:hover:bg-surface-700"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-surface-900 dark:text-white">{deal.title}</div>
                          <div className="text-sm text-surface-500">{deal.status}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-white">
                        {getContactById(deal.contactId)?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-900 dark:text-white">
                        ${deal.value?.toLocaleString() || '0'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${STAGE_COLORS[deal.stage]}`}>
                          {deal.stage}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-white">
                        {deal.probability}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(deal)}
                          className="text-primary hover:text-primary-dark"
                        >
                          <ApperIcon name="Edit2" className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(deal.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Deal Form Modal */}
      <AnimatePresence>
        {showForm && (
          <DealForm
            deal={editingDeal}
            contacts={contacts}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Deals