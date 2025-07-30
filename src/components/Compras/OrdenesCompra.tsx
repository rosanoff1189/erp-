import React, { useState } from 'react';
import { FileText, Plus, Eye, Check, X, Search } from 'lucide-react';

const OrdenesCompra: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const ordenesCompra = [
    {
      id: 1,
      folio: 'OC-2024-001',
      fecha: '2024-01-10',
      fechaEntrega: '2024-01-20',
      proveedor: 'Aluminios Industriales S.A.',
      contacto: 'Ing. María López',
      total: 125430.50,
      status: 'Aprobada',
      items: 5,
      observaciones: 'Entrega en almacén general',
      comprador: 'Juan Pérez'
    },
    {
      id: 2,
      folio: 'OC-2024-002',
      fecha: '2024-01-12',
      fechaEntrega: '2024-01-25',
      proveedor: 'Vidrios del Bajío',
      contacto: 'Lic. Carlos Ramírez',
      total: 89750.00,
      status: 'Pendiente',
      items: 3,
      observaciones: 'Verificar especificaciones técnicas',
      comprador: 'María García'
    },
    {
      id: 3,
      folio: 'OC-2024-003',
      fecha: '2024-01-15',
      fechaEntrega: '2024-01-30',
      proveedor: 'Herrajes Premium',
      contacto: 'Sr. Jorge Mendoza',
      total: 45200.00,
      status: 'Recibida',
      items: 8,
      observaciones: 'Orden completamente recibida',
      comprador: 'Carlos Silva'
    }
  ];

  const filteredOrdenes = ordenesCompra.filter(orden => {
    const matchesSearch = 
      orden.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.comprador.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || orden.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprobada':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Recibida':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isUrgente = (fechaEntrega: string) => {
    const hoy = new Date();
    const entrega = new Date(fechaEntrega);
    const diffTime = entrega.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Órdenes de Compra</h3>
              <p className="text-sm text-gray-600">Gestión de órdenes de compra a proveedores</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Nueva Orden</span>
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
              placeholder="Buscar órdenes de compra..."
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
            <option value="Pendiente">Pendientes</option>
            <option value="Aprobada">Aprobadas</option>
            <option value="Recibida">Recibidas</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Órdenes</p>
            <p className="text-2xl font-bold text-blue-900">{ordenesCompra.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-900">
              {ordenesCompra.filter(o => o.status === 'Pendiente').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Aprobadas</p>
            <p className="text-2xl font-bold text-green-900">
              {ordenesCompra.filter(o => o.status === 'Aprobada').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Urgentes</p>
            <p className="text-2xl font-bold text-red-900">
              {ordenesCompra.filter(o => isUrgente(o.fechaEntrega)).length}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredOrdenes.map((orden) => (
            <div key={orden.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{orden.folio}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(orden.status)}`}>
                      {orden.status}
                    </span>
                    {isUrgente(orden.fechaEntrega) && orden.status !== 'Recibida' && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        ⚠️ Urgente
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{orden.fecha}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  {orden.status === 'Pendiente' && (
                    <>
                      <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors">
                        <Check className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Proveedor:</span>
                  <span className="font-medium">{orden.proveedor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Contacto:</span>
                  <span className="font-medium">{orden.contacto}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Comprador:</span>
                  <span className="font-medium">{orden.comprador}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Entrega:</span>
                  <span className={`font-medium ${
                    isUrgente(orden.fechaEntrega) ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {orden.fechaEntrega}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{orden.items} productos</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="text-xs text-gray-500 mb-1">Observaciones:</p>
                <p className="text-sm text-gray-700">{orden.observaciones}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total:</p>
                  <p className="text-lg font-bold text-blue-600">${orden.total.toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  {orden.status === 'Pendiente' && (
                    <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                      Aprobar
                    </button>
                  )}
                  {orden.status === 'Aprobada' && (
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      Recibir
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

        {/* Timeline de Entregas */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Próximas Entregas</h4>
          <div className="space-y-3">
            {ordenesCompra
              .filter(o => o.status === 'Aprobada')
              .sort((a, b) => new Date(a.fechaEntrega).getTime() - new Date(b.fechaEntrega).getTime())
              .map((orden) => (
                <div key={orden.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      isUrgente(orden.fechaEntrega) ? 'bg-red-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <span className="font-medium">{orden.folio}</span>
                      <span className="text-gray-600 ml-2">- {orden.proveedor}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{orden.fechaEntrega}</p>
                    <p className="text-xs text-gray-500">${orden.total.toLocaleString()}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdenesCompra;