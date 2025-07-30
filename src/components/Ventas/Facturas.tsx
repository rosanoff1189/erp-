import React, { useState } from 'react';
import { FileText, Plus, Eye, Download, Send, Search, Filter } from 'lucide-react';

const Facturas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const facturas = [
    {
      id: 1,
      folio: 'FAC-2024-0156',
      serie: 'A',
      fecha: '2024-01-15',
      cliente: 'Constructora ABC S.A. de C.V.',
      rfc: 'CABC123456789',
      total: 45680.00,
      subtotal: 39379.31,
      iva: 6300.69,
      status: 'Timbrada',
      metodoPago: 'PUE',
      formaPago: '03',
      uuid: '12345678-1234-1234-1234-123456789012',
      vendedor: 'Carlos López',
      observaciones: 'Entrega en obra'
    },
    {
      id: 2,
      folio: 'FAC-2024-0157',
      serie: 'A',
      fecha: '2024-01-16',
      cliente: 'Vidrios del Norte S.A.',
      rfc: 'VNO890123456',
      total: 32150.00,
      subtotal: 27715.52,
      iva: 4434.48,
      status: 'Pendiente',
      metodoPago: 'PPD',
      formaPago: '04',
      uuid: null,
      vendedor: 'Ana Martínez',
      observaciones: 'Cliente solicita factura a 30 días'
    },
    {
      id: 3,
      folio: 'FAC-2024-0158',
      serie: 'A',
      fecha: '2024-01-17',
      cliente: 'Juan Pérez Construcciones',
      rfc: 'PEXJ850429AB1',
      total: 18920.00,
      subtotal: 16310.34,
      iva: 2609.66,
      status: 'Timbrada',
      metodoPago: 'PUE',
      formaPago: '01',
      uuid: '87654321-4321-4321-4321-210987654321',
      vendedor: 'José García',
      observaciones: 'Pago de contado'
    }
  ];

  const filteredFacturas = facturas.filter(factura => {
    const matchesSearch = 
      factura.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.rfc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || factura.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Timbrada':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTimbrar = (facturaId: number) => {
    alert(`Timbrando factura ID: ${facturaId}`);
    // Aquí iría la lógica de integración con el PAC
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Facturas Electrónicas</h3>
              <p className="text-sm text-gray-600">Gestión de CFDI 4.0 con timbrado SAT</p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Factura</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar facturas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="Timbrada">Timbradas</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Cancelada">Canceladas</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Facturas</p>
            <p className="text-2xl font-bold text-blue-900">{facturas.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Timbradas</p>
            <p className="text-2xl font-bold text-green-900">
              {facturas.filter(f => f.status === 'Timbrada').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-900">
              {facturas.filter(f => f.status === 'Pendiente').length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Facturación Total</p>
            <p className="text-2xl font-bold text-purple-900">
              ${facturas.reduce((sum, f) => sum + f.total, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Folio</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Cliente</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Vendedor</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacturas.map((factura) => (
                <tr key={factura.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-mono font-medium">{factura.folio}</p>
                      {factura.uuid && (
                        <p className="text-xs text-gray-500 font-mono">{factura.uuid.substring(0, 8)}...</p>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{factura.fecha}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{factura.cliente}</p>
                      <p className="text-sm text-gray-500 font-mono">{factura.rfc}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-bold">${factura.total.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">
                        {factura.metodoPago} - {factura.formaPago}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(factura.status)}`}>
                      {factura.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{factura.vendedor}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Ver detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {factura.status === 'Timbrada' && (
                        <>
                          <button
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Descargar PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-purple-600 hover:text-purple-800"
                            title="Enviar por correo"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {factura.status === 'Pendiente' && (
                        <button
                          onClick={() => handleTimbrar(factura.id)}
                          className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                        >
                          Timbrar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Mostrando {filteredFacturas.length} de {facturas.length} facturas
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Anterior
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modal Nueva Factura */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Nueva Factura Electrónica</h3>
            </div>
            <div className="p-6">
              {/* Datos del Cliente */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Datos del Cliente</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Uso de CFDI *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="G03">G03 - Gastos en general</option>
                      <option value="G01">G01 - Adquisición de mercancías</option>
                      <option value="P01">P01 - Por definir</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Método de Pago *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="PUE">PUE - Pago en una sola exhibición</option>
                      <option value="PPD">PPD - Pago en parcialidades o diferido</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Forma de Pago *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="01">01 - Efectivo</option>
                      <option value="03">03 - Transferencia electrónica</option>
                      <option value="04">04 - Tarjeta de crédito</option>
                      <option value="28">28 - Tarjeta de débito</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Productos */}
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
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Clave SAT</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Cantidad</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Precio Unit.</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Descuento</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Importe</th>
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
                            type="text"
                            placeholder="43211701"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
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

              {/* Totales */}
              <div className="mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
                    <div></div>
                    <div></div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IVA (16%):</span>
                        <span className="font-medium">$0.00</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>$0.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observaciones */}
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Guardar Factura
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Guardar y Timbrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Facturas;