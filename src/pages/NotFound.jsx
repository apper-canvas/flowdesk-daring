import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8"
      >
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <ApperIcon name="Search" className="w-24 h-24 text-surface-300 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">404</h1>
        <h2 className="text-xl font-semibold text-surface-700 dark:text-surface-300 mb-2">Page Not Found</h2>
        <p className="text-surface-500 mb-8 max-w-md mx-auto">
          Sorry, the page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2 mx-auto"
        >
          <ApperIcon name="ArrowLeft" className="w-4 h-4" />
          <span>Go Back</span>
        </motion.button>
      </motion.div>
    </div>
  )
}

export default NotFound