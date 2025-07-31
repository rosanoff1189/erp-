import React from 'react';
import { 
  LayoutDashboard, 
  Archive, 
  Package, 
  Warehouse, 
  ShoppingCart, 
  FileText, 
  Settings,
  Wrench,
  Scissors,
  ChevronLeft,
  ChevronRight,
  Building2
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeModule, 
  setActiveModule, 
  collapsed, 
  setCollapsed 
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'archivo', label: 'Archivo', icon: Archive },
    { id: 'catalogos', label: 'Catálogos', icon: Package },
    { id: 'inventario', label: 'Inventario', icon: Warehouse },
    { id: 'ventas', label: 'Ventas', icon: ShoppingCart },
    { id: 'compras', label: 'Compras', icon: FileText },
    { id: 'corte-optimizado', label: 'Corte Optimizado', icon: Scissors },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
    { id: 'utilidades', label: 'Utilerías', icon: Wrench },
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center animate-pulse">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">ERP Nube</h2>
                <p className="text-xs text-gray-500">Aluminio/Vidrio</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveModule(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive
                      ? 'bg-primary text-white shadow-lg transform scale-105'
                      : 'text-gray-700 hover:bg-gray-100 hover:transform hover:scale-102'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;