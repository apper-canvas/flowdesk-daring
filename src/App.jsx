import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ToastContainer } from 'react-toastify'
import HomePage from '@/components/pages/HomePage';
import { routes, routeArray } from './config/routes'
import ApperIcon from './components/ApperIcon'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(false)

const currentRoute = routes[activeTab] || { component: HomePage }; // Fallback to HomePage if route not found

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark', !darkMode)
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-surface-50 dark:bg-surface-900">
        {/* Sidebar */}
        <motion.div 
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          className="w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 flex flex-col"
        >
          {/* Logo */}
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="Users" className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-surface-900 dark:text-white">FlowDesk</h1>
                <p className="text-xs text-surface-500">Customer Relations</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {routeArray.map((route) => (
              <motion.button
                key={route.id}
                onClick={() => setActiveTab(route.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all ${
                  activeTab === route.id
                    ? 'bg-primary text-white shadow-md'
                    : 'text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                }`}
              >
                <ApperIcon 
                  name={route.icon} 
                  className={`w-5 h-5 ${activeTab === route.id ? 'text-white' : 'text-surface-500'}`} 
                />
                <span className="font-medium">{route.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* Settings */}
          <div className="p-4 border-t border-surface-200 dark:border-surface-700">
            <button
              onClick={toggleDarkMode}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
            >
              <ApperIcon 
                name={darkMode ? 'Sun' : 'Moon'} 
                className="w-5 h-5" 
              />
              <span className="font-medium">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <currentRoute.component />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        className="mt-16"
      />
    </div>
  )
}

export default App