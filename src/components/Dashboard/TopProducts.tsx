import React from 'react';
import { Star } from 'lucide-react';

const TopProducts: React.FC = () => {
  const products = [
    { name: 'Vidrio Templado 6mm', sales: 145, revenue: '$450,000', trend: '+12%' },
    { name: 'Perfil Aluminio Natural', sales: 128, revenue: '$380,000', trend: '+8%' },
    { name: 'Vidrio Laminado 8mm', sales: 96, revenue: '$320,000', trend: '+15%' },
    { name: 'Aluminio Anodizado', sales: 87, revenue: '$290,000', trend: '+5%' },
    { name: 'Cancelería Premium', sales: 72, revenue: '$240,000', trend: '+18%' }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Productos Top</h3>
          <p className="text-sm text-gray-600">Más vendidos este mes</p>
        </div>
        <Star className="w-5 h-5 text-yellow-500" />
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                index === 0 ? 'bg-yellow-500' : 
                index === 1 ? 'bg-gray-400' : 
                index === 2 ? 'bg-orange-500' : 'bg-blue-500'
              }`}>
                {index + 1}
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600">{product.sales} unidades</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{product.revenue}</p>
              <p className="text-sm text-green-600">{product.trend}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;