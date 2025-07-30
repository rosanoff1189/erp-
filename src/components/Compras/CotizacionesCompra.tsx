import React, { useState } from 'react';
import { Receipt, Plus, Eye, FileText, Search, Calendar } from 'lucide-react';

const CotizacionesCompra: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const cotizaciones = [
    {
      id: 1,
      folio: 'COTC-2024-001',
      fecha: '2024-01-08',
      fechaVencimiento: '2024-01-23',
      proveedor: 'Aluminios Industriales S.A.',
      contacto: 'Ing. María López',
      total: 125430.50,
      status: 'Aprobada',
      items: 5,
      observaciones: 'Mejor precio del mercado',
      comprador: 'Juan Pérez'
    },
    {
      id: 2,
      folio: 'COTC-2024-002',
      fecha: '2024-01-10',
      fechaVencimiento: '2024-01-25',
      proveedor: 'Vidrios del Bajío',
      contacto: 'Lic. Carlos Ramírez',
      total: 89750.00,
      status: 'Vigente',
      items: 3,
      observaciones: 'Pendiente de comparar con otras opciones',
      comprador: 'María García'
    },
    {
      id: 3,
      folio: 'COTC-2024-003',
      fecha: '2024-01-05',
      fechaVencimiento: '2024-01-20',
      proveedor: 'Herrajes Premium',
      contacto: 'Sr. Jorge Mendoza',
      total: 45200.00,
      status: 'Vencida',
      items: 8,
      observaciones: 'Cotización expirada, solicitar nueva',
      comprador: 'Carlos Silva'
    }
  ];

  const filteredCotizaciones = cotizaciones.filter(cot =>
    cot.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cot.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cot.comprador.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Vigente':
        return 'bg-blue-100 text-blue-800';
      case 'Aprobada':
        return 'bg-green-100 text-green-800';
      case 'Rechazada':
        return 'bg-red-100 text-red-800';
      case 'Vencida':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isVencida = (fechaVencimiento: string) => {
    return new Date(fechaVencimiento) < new Date();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Receipt className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Cotizaciones de Compra</h3>
              <p className="text-sm text-gray-600">Solicitudes de cotización a proveedores</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Nueva Cotización</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cotizaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Total Cotizaciones</p>
            <p className="text-2xl font-bold text-purple-900">{cotizaciones.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Aprobadas</p>
            <p className="text-2xl font-bold text-green-900">
              {cotizaciones.filter(c => c.status === 'Aprobada').length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Vigentes</p>
            <p className="text-2xl font-bold text-blue-900">
              {cotizaciones.filter(c => c.status === 'Vigente').length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 font-medium">Vencidas</p>
            <p className="text-2xl font-bold text-gray-900">
              {cotizaciones.filter(c => c.status === 'Vencida').length}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCotizaciones.map((cotizacion) => (
            <div key={cotizacion.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{cotizacion.folio}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(cotizacion.status)}`}>
                      {cotizacion.status}
                    </span>
                    {isVencida(cotizacion.fechaVencimiento) && cotizacion.status === 'Vigente' && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Vencida
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{cotizacion.fecha}</p>
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
                  <span className="font-medium">{cotizacion.proveedor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Contacto:</span>
                  <span className="font-medium">{cotizacion.contacto}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Comprador:</span>
                  <span className="font-medium">{cotizacion.comprador}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vencimiento:</span>
                  <span className={`font-medium ${
                    isVencida(cotizacion.fechaVencimiento) ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {cotizacion.fechaVencimiento}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{cotizacion.items} productos</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="text-xs text-gray-500 mb-1">Observaciones:</p>
                <p className="text-sm text-gray-700">{cotizacion.observaciones}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total:</p>
                  <p className="text-lg font-bold text-purple-600">${cotizacion.total.toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  {cotizacion.status === 'Vigente' && (
                    <>
                      <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                        Aprobar
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                        Rechazar
                      </button>
                    </>
                  )}
                  {cotizacion.status === 'Aprobada' && (
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      Crear OC
                    </button>
                  )}
                  {cotizacion.status === 'Vencida' && (
                    <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors">
                      Renovar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparativo de Cotizaciones */}
        <div className="mt-8 p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-4">Comparativo de Precios</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-200">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-purple-900">Producto</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-purple-900">Aluminios Ind.</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-purple-900">Vidrios Bajío</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-purple-900">Herrajes Prem.</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-purple-900">Mejor Precio</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-purple-100">
                  <td className="py-2 px-3 text-sm">Vidrio Templado 6mm</td>
                  <td className="py-2 px-3 text-sm">$350.00</td>
                  <td className="py-2 px-3 text-sm">$340.00</td>
                  <td className="py-2 px-3 text-sm">-</td>
                  <td className="py-2 px-3 text-sm font-bold text-green-600">$340.00</td>
                </tr>
                <tr className="border-b border-purple-100">
                  <td className="py-2 px-3 text-sm">Perfil Aluminio Natural</td>
                  <td className="py-2 px-3 text-sm">$145.50</td>
                  <td className="py-2 px-3 text-sm">-</td>
                  <td className="py-2 px-3 text-sm">$150.00</td>
                  <td className="py-2 px-3 text-sm font-bold text-green-600">$145.50</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CotizacionesCompra;