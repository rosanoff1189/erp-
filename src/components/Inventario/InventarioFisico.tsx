import React, { useState } from 'react';
import { FileCheck, Plus, Search, Download, Upload } from 'lucide-react';

const InventarioFisico: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const inventarios = [
    {
      id: 1,
      folio: 'IF-2024-001',
      fecha: '2024-01-15',
      almacen: 'Almacén General',
      responsable: 'Juan Pérez',
      status: 'Completado',
      productos: 45,
      diferencias: 3,
      valorDiferencia: -2450.00
    },
    {
      id: 2,
      folio: 'IF-2024-002',
      fecha: '2024-01-10',
      almacen: 'Almacén Sucursal Norte',
      responsable: 'María López',
      status: 'En Proceso',
      productos: 32,
      diferencias: 0,
      valorDiferencia: 0.00
    },
    {
      id: 3,
      folio: 'IF-2024-003',
      fecha: '2024-01-05',
      almacen: 'Almacén Sucursal Sur',
      responsable: 'Carlos Silva',
      status: 'Completado',
      productos: 28,
      diferencias: 1,
      valorDiferencia: 850.00
    }
  ];

  const productosConteo = [
    {
      id: 1,
      codigo: 'VT-6MM-001',
      producto: 'Vidrio Templado 6mm',
      stockSistema: 125,
      stockFisico: 123,
      diferencia: -2,
      unidad: 'M2',
      costo: 210.00,
      valorDiferencia: -420.00,
      status: 'Contado'
    },
    {
      id: 2,
      codigo: 'AL-NAT-001',
      producto: 'Perfil Aluminio Natural',
      stockSistema: 320,
      stockFisico: 320,
      diferencia: 0,
      unidad: 'PZA',
      costo: 87.30,
      valorDiferencia: 0.00,
      status: 'Contado'
    },
    {
      id: 3,
      codigo: 'VL-8MM-001',
      producto: 'Vidrio Laminado 8mm',
      stockSistema: 85,
      stockFisico: null,
      diferencia: null,
      unidad: 'M2',
      costo: 312.00,
      valorDiferencia: null,
      status: 'Pendiente'
    }
  ];

  const filteredInventarios = inventarios.filter(inv =>
    inv.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.almacen.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.responsable.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completado':
        return 'bg-green-100 text-green-800';
      case 'En Proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDiferenciaColor = (diferencia: number) => {
    if (diferencia > 0) return 'text-green-600';
    if (diferencia < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileCheck className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Inventario Físico</h3>
              <p className="text-sm text-gray-600">Conteos físicos y ajustes de inventario</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Conteo</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar inventarios físicos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Inventarios</p>
            <p className="text-2xl font-bold text-blue-900">{inventarios.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Completados</p>
            <p className="text-2xl font-bold text-green-900">
              {inventarios.filter(i => i.status === 'Completado').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">En Proceso</p>
            <p className="text-2xl font-bold text-yellow-900">
              {inventarios.filter(i => i.status === 'En Proceso').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Diferencias</p>
            <p className="text-2xl font-bold text-red-900">
              {inventarios.reduce((sum, i) => sum + i.diferencias, 0)}
            </p>
          </div>
        </div>

        {/* Inventarios List */}
        <div className="space-y-4 mb-8">
          {filteredInventarios.map((inventario) => (
            <div key={inventario.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900">{inventario.folio}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inventario.status)}`}>
                        {inventario.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{inventario.fecha} - {inventario.almacen}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    Ver Detalle
                  </button>
                  {inventario.status === 'En Proceso' && (
                    <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                      Continuar
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Responsable:</p>
                  <p className="font-medium">{inventario.responsable}</p>
                </div>
                <div>
                  <p className="text-gray-500">Productos:</p>
                  <p className="font-medium">{inventario.productos}</p>
                </div>
                <div>
                  <p className="text-gray-500">Diferencias:</p>
                  <p className="font-medium">{inventario.diferencias}</p>
                </div>
                <div>
                  <p className="text-gray-500">Valor Diferencia:</p>
                  <p className={`font-medium ${getDiferenciaColor(inventario.valorDiferencia)}`}>
                    ${inventario.valorDiferencia.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Progreso:</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: inventario.status === 'Completado' ? '100%' : '60%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detalle del Conteo Actual */}
        <div className="border-t pt-6">
          <h4 className="font-semibold text-gray-900 mb-4">Detalle del Conteo - IF-2024-001</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Código</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Producto</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Stock Sistema</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Stock Físico</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Diferencia</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Valor Dif.</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {productosConteo.map((producto) => (
                  <tr key={producto.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">{producto.codigo}</td>
                    <td className="py-3 px-4 font-medium">{producto.producto}</td>
                    <td className="py-3 px-4">{producto.stockSistema} {producto.unidad}</td>
                    <td className="py-3 px-4">
                      {producto.stockFisico !== null ? (
                        `${producto.stockFisico} ${producto.unidad}`
                      ) : (
                        <input
                          type="number"
                          placeholder="Contar..."
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {producto.diferencia !== null && (
                        <span className={`font-medium ${getDiferenciaColor(producto.diferencia)}`}>
                          {producto.diferencia > 0 ? '+' : ''}{producto.diferencia}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {producto.valorDiferencia !== null && (
                        <span className={`font-medium ${getDiferenciaColor(producto.valorDiferencia)}`}>
                          ${producto.valorDiferencia.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        producto.status === 'Contado' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {producto.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Nuevo Conteo */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Nuevo Inventario Físico</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Almacén *
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
                    Responsable *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Seleccionar responsable...</option>
                    <option value="1">Juan Pérez</option>
                    <option value="2">María López</option>
                    <option value="3">Carlos Silva</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Conteo *
                  </label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Conteo
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="completo">Conteo Completo</option>
                    <option value="ciclico">Conteo Cíclico</option>
                    <option value="selectivo">Conteo Selectivo</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Observaciones del inventario físico..."
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
                Iniciar Conteo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventarioFisico;