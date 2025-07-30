import React from 'react';
import StatsCards from './StatsCards';
import SalesChart from './SalesChart';
import RecentActivity from './RecentActivity';
import TopProducts from './TopProducts';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Ejecutivo</h2>
        <div className="text-sm text-gray-500">
          Último actualizado: {new Date().toLocaleString()}
        </div>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <TopProducts />
        </div>
      </div>

      <RecentActivity />
    </div>
  );
};

export default Dashboard;