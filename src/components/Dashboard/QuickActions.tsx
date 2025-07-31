import React from 'react';
import { 
  Scissors, 
  Package, 
  Users, 
  FileText, 
  ShoppingCart, 
  Warehouse,
  TrendingUp,
  Calculator,
  Zap
} from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  module: string;
  action: () => void;
}

const QuickActions: React.FC = () => {
  const quickActions: QuickAction[] = [
    {
      id: 'corte-optimizado',
      title: 'Optimizar Corte',
      description: 'Calcular patrón óptimo de cortes',
      icon: Scissors,
      color: 'blue',
      module: 'corte-optimizado',
      action: () => {
        // En una implementación real, esto navegaría al módulo
        window.dispatchEvent(new CustomEvent('navigate-to-module', { detail: 'corte-optimizado' }));
      }
    },
    {
      id: 'nueva-venta',
      title: 'Nueva Venta',
      description: 'Crear factura o cotización',
      icon: ShoppingCart,
      color: 'green',
      module: 'ventas',
      action: () => {
        window.dispatchEvent(new CustomEvent('navigate-to-module', { detail: 'ventas' }));
      }
    },
    {
      id: 'inventario-rapido',
      title: 'Consulta Inventario',
      description: 'Ver existencias y movimientos',
      icon: Warehouse,
      color: 'purple',
      module: 'inventario',
      action: () => {
        window.dispatchEvent(new CustomEvent('navigate-to-module', { detail: 'inventario' }));
      }
    },
    {
      id: 'nuevo-cliente',
      title: 'Nuevo Cliente',
      description: 'Registrar cliente rápidamente',
      icon: Users,
      color: 'teal',
      module: 'catalogos',
      action: () => {
        window.dispatchEvent(new CustomEvent('navigate-to-module', { detail: 'catalogos' }));
      }
    },
    {
      id: 'reportes-rapidos',
      title: 'Reportes Rápidos',
      description: 'Generar reportes ejecutivos',
      icon: TrendingUp,
      color: 'yellow',
      module: 'archivo',
      action: () => {
        window.dispatchEvent(new CustomEvent('navigate-to-module', { detail: 'archivo' }));
      }
    },
    {
      id: 'calculadora-materiales',
      title: 'Calculadora Materiales',
      description: 'Calcular costos y cantidades',
      icon: Calculator,
      color: 'indigo',
      module: 'corte-optimizado',
      action: () => {
        alert('Abriendo calculadora de materiales...');
      }
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      teal: 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      teal: 'text-teal-600',
      yellow: 'text-yellow-600',
      indigo: 'text-indigo-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
          <p className="text-sm text-gray-600">Acceso directo a funciones principales</p>
        </div>
        <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          const colorClasses = getColorClasses(action.color);
          const iconColor = getIconColor(action.color);
          
          return (
            <button
              key={action.id}
              onClick={action.action}
              className={`p-4 border rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${colorClasses}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center ${iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-medium mb-1">{action.title}</h4>
                  <p className="text-sm opacity-80">{action.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Estadísticas de uso rápido */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <Scissors className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Optimizaciones hoy:</span>
            </div>
            <p className="text-lg font-bold text-blue-600">12</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <ShoppingCart className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Ventas hoy:</span>
            </div>
            <p className="text-lg font-bold text-green-600">8</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <Package className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-600">Productos activos:</span>
            </div>
            <p className="text-lg font-bold text-purple-600">1,250</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-4 h-4 text-teal-600" />
              <span className="text-sm text-gray-600">Clientes activos:</span>
            </div>
            <p className="text-lg font-bold text-teal-600">892</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;