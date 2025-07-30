import React, { useState } from 'react';
import { Receipt, Plus, Eye, FileText, Search, Calendar } from 'lucide-react';

const Cotizaciones: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const cotizaciones = [
    {
      id: 1,
      folio: 'COT-2024-001',
      fecha: '2024-01-10',
      fechaVencimiento: '2024-01-25',
      cliente: 'Constructora ABC S.A. de C.V.',
      vendedor: 'Carlos López',
      total: 125430.50,
      status: 'Vigente',
      items: 5,
      observaciones: 'Cotización para proyecto residencial',
      probabilidad: 80
    },
    {
      id: 2,
      folio: 'COT-2024-002',
      fecha: '2024-01-12',
      fechaVencimiento: '2024-01-27',
      cliente: 'Vidrios del Norte S.A.',
      vendedor: 'Ana Martínez',
      total: 89750.00,
      status: 'Aprobada',
      items: 3,
      observaciones: 'Cliente aprobó cotización, generar pedido',
      probabilidad: 100
    },
    {
      id: 3,
      folio: 'COT-2024-003',
      fecha: '2024-01-08',
      fechaVencimiento: '2024-01-23',
      cliente: 'Juan Pérez Construcciones',
      vendedor: 'José García',
      total: 45200.00,
      status: 'Vencida',
      items: 2,
      observaciones: 'Cliente no respondió en tiempo',
      probabilidad: 20
    }
  ];

  const filteredCotizaciones = cotizaciones.filter(cot =>
    cot.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cot.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cot.vendedor.toLowerCase().includes(searchTerm.toLowerCase())
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

  const getProbabilidadColor = (probabilidad: number) => {
    if (probabilidad >= 80) return 'text-green-600';
    if (probabilidad >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const isVencida = (fechaVencimiento: string) => {
    return new Date(fechaVencimiento) < new Date();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Receipt className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Cotizaciones</h3>
              <p className="text-sm text-gray-600">Gestión de propuestas comerciales</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
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
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Cotizaciones</p>
            <p className="text-2xl font-bold text-blue-900">{cotizaciones.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Aprobadas</p>
            <p className="text-2xl font-bold text-green-900">
              {cotizaciones.filter(c => c.status === 'Aprobada').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Vigentes</p>
            <p className="text-2xl font-bold text-yellow-900">
              {cotizaciones.filter(c => c.status === 'Vigente').length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Valor Total</p>
            <p className="text-2xl font-bold text-purple-900">
              ${cotizaciones.reduce((sum, c) => sum + c.total, 0).toLocaleString()}
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
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium">{cotizacion.cliente}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vendedor:</span>
                  <span className="font-medium">{cotizacion.vendedor}</span>
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
                  <p className="text-lg font-bold text-blue-600">${cotizacion.total.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Probabilidad:</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          cotizacion.probabilidad >= 80 ? 'bg-green-500' :
                          cotizacion.probabilidad >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${cotizacion.probabilidad}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getProbabilidadColor(cotizacion.probabilidad)}`}>
                      {cotizacion.probabilidad}%
                    </span>
                  </div>
                </div>
              </div>

              {cotizacion.status === 'Aprobada' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <button className="w-full px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                    Convertir a Pedido
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal Nueva Cotización */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Nueva Cotización</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Seleccionar cliente...</option>
                    <option value="1">Constructora ABC S.A. de C.V.</option>
                    <option value="2">Vidrios del Norte S.A.</option>
                    <option value="3">Juan Pérez Construcciones</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendedor *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Seleccionar vendedor...</option>
                    <option value="1">Carlos López</option>
                    <option value="2">Ana Martínez</option>
                    <option value="3">José García</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Cotización *
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Vencimiento *
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Probabilidad de Cierre (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    defaultValue="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moneda
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="MXN">MXN - Peso Mexicano</option>
                    <option value="USD">USD - Dólar Americano</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Productos/Servicios</h4>
                  <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Agregar Producto</span>
                  </button>
                </div>
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Producto</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Cantidad</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Precio Unit.</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Descuento</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Total</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-200">
                        <td className="py-3 px-4">
                          <select className="w-full px-2 py-1 border border-gray-300 rounded text-sm">
                            <option>Seleccionar producto...</option>
                            <option>Vidrio Templado 6mm</option>
                            <option>Perfil Aluminio Natural</option>
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            placeholder="1"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="py-3 px-4 font-medium">$0.00</td>
                        <td className="py-3 px-4">
                          <button className="text-red-600 hover:text-red-800">
                            <span className="text-sm">Eliminar</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Observaciones de la cotización..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Guardar Cotización
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cotizaciones;