import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

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
);

export default QuickActionCard;