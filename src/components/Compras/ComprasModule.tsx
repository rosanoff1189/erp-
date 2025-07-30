import React, { useState } from 'react';
import { ShoppingCart, Plus, Eye, FileText, Search } from 'lucide-react';

const ComprasModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const compras = [
    {
      id: 1,
      folio: 'COM-2024-001',
      fecha: '2024-01-15',
      proveedor: 'Aluminios Industriales S.A.',
      ordenCompra: 'OC-2024-001',
      total: 125430.50,
      status: 'Recibida',
      items: 5,
      factura: 'PROV-A-001',
      observaciones: 'Recepción completa según orden',
      comprador: 'Juan Pérez'
    },
    {
      id: 2,
      folio: 'COM-2024-002',
      fecha: '2024-01-16',
      proveedor: 'Vidrios del Bajío',
      ordenCompra: 'OC-2024-002',
      total: 89750.00,
      status: 'Parcial',
      items: 3,
      factura: 'PROV-B-045',
      observaciones: 'Falta recibir 1 producto',
      comprador: 'María García'
    },
    {
      id: 3,
      folio: 'COM-2024-003',
      fecha: '2024-01-17',
      proveedor: 'Herrajes Premium',
      ordenCompra: 'OC-2024-003',
      total: 45200.00,
      status: 'Pendiente',
      items: 8,
      factura: null,
      observaciones: 'Esperando entrega del proveedor',
      comprador: 'Carlos Silva'
    }
  ];

  const filteredCompras = compras.filter(compra =>
    compra.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compra.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compra.ordenCompra.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Recibida':
        return 'bg-green-100 text-green-800';
      case 'Parcial':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Compras</h3>
              <p className="text-sm text-gray-600">Registro de compras y recepciones</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Nueva Compra</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar compras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Total Compras</p>
            <p className="text-2xl font-bold text-green-900">{compras.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Recibidas</p>
            <p className="text-2xl font-bold text-blue-900">
              {compras.filter(c => c.status === 'Recibida').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Parciales</p>
            <p className="text-2xl font-bold text-yellow-900">
              {compras.filter(c => c.status === 'Parcial').length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Valor Total</p>
            <p className="text-2xl font-bold text-purple-900">
              ${compras.reduce((sum, c) => sum + c.total, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCompras.map((compra) => (
            <div key={compra.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{compra.folio}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(compra.status)}`}>
                      {compra.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{compra.fecha}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors">
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Proveedor:</span>
                  <span className="font-medium">{compra.proveedor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Orden de Compra:</span>
                  <span className="font-medium font-mono">{compra.ordenCompra}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Comprador:</span>
                  <span className="font-medium">{compra.comprador}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{compra.items} productos</span>
                </div>
                {compra.factura && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Factura:</span>
                    <span className="font-medium font-mono text-blue-600">{compra.factura}</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="text-xs text-gray-500 mb-1">Observaciones:</p>
                <p className="text-sm text-gray-700">{compra.observaciones}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total:</p>
                  <p className="text-lg font-bold text-green-600">${compra.total.toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  {compra.status === 'Pendiente' && (
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      Recibir
                    </button>
                  )}
                  {compra.status === 'Parcial' && (
                    <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors">
                      Completar
                    </button>
                  )}
                  <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Imprimir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen de Recepciones Pendientes */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">Recepciones Pendientes</h4>
          <div className="space-y-2">
            {compras.filter(c => c.status === 'Pendiente' || c.status === 'Parcial').map((compra) => (
              <div key={compra.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                <div>
                  <span className="font-medium">{compra.folio}</span>
                  <span className="text-gray-600 ml-2">- {compra.proveedor}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(compra.status)}`}>
                    {compra.status}
                  </span>
                  <span className="font-bold text-blue-600">${compra.total.toLocaleString()}</span>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Procesar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComprasModule;