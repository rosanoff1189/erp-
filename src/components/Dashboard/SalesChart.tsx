import React from 'react';
import { BarChart3 } from 'lucide-react';

const SalesChart: React.FC = () => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
  const salesData = [1800000, 2100000, 1950000, 2300000, 2150000, 2450000];
  const maxSale = Math.max(...salesData);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Ventas Mensuales</h3>
          <p className="text-sm text-gray-600">Comparativo de los últimos 6 meses</p>
        </div>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>

      <div className="h-64">
        <div className="flex items-end justify-between h-full space-x-2">
          {months.map((month, index) => {
            const height = (salesData[index] / maxSale) * 100;
            return (
              <div key={month} className="flex flex-col items-center flex-1">
                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '200px' }}>
                  <div
                    className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-700 hover:to-blue-500 cursor-pointer group relative"
                    style={{ height: `${height}%`, marginTop: `${100 - height}%` }}
                  >
                    <div className="absolute inset-x-0 -top-8 text-xs font-medium text-gray-700 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      ${(salesData[index] / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600 mt-2">{month}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;