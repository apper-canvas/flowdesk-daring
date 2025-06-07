import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { contactService, dealService, activityService } from '../services'

const StatCard = ({ title, value, icon, color, change, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card border border-surface-200 dark:border-surface-700"
  >
    {loading ? (
      <div className="animate-pulse">
        <div className="h-4 bg-surface-200 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-surface-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-surface-200 rounded w-1/3"></div>
      </div>
    ) : (
      <>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            <ApperIcon name={icon} className="w-6 h-6 text-white" />
          </div>
          {change && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {change}
            </span>
          )}
        </div>
        <h3 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">{value}</h3>
        <p className="text-surface-500 text-sm">{title}</p>
      </>
    )}
  </motion.div>
)

const RecentItem = ({ item, type, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center space-x-3 p-3 animate-pulse">
        <div className="w-10 h-10 bg-surface-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-surface-200 rounded w-3/4 mb-1"></div>
          <div className="h-3 bg-surface-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  const getIcon = () => {
    switch (type) {
      case 'contact': return 'User'
      case 'deal': return 'DollarSign'
      case 'activity': return 'Calendar'
      default: return 'Circle'
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'contact': return item.name
      case 'deal': return item.title
      case 'activity': return item.description
      default: return 'Unknown'
    }
  }

  const getSubtitle = () => {
    switch (type) {
      case 'contact': return item.company || item.email
      case 'deal': return `$${item.value?.toLocaleString()} • ${item.stage}`
      case 'activity': return item.type
      default: return ''
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      className="flex items-center space-x-3 p-3 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors cursor-pointer"
    >
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
        <ApperIcon name={getIcon()} className="w-5 h-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-surface-900 dark:text-white truncate">{getTitle()}</p>
        <p className="text-sm text-surface-500 truncate">{getSubtitle()}</p>
      </div>
    </motion.div>
  )
}

const Home = () => {
  const [stats, setStats] = useState({
    contacts: 0,
    deals: 0,
    activities: 0,
    revenue: 0
  })
  const [recentItems, setRecentItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [contacts, deals, activities] = await Promise.all([
          contactService.getAll(),
          dealService.getAll(),
          activityService.getAll()
        ])

        // Calculate stats
        const revenue = deals
          .filter(deal => deal.status === 'Won')
          .reduce((sum, deal) => sum + deal.value, 0)

        setStats({
          contacts: contacts.length,
          deals: deals.filter(deal => deal.status === 'Open').length,
          activities: activities.filter(activity => !activity.completed).length,
          revenue
        })

        // Get recent items (latest 6)
        const recent = [
          ...contacts.slice(0, 2).map(item => ({ ...item, type: 'contact' })),
          ...deals.slice(0, 2).map(item => ({ ...item, type: 'deal' })),
          ...activities.slice(0, 2).map(item => ({ ...item, type: 'activity' }))
        ].sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp))
          .slice(0, 6)

        setRecentItems(recent)
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data')
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">Dashboard Error</h3>
          <p className="text-surface-500 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Retry
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
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
            <p className="text-surface-500 mt-1">Welcome back! Here's what's happening with your business.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toast.info('Quick actions coming soon!')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Quick Add</span>
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Contacts"
            value={loading ? '...' : stats.contacts}
            icon="Users"
            color="bg-blue-500"
            change="+12%"
            loading={loading}
          />
          <StatCard
            title="Active Deals"
            value={loading ? '...' : stats.deals}
            icon="TrendingUp"
            color="bg-green-500"
            change="+8%"
            loading={loading}
          />
          <StatCard
            title="Pending Activities"
            value={loading ? '...' : stats.activities}
            icon="Calendar"
            color="bg-orange-500"
            change="-3%"
            loading={loading}
          />
          <StatCard
            title="Revenue (Won)"
            value={loading ? '...' : `$${stats.revenue.toLocaleString()}`}
            icon="DollarSign"
            color="bg-purple-500"
            change="+15%"
            loading={loading}
          />
        </div>

        {/* Main Feature and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feature */}
          <div className="lg:col-span-2">
            <MainFeature />
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700"
          >
            <div className="p-6 border-b border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Activity</h3>
              <p className="text-surface-500 text-sm mt-1">Latest updates across your CRM</p>
            </div>
            <div className="divide-y divide-surface-200 dark:divide-surface-700">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <RecentItem key={i} loading={true} />
                ))
              ) : recentItems.length > 0 ? (
                recentItems.map((item, index) => (
                  <RecentItem
                    key={`${item.type}-${item.id}`}
                    item={item}
                    type={item.type}
                  />
                ))
              ) : (
                <div className="p-6 text-center">
                  <ApperIcon name="Inbox" className="w-12 h-12 text-surface-300 mx-auto mb-3" />
                  <p className="text-surface-500">No recent activity</p>
                  <p className="text-surface-400 text-sm">Start by adding contacts or deals</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Home