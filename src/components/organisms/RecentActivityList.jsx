import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import RecentItem from '@/components/molecules/RecentItem';

const RecentActivityList = ({ recentItems, loading }) => {
  return (
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
          recentItems.map((item) => (
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
  );
};

export default RecentActivityList;