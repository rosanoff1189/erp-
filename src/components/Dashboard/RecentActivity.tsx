import React from 'react';
import { Activity, FileText, Package, Users, DollarSign } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      type: 'sale',
      icon: DollarSign,
      title: 'Nueva venta registrada',
      description: 'Factura #FAC-2024-0156 por $45,680',
      time: 'Hace 5 minutos',
      color: 'green'
    },
    {
      type: 'inventory',
      icon: Package,
      title: 'Entrada de inventario',
      description: 'Recepción de 200 piezas de vidrio templado',
      time: 'Hace 15 minutos',
      color: 'blue'
    },
    {
      type: 'client',
      icon: Users,
      title: 'Cliente nuevo registrado',
      description: 'Constructora ABC S.A. de C.V.',
      time: 'Hace 1 hora',
      color: 'purple'
    },
    {
      type: 'document',
      icon: FileText,
      title: 'Orden de compra aprobada',
      description: 'OC-2024-089 por $125,000',
      time: 'Hace 2 horas',
      color: 'yellow'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          <p className="text-sm text-gray-600">Últimas operaciones del sistema</p>
        </div>
        <Activity className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const colorClasses = getColorClasses(activity.color);
          
          return (
            <div key={index} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;