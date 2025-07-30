import React, { useState } from 'react';
import { ShoppingCart, FileText, Receipt, CreditCard, RotateCcw, DollarSign } from 'lucide-react';
import Facturas from './Facturas';
import Cotizaciones from './Cotizaciones';
import Pedidos from './Pedidos';
import Remisiones from './Remisiones';
import CuentasPorCobrar from './CuentasPorCobrar';
import Devoluciones from './Devoluciones';

const Ventas: React.FC = () => {
  const [activeSection, setActiveSection] = useState('facturas');

  const sections = [
    { id: 'facturas', label: 'Facturas', icon: FileText },
    { id: 'cotizaciones', label: 'Cotizaciones', icon: Receipt },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingCart },
    { id: 'remisiones', label: 'Remisiones', icon: Receipt },
    { id: 'cuentas-cobrar', label: 'Cuentas por Cobrar', icon: DollarSign },
    { id: 'devoluciones', label: 'Devoluciones', icon: RotateCcw }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'facturas':
        return <Facturas />;
      case 'cotizaciones':
        return <Cotizaciones />;
      case 'pedidos':
        return <Pedidos />;
      case 'remisiones':
        return <Remisiones />;
      case 'cuentas-cobrar':
        return <CuentasPorCobrar />;
      case 'devoluciones':
        return <Devoluciones />;
      default:
        return <Facturas />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Módulo de Ventas</h2>
        <p className="text-gray-600">Gestión completa del proceso de ventas y facturación</p>
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

export default Ventas;