import React, { useState } from 'react';
import { RotateCcw, Plus, Eye, Search, AlertCircle } from 'lucide-react';

const Devoluciones: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const devoluciones = [
    {
      id: 1,
      folio: 'DEV-2024-001',
      fecha: '2024-01-18',
      cliente: 'Constructora ABC S.A. de C.V.',
      facturaOriginal: 'FAC-2024-0156',
      motivo: 'Producto Defectuoso',
      total: 12500.00,
      status: 'Aprobada',
      items: 2,
      observaciones: 'Vidrio con fisuras, se autoriza cambio',
      vendedor: 'Carlos López',
      tipoDevolucion: 'Cambio'
    },
    {
      id: 2,
      folio: 'DEV-2024-002',
      fecha: '2024-01-19',
      cliente: 'Vidrios del Norte S.A.',
      facturaOriginal: 'FAC-2024-0157',
      motivo: 'Error en Medidas',
      total: 8750.00,
      status: 'Pendiente',
      items: 1,
      observaciones: 'Cliente solicita medidas diferentes',
      vendedor: 'Ana Martínez',
      tipoDevolucion: 'Reembolso'
    },
    {
      id: 3,
      folio: 'DEV-2024-003',
      fecha: '2024-01-20',
      cliente: 'Juan Pérez Construcciones',
      facturaOriginal: 'FAC-2024-0158',
      motivo: 'Exceso en Pedido',
      total: 3200.00,
      status: 'Procesada',
      items: 3,
      observaciones: 'Cliente devuelve material sobrante',
      vendedor: 'José García',
      tipoDevolucion: 'Nota de Crédito'
    }
  ];

  const filteredDevoluciones = devoluciones.filter(dev =>
    dev.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dev.facturaOriginal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprobada':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Procesada':
        return 'bg-blue-100 text-blue-800';
      case 'Rechazada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Cambio':
        return 'bg-blue-100 text-blue-800';
      case 'Reembolso':
        return 'bg-green-100 text-green-800';
      case 'Nota de Crédito':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const motivosDevolucion = [
    'Producto Defectuoso',
    'Error en Medidas',
    'Exceso en Pedido',
    'Producto Incorrecto',
    'Daño en Transporte',
    'Cambio de Especificaciones',
    'Otro'
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <RotateCcw className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Devoluciones</h3>
              <p className="text-sm text-gray-600">Gestión de devoluciones y notas de crédito</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Devolución</span>
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
              placeholder="Buscar devoluciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-orange-600 font-medium">Total Devoluciones</p>
            <p className="text-2xl font-bold text-orange-900">{devoluciones.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-900">
              {devoluciones.filter(d => d.status === 'Pendiente').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Aprobadas</p>
            <p className="text-2xl font-bold text-green-900">
              {devoluciones.filter(d => d.status === 'Aprobada').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Valor Total</p>
            <p className="text-2xl font-bold text-red-900">
              ${devoluciones.reduce((sum, d) => sum + d.total, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredDevoluciones.map((devolucion) => (
            <div key={devolucion.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{devolucion.folio}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(devolucion.status)}`}>
                      {devolucion.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(devolucion.tipoDevolucion)}`}>
                      {devolucion.tipoDevolucion}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{devolucion.fecha}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium">{devolucion.cliente}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Factura Original:</span>
                  <span className="font-medium font-mono">{devolucion.facturaOriginal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vendedor:</span>
                  <span className="font-medium">{devolucion.vendedor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{devolucion.items} productos</span>
                </div>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg mb-3">
                <div className="flex items-center space-x-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <p className="text-xs font-medium text-orange-800">Motivo:</p>
                </div>
                <p className="text-sm font-medium text-orange-900">{devolucion.motivo}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="text-xs text-gray-500 mb-1">Observaciones:</p>
                <p className="text-sm text-gray-700">{devolucion.observaciones}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Valor Devolución:</p>
                  <p className="text-lg font-bold text-orange-600">${devolucion.total.toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  {devolucion.status === 'Pendiente' && (
                    <>
                      <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                        Aprobar
                      </button>
                      <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
                        Rechazar
                      </button>
                    </>
                  )}
                  {devolucion.status === 'Aprobada' && (
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      Procesar
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

        {/* Resumen por Motivos */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Análisis de Motivos de Devolución</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {motivosDevolucion.slice(0, 6).map((motivo, index) => {
              const count = devoluciones.filter(d => d.motivo === motivo).length;
              const total = devoluciones.filter(d => d.motivo === motivo).reduce((sum, d) => sum + d.total, 0);
              
              return (
                <div key={index} className="bg-white p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{motivo}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-600">{count} casos</span>
                    <span className="text-sm font-medium text-orange-600">
                      ${total.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Nueva Devolución */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Nueva Devolución</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Factura Original *
                  </label>
                  <input
                    type="text"
                    placeholder="FAC-2024-0001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Devolución *
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo de Devolución *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Seleccionar motivo...</option>
                    {motivosDevolucion.map((motivo, index) => (
                      <option key={index} value={motivo}>{motivo}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Devolución *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Seleccionar tipo...</option>
                    <option value="Cambio">Cambio de Producto</option>
                    <option value="Reembolso">Reembolso</option>
                    <option value="Nota de Crédito">Nota de Crédito</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Productos a Devolver</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Producto</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Cant. Original</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Cant. Devolver</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Precio Unit.</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-200">
                        <td className="py-3 px-4">Vidrio Templado 6mm</td>
                        <td className="py-3 px-4">50 M2</td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            placeholder="0"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="py-3 px-4">$350.00</td>
                        <td className="py-3 px-4 font-medium">$0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones *
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describa detalladamente el motivo de la devolución..."
                  required
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
              <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                Registrar Devolución
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Devoluciones;