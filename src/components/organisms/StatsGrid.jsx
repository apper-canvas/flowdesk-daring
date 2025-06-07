import React from 'react';
import StatCard from '@/components/molecules/StatCard';

const StatsGrid = ({ stats, loading }) => {
  return (
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
  );
};

export default StatsGrid;