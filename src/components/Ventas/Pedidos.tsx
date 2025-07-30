import React, { useState } from 'react';
import { ShoppingCart, Plus, Eye, FileText, Truck, Search } from 'lucide-react';

const Pedidos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const pedidos = [
    {
      id: 1,
      folio: 'PED-2024-001',
      fecha: '2024-01-15',
      fechaEntrega: '2024-01-20',
      cliente: 'Constructora ABC S.A. de C.V.',
      vendedor: 'Carlos López',
      total: 45680.00,
      status: 'Confirmado',
      items: 3,
      observaciones: 'Entrega en obra, horario 8-12 hrs',
      prioridad: 'Alta'
    },
    {
      id: 2,
      folio: 'PED-2024-002',
      fecha: '2024-01-16',
      fechaEntrega: '2024-01-22',
      cliente: 'Vidrios del Norte S.A.',
      vendedor: 'Ana Martínez',
      total: 32150.00,
      status: 'En Producción',
      items: 2,
      observaciones: 'Vidrio especial, verificar medidas',
      prioridad: 'Media'
    },
    {
      id: 3,
      folio: 'PED-2024-003',
      fecha: '2024-01-17',
      fechaEntrega: '2024-01-25',
      cliente: 'Juan Pérez Construcciones',
      vendedor: 'José García',
      total: 18920.00,
      status: 'Listo para Envío',
      items: 5,
      observaciones: 'Cliente recogerá en almacén',
      prioridad: 'Baja'
    }
  ];

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = 
      pedido.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.vendedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || pedido.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmado':
        return 'bg-blue-100 text-blue-800';
      case 'En Producción':
        return 'bg-yellow-100 text-yellow-800';
      case 'Listo para Envío':
        return 'bg-green-100 text-green-800';
      case 'Entregado':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case 'Alta':
        return 'bg-red-100 text-red-800';
      case 'Media':
        return 'bg-yellow-100 text-yellow-800';
      case 'Baja':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isUrgente = (fechaEntrega: string) => {
    const hoy = new Date();
    const entrega = new Date(fechaEntrega);
    const diffTime = entrega.getTime() - hoy.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pedidos</h3>
              <p className="text-sm text-gray-600">Gestión de órdenes de venta y producción</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Nuevo Pedido</span>
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
              placeholder="Buscar pedidos..."
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
            <option value="Confirmado">Confirmados</option>
            <option value="En Producción">En Producción</option>
            <option value="Listo para Envío">Listos para Envío</option>
            <option value="Entregado">Entregados</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Pedidos</p>
            <p className="text-2xl font-bold text-blue-900">{pedidos.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">En Producción</p>
            <p className="text-2xl font-bold text-yellow-900">
              {pedidos.filter(p => p.status === 'En Producción').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Listos</p>
            <p className="text-2xl font-bold text-green-900">
              {pedidos.filter(p => p.status === 'Listo para Envío').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Urgentes</p>
            <p className="text-2xl font-bold text-red-900">
              {pedidos.filter(p => isUrgente(p.fechaEntrega)).length}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPedidos.map((pedido) => (
            <div key={pedido.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{pedido.folio}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(pedido.status)}`}>
                      {pedido.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPrioridadColor(pedido.prioridad)}`}>
                      {pedido.prioridad}
                    </span>
                    {isUrgente(pedido.fechaEntrega) && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        ⚠️ Urgente
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{pedido.fecha}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors">
                    <FileText className="w-4 h-4" />
                  </button>
                  {pedido.status === 'Listo para Envío' && (
                    <button className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors">
                      <Truck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cliente:</span>
                  <span className="font-medium">{pedido.cliente}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Vendedor:</span>
                  <span className="font-medium">{pedido.vendedor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Entrega:</span>
                  <span className={`font-medium ${
                    isUrgente(pedido.fechaEntrega) ? 'text-red-600' : 'text-gray-900'
                  }`}>
                    {pedido.fechaEntrega}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{pedido.items} productos</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <p className="text-xs text-gray-500 mb-1">Observaciones:</p>
                <p className="text-sm text-gray-700">{pedido.observaciones}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total:</p>
                  <p className="text-lg font-bold text-blue-600">${pedido.total.toLocaleString()}</p>
                </div>
                <div className="flex space-x-2">
                  {pedido.status === 'Confirmado' && (
                    <button className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors">
                      Iniciar Producción
                    </button>
                  )}
                  {pedido.status === 'En Producción' && (
                    <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                      Marcar Listo
                    </button>
                  )}
                  {pedido.status === 'Listo para Envío' && (
                    <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                      Generar Factura
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline de Producción */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Timeline de Producción</h4>
          <div className="space-y-3">
            {pedidos.filter(p => p.status !== 'Entregado').map((pedido, index) => (
              <div key={pedido.id} className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  pedido.status === 'Confirmado' ? 'bg-blue-500' :
                  pedido.status === 'En Producción' ? 'bg-yellow-500' :
                  pedido.status === 'Listo para Envío' ? 'bg-green-500' : 'bg-gray-300'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{pedido.folio} - {pedido.cliente}</span>
                    <span className="text-sm text-gray-600">{pedido.fechaEntrega}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        pedido.status === 'Confirmado' ? 'bg-blue-500 w-1/3' :
                        pedido.status === 'En Producción' ? 'bg-yellow-500 w-2/3' :
                        pedido.status === 'Listo para Envío' ? 'bg-green-500 w-full' : 'bg-gray-300 w-0'
                      }`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pedidos;