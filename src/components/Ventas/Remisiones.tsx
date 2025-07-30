import React, { useState } from 'react';
import { Receipt, Plus, Eye, FileText, Search } from 'lucide-react';

const Remisiones: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const remisiones = [
    {
      id: 1,
      folio: 'REM-2024-001',
      fecha: '2024-01-15',
      cliente: 'Constructora ABC S.A. de C.V.',
      vendedor: 'Carlos López',
      total: 45680.00,
      status: 'Entregada',
      items: 3,
      facturada: true,
      facturaFolio: 'FAC-2024-0156',
      observaciones: 'Entrega completa en obra'
    },
    {
      id: 2,
      folio: 'REM-2024-002',
      fecha: '2024-01-16',
      cliente: 'Vidrios del Norte S.A.',
      vendedor: 'Ana Martínez',
      total: 32150.00,
      status: 'Pendiente',
      items: 2,
      facturada: false,
      facturaFolio: null,
      observaciones: 'Pendiente de entrega'
    },
    {
      id: 3,
      folio: 'REM-2024-003',
      fecha: '2024-01-17',
      cliente: 'Juan Pérez Construcciones',
      vendedor: 'José García',
      total: 18920.00,
      status: 'Entregada',
      items: 5,
      facturada: false,
      facturaFolio: null,
      observaciones: 'Cliente recogió en almacén'
    }
  ];

  const filteredRemisiones = remisiones.filter(remision =>
    remision.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    remision.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    remision.vendedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregada':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
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
            <Receipt className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Remisiones</h3>
              <p className="text-sm text-gray-600">Notas de entrega y control de mercancía</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Nueva Remisión</span>
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
              placeholder="Buscar remisiones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Remisiones</p>
            <p className="text-2xl font-bold text-blue-900">{remisiones.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Entregadas</p>
            <p className="text-2xl font-bold text-green-900">
              {remisiones.filter(r => r.status === 'Entregada').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-900">
              {remisiones.filter(r => r.status === 'Pendiente').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Sin Facturar</p>
            <p className="text-2xl font-bold text-red-900">
              {remisiones.filter(r => !r.facturada && r.status === 'Entregada').length}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRemisiones.map((remision) => (
            <div key={remision.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{remision.folio}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(remision.status)}`}>
                      {remision.status}
                    </span>
                    {remision.facturada ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Facturada
                      </span>
                    ) : remision.status === 'Entregada' ? (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Sin Facturar
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-gray-600">{remision.fecha}</p>
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
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium">{remision.cliente}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vendedor:</span>
                  <span className="font-medium">{remision.vendedor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{remision.items} productos</span>
                </div>
                {remision.facturada && remision.facturaFolio && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Factura:</span>
                    <span className="font-medium font-mono text-blue-600">{remision.facturaFolio}</span>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="text-xs text-gray-500 mb-1">Observaciones:</p>
                <p className="text-sm text-gray-700">{remision.observaciones}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total:</p>
                  <p className="text-lg font-bold text-blue-600">${remision.total.toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  {remision.status === 'Pendiente' && (
                    <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                      Marcar Entregada
                    </button>
                  )}
                  {remision.status === 'Entregada' && !remision.facturada && (
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      Generar Factura
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

        {/* Resumen de Facturación Pendiente */}
        <div className="mt-8 p-4 bg-red-50 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-3">Remisiones Pendientes de Facturar</h4>
          <div className="space-y-2">
            {remisiones.filter(r => !r.facturada && r.status === 'Entregada').map((remision) => (
              <div key={remision.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                <div>
                  <span className="font-medium">{remision.folio}</span>
                  <span className="text-gray-600 ml-2">- {remision.cliente}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-red-600">${remision.total.toLocaleString()}</span>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Facturar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-red-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-red-900">Total Pendiente:</span>
              <span className="text-xl font-bold text-red-900">
                ${remisiones
                  .filter(r => !r.facturada && r.status === 'Entregada')
                  .reduce((sum, r) => sum + r.total, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Remisiones;