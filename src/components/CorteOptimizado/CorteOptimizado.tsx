import React, { useState } from 'react';
import { Scissors, Plus, Download, Eye, Save, Calculator, BarChart3 } from 'lucide-react';
import OptimizadorCorte from './OptimizadorCorte';
import HistorialCortes from './HistorialCortes';
import ConfiguracionMateriales from './ConfiguracionMateriales';

const CorteOptimizado: React.FC = () => {
  const [activeSection, setActiveSection] = useState('optimizador');

  const sections = [
    { id: 'optimizador', label: 'Optimizador de Corte', icon: Scissors },
    { id: 'historial', label: 'Historial de Cortes', icon: BarChart3 },
    { id: 'materiales', label: 'Configuración de Materiales', icon: Calculator }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'optimizador':
        return <OptimizadorCorte />;
      case 'historial':
        return <HistorialCortes />;
      case 'materiales':
        return <ConfiguracionMateriales />;
      default:
        return <OptimizadorCorte />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Módulo de Corte Optimizado</h2>
        <p className="text-gray-600">Optimización de cortes para aluminio, vidrio y acero con algoritmos avanzados</p>
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

export default CorteOptimizado;