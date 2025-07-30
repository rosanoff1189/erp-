import React, { useState } from 'react';
import { Settings, Building, Users, Shield, Database } from 'lucide-react';
import DatosEmpresa from './DatosEmpresa';
import Usuarios from './Usuarios';
import Permisos from './Permisos';
import Sucursales from './Sucursales';

const Configuracion: React.FC = () => {
  const [activeSection, setActiveSection] = useState('empresa');

  const sections = [
    { id: 'empresa', label: 'Datos de la Empresa', icon: Building },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'permisos', label: 'Roles y Permisos', icon: Shield },
    { id: 'sucursales', label: 'Sucursales', icon: Database }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'empresa':
        return <DatosEmpresa />;
      case 'usuarios':
        return <Usuarios />;
      case 'permisos':
        return <Permisos />;
      case 'sucursales':
        return <Sucursales />;
      default:
        return <DatosEmpresa />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h2>
        <p className="text-gray-600">Configuración general y administración del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Configuración</h3>
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

export default Configuracion;