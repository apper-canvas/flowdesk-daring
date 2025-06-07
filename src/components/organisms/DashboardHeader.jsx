import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import MotionButton from '@/components/molecules/MotionButton';

const DashboardHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div>
        <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Dashboard</h1>
        <p className="text-surface-500 mt-1">Welcome back! Here's what's happening with your business.</p>
      </div>
      <MotionButton
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toast.info('Quick actions coming soon!')}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
      >
        <ApperIcon name="Plus" className="w-4 h-4" />
        <span>Quick Add</span>
      </MotionButton>
    </motion.div>
  );
};

export default DashboardHeader;