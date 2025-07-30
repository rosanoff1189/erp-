import React, { useState } from 'react';
import { Settings, Users, Database, Upload, Download, RefreshCw, FileSpreadsheet } from 'lucide-react';
import ControlUsuarios from './ControlUsuarios';
import ProcesosEspeciales from './ProcesosEspeciales';
import AdministradorBD from './AdministradorBD';
import ImportExport from './ImportExport';

const Utilidades: React.FC = () => {
  const [activeSection, setActiveSection] = useState('control-usuarios');

  const sections = [
    { id: 'control-usuarios', label: 'Control de Usuarios', icon: Users },
    { id: 'procesos-especiales', label: 'Procesos Especiales', icon: RefreshCw },
    { id: 'import-export', label: 'Importar/Exportar', icon: FileSpreadsheet },
    { id: 'administrador-bd', label: 'Administrador BD', icon: Database }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'control-usuarios':
        return <ControlUsuarios />;
      case 'procesos-especiales':
        return <ProcesosEspeciales />;
      case 'import-export':
        return <ImportExport />;
      case 'administrador-bd':
        return <AdministradorBD />;
      default:
        return <ControlUsuarios />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Módulo de Utilerías</h2>
        <p className="text-gray-600">Herramientas avanzadas de administración y mantenimiento del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Herramientas</h3>
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

export default Utilidades;