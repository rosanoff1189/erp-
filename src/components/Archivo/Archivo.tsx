import React, { useState } from 'react';
import { 
  Database, 
  Settings, 
  Truck,
  User,
  Map,
  FileText,
  BarChart3,
  Plus
} from 'lucide-react';
import CatalogosSAT from './CatalogosSAT';
import LineasProduccion from './LineasProduccion';
import AcabadosAluminio from './AcabadosAluminio';
import ConceptosCxCyP from './ConceptosCxCyP';
import Choferes from './Choferes';
import Autotransporte from './Autotransporte';
import Reparto from './Reparto';
import Reportes from './Reportes';

const Archivo: React.FC = () => {
  const [activeSection, setActiveSection] = useState('catalogos-sat');

  const sections = [
    { id: 'catalogos-sat', label: 'Catálogos SAT', icon: Database },
    { id: 'lineas-produccion', label: 'Líneas de Producción', icon: Settings },
    { id: 'acabados-aluminio', label: 'Acabados de Aluminio', icon: Settings },
    { id: 'conceptos-cxc-cxp', label: 'Conceptos CxC y CxP', icon: FileText },
    { id: 'choferes', label: 'Choferes', icon: User },
    { id: 'autotransporte', label: 'Autotransporte', icon: Truck },
    { id: 'reparto', label: 'Reparto', icon: Map },
    { id: 'reportes', label: 'Reportes', icon: BarChart3 }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'catalogos-sat':
        return <CatalogosSAT />;
      case 'lineas-produccion':
        return <LineasProduccion />;
      case 'acabados-aluminio':
        return <AcabadosAluminio />;
      case 'conceptos-cxc-cxp':
        return <ConceptosCxCyP />;
      case 'choferes':
        return <Choferes />;
      case 'autotransporte':
        return <Autotransporte />;
      case 'reparto':
        return <Reparto />;
      case 'reportes':
        return <Reportes />;
      default:
        return <CatalogosSAT />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Módulo de Archivo</h2>
        <p className="text-gray-600">Gestión de catálogos y configuraciones del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Secciones</h3>
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

export default Archivo;