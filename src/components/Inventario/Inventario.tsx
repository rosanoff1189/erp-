import React, { useState } from 'react';
import { Warehouse, TrendingUp, TrendingDown, RotateCcw, ArrowRightLeft, FileCheck } from 'lucide-react';
import MovimientosInventario from './MovimientosInventario';
import NotasEntrada from './NotasEntrada';
import NotasSalida from './NotasSalida';
import InventarioFisico from './InventarioFisico';
import Trazabilidad from './Trazabilidad';

const Inventario: React.FC = () => {
  const [activeSection, setActiveSection] = useState('movimientos');

  const sections = [
    { id: 'movimientos', label: 'Movimientos', icon: ArrowRightLeft },
    { id: 'entradas', label: 'Notas de Entrada', icon: TrendingUp },
    { id: 'salidas', label: 'Notas de Salida', icon: TrendingDown },
    { id: 'inventario-fisico', label: 'Inventario Físico', icon: FileCheck },
    { id: 'trazabilidad', label: 'Trazabilidad', icon: RotateCcw }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'movimientos':
        return <MovimientosInventario />;
      case 'entradas':
        return <NotasEntrada />;
      case 'salidas':
        return <NotasSalida />;
      case 'inventario-fisico':
        return <InventarioFisico />;
      case 'trazabilidad':
        return <Trazabilidad />;
      default:
        return <MovimientosInventario />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Módulo de Inventario</h2>
        <p className="text-gray-600">Control de existencias y movimientos de almacén</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Operaciones</h3>
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

export default Inventario;