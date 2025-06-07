import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

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
    );
  }

  const getIcon = () => {
    switch (type) {
      case 'contact': return 'User';
      case 'deal': return 'DollarSign';
      case 'activity': return 'Calendar';
      default: return 'Circle';
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'contact': return item.name;
      case 'deal': return item.title;
      case 'activity': return item.description;
      default: return 'Unknown';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'contact': return item.company || item.email;
      case 'deal': return `$${item.value?.toLocaleString()} • ${item.stage}`;
      case 'activity': return item.type;
      default: return '';
    }
  };

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
  );
};

export default RecentItem;