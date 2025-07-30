import React, { useState } from 'react';
import { Package, Users, Briefcase, UserCheck } from 'lucide-react';
import Productos from './Productos';
import Clientes from './Clientes';
import Proveedores from './Proveedores';
import Vendedores from './Vendedores';

const Catalogos: React.FC = () => {
  const [activeSection, setActiveSection] = useState('productos');

  const sections = [
    { id: 'productos', label: 'Productos', icon: Package },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'proveedores', label: 'Proveedores', icon: Briefcase },
    { id: 'vendedores', label: 'Vendedores', icon: UserCheck }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'productos':
        return <Productos />;
      case 'clientes':
        return <Clientes />;
      case 'proveedores':
        return <Proveedores />;
      case 'vendedores':
        return <Vendedores />;
      default:
        return <Productos />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Módulo de Catálogos</h2>
        <p className="text-gray-600">Gestión de productos, clientes, proveedores y vendedores</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Catálogos</h3>
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default Catalogos;