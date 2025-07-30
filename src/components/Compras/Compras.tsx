import React, { useState } from 'react';
import { FileText, ShoppingCart, Receipt, DollarSign } from 'lucide-react';
import OrdenesCompra from './OrdenesCompra';
import Compras from './ComprasModule';
import Cotizaciones from './CotizacionesCompra';
import CuentasPorPagar from './CuentasPorPagar';

const ComprasMain: React.FC = () => {
  const [activeSection, setActiveSection] = useState('ordenes-compra');

  const sections = [
    { id: 'ordenes-compra', label: 'Órdenes de Compra', icon: FileText },
    { id: 'compras', label: 'Compras', icon: ShoppingCart },
    { id: 'cotizaciones', label: 'Cotizaciones', icon: Receipt },
    { id: 'cuentas-pagar', label: 'Cuentas por Pagar', icon: DollarSign }
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'ordenes-compra':
        return <OrdenesCompra />;
      case 'compras':
        return <Compras />;
      case 'cotizaciones':
        return <Cotizaciones />;
      case 'cuentas-pagar':
        return <CuentasPorPagar />;
      default:
        return <OrdenesCompra />;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Módulo de Compras</h2>
        <p className="text-gray-600">Gestión completa del proceso de compras y proveedores</p>
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

export default ComprasMain;