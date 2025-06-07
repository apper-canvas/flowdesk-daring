import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

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
);

export default StatCard;