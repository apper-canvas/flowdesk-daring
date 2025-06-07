import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import DashboardHeader from '@/components/organisms/DashboardHeader';
import StatsGrid from '@/components/organisms/StatsGrid';
import RecentActivityList from '@/components/organisms/RecentActivityList';
import QuickActionsFeature from '@/components/organisms/QuickActionsFeature';
import { contactService, dealService, activityService } from '@/services';

const HomePage = () => {
  const [stats, setStats] = useState({
    contacts: 0,
    deals: 0,
    activities: 0,
    revenue: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [contacts, deals, activities] = await Promise.all([
          contactService.getAll(),
          dealService.getAll(),
          activityService.getAll()
        ]);

        // Calculate stats
        const revenue = deals
          .filter(deal => deal.status === 'Won')
          .reduce((sum, deal) => sum + deal.value, 0);

        setStats({
          contacts: contacts.length,
          deals: deals.filter(deal => deal.status === 'Open').length,
          activities: activities.filter(activity => !activity.completed).length,
          revenue
        });

        // Get recent items (latest 6)
        const recent = [
          ...contacts.slice(0, 2).map(item => ({ ...item, type: 'contact' })),
          ...deals.slice(0, 2).map(item => ({ ...item, type: 'deal' })),
          ...activities.slice(0, 2).map(item => ({ ...item, type: 'activity' }))
        ].sort((a, b) => new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp))
          .slice(0, 6);

        setRecentItems(recent);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

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
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        <DashboardHeader />

        <StatsGrid stats={stats} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <QuickActionsFeature />
          </div>
          <RecentActivityList recentItems={recentItems} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;