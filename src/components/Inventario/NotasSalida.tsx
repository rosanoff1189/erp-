import React, { useState } from 'react';
import { TrendingDown, Plus, Eye, Search, Calendar } from 'lucide-react';

const NotasSalida: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const notasSalida = [
    {
      id: 1,
      folio: 'NS-089',
      fecha: '2024-01-15',
      cliente: 'Constructora ABC S.A.',
      almacen: 'Almacén General',
      total: 45680.00,
      status: 'Entregada',
      items: 3,
      factura: 'FAC-156',
      observaciones: 'Entrega completa en obra'
    },
    {
      id: 2,
      folio: 'NS-090',
      fecha: '2024-01-16',
      cliente: 'Vidrios del Norte',
      almacen: 'Almacén General',
      total: 32150.00,
      status: 'Preparando',
      items: 2,
      factura: 'FAC-157',
      observaciones: 'Pendiente de carga en camión'
    },
    {
      id: 3,
      folio: 'NS-091',
      fecha: '2024-01-17',
      cliente: 'Juan Pérez Construcciones',
      almacen: 'Almacén Sucursal Norte',
      total: 18920.00,
      status: 'Entregada',
      items: 5,
      factura: 'FAC-158',
      observaciones: 'Cliente recogió en sucursal'
    }
  ];

  const filteredNotas = notasSalida.filter(nota =>
    nota.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nota.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nota.factura.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregada':
        return 'bg-green-100 text-green-800';
      case 'Preparando':
        return 'bg-yellow-100 text-yellow-800';
      case 'En Tránsito':
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
            <TrendingDown className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notas de Salida</h3>
              <p className="text-sm text-gray-600">Registro de salidas de mercancía del almacén</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Salida</span>
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
              placeholder="Buscar notas de salida..."
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
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Total Salidas</p>
            <p className="text-2xl font-bold text-red-900">{notasSalida.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Entregadas</p>
            <p className="text-2xl font-bold text-green-900">
              {notasSalida.filter(n => n.status === 'Entregada').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">En Proceso</p>
            <p className="text-2xl font-bold text-yellow-900">
              {notasSalida.filter(n => n.status === 'Preparando').length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Valor Total</p>
            <p className="text-2xl font-bold text-purple-900">
              ${notasSalida.reduce((sum, n) => sum + n.total, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredNotas.map((nota) => (
            <div key={nota.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{nota.folio}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(nota.status)}`}>
                      {nota.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{nota.fecha}</p>
                </div>
                <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium">{nota.cliente}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Almacén:</span>
                  <span className="font-medium">{nota.almacen}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Factura:</span>
                  <span className="font-medium font-mono">{nota.factura}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{nota.items} productos</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="text-xs text-gray-500 mb-1">Observaciones:</p>
                <p className="text-sm text-gray-700">{nota.observaciones}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Valor Total:</p>
                  <p className="text-lg font-bold text-red-600">${nota.total.toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    Ver Detalle
                  </button>
                  {nota.status === 'Preparando' && (
                    <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                      Entregar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Nueva Salida */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Nueva Nota de Salida</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Seleccionar cliente...</option>
                    <option value="1">Constructora ABC S.A.</option>
                    <option value="2">Vidrios del Norte</option>
                    <option value="3">Juan Pérez Construcciones</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Almacén Origen *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Seleccionar almacén...</option>
                    <option value="1">Almacén General</option>
                    <option value="2">Almacén Sucursal Norte</option>
                    <option value="3">Almacén Sucursal Sur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Salida *
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Factura Relacionada
                  </label>
                  <input
                    type="text"
                    placeholder="FAC-001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Productos a Entregar</h4>
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
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Stock</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Cantidad</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Precio Unit.</th>
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
                        <td className="py-3 px-4 text-sm text-gray-600">125 M2</td>
                        <td className="py-3 px-4">
                          <input
                            type="number"
                            placeholder="0"
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
                  placeholder="Observaciones adicionales..."
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
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Guardar Salida
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotasSalida;