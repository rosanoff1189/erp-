import React from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const StatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Ventas del Mes',
      value: '$2,450,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'blue'
    },
    {
      title: 'Órdenes Pendientes',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'green'
    },
    {
      title: 'Productos en Stock',
      value: '2,847',
      change: '-3.1%',
      trend: 'down',
      icon: Package,
      color: 'yellow'
    },
    {
      title: 'Clientes Activos',
      value: '892',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      green: 'bg-green-500 text-green-600 bg-green-50',
      yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = getColorClasses(stat.color).split(' ');
        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 card-hover animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className={`flex items-center mt-2 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="w-4 h-4 mr-1 animate-bounce" />
                  {stat.change}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-lg ${colorClasses[2]} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${colorClasses[1]}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;