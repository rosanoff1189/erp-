import React, { useState } from 'react';
import { ArrowRightLeft, Search, Filter, TrendingUp, TrendingDown, Package } from 'lucide-react';

const MovimientosInventario: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('all');

  const movimientos = [
    {
      id: 1,
      fecha: '2024-01-15 14:30',
      tipo: 'Entrada',
      documento: 'NE-001',
      producto: 'Vidrio Templado 6mm',
      cantidad: 50,
      unidad: 'M2',
      origen: 'Compra a Proveedor',
      destino: 'Almacén General',
      usuario: 'Juan Pérez',
      observaciones: 'Recepción de mercancía'
    },
    {
      id: 2,
      fecha: '2024-01-15 16:45',
      tipo: 'Salida',
      documento: 'NS-089',
      producto: 'Perfil Aluminio Natural',
      cantidad: 25,
      unidad: 'PZA',
      origen: 'Almacén General',
      destino: 'Obra Cliente ABC',
      usuario: 'María López',
      observaciones: 'Entrega según factura FAC-156'
    },
    {
      id: 3,
      fecha: '2024-01-16 09:15',
      tipo: 'Ajuste',
      documento: 'AJ-023',
      producto: 'Vidrio Laminado 8mm',
      cantidad: -5,
      unidad: 'M2',
      origen: 'Almacén General',
      destino: 'Ajuste por Merma',
      usuario: 'Carlos Silva',
      observaciones: 'Ajuste por producto dañado'
    },
    {
      id: 4,
      fecha: '2024-01-16 11:30',
      tipo: 'Transferencia',
      documento: 'TR-012',
      producto: 'Herrajes Premium',
      cantidad: 100,
      unidad: 'PZA',
      origen: 'Almacén Matriz',
      destino: 'Sucursal Norte',
      usuario: 'Ana García',
      observaciones: 'Transferencia entre sucursales'
    }
  ];

  const filteredMovimientos = movimientos.filter(mov => {
    const matchesSearch = 
      mov.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.usuario.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTipo === 'all' || mov.tipo === filterTipo;
    return matchesSearch && matchesFilter;
  });

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Entrada':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'Salida':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'Transferencia':
        return <ArrowRightLeft className="w-4 h-4 text-blue-600" />;
      default:
        return <Package className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Entrada':
        return 'bg-green-100 text-green-800';
      case 'Salida':
        return 'bg-red-100 text-red-800';
      case 'Transferencia':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <ArrowRightLeft className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Movimientos de Inventario</h3>
            <p className="text-sm text-gray-600">Historial completo de movimientos de almacén</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar movimientos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los tipos</option>
            <option value="Entrada">Entradas</option>
            <option value="Salida">Salidas</option>
            <option value="Transferencia">Transferencias</option>
            <option value="Ajuste">Ajustes</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-green-600 font-medium">Entradas Hoy</p>
                <p className="text-xl font-bold text-green-900">12</p>
              </div>
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingDown className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-red-600 font-medium">Salidas Hoy</p>
                <p className="text-xl font-bold text-red-900">8</p>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <ArrowRightLeft className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Transferencias</p>
                <p className="text-xl font-bold text-blue-900">3</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-yellow-600 font-medium">Ajustes</p>
                <p className="text-xl font-bold text-yellow-900">2</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha/Hora</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Tipo</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Documento</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Producto</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Cantidad</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Movimiento</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Usuario</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovimientos.map((movimiento) => (
                <tr key={movimiento.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm">{movimiento.fecha}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getTipoIcon(movimiento.tipo)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(movimiento.tipo)}`}>
                        {movimiento.tipo}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">{movimiento.documento}</td>
                  <td className="py-3 px-4 font-medium">{movimiento.producto}</td>
                  <td className="py-3 px-4">
                    <div className={`font-medium ${
                      movimiento.cantidad > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movimiento.cantidad > 0 ? '+' : ''}{movimiento.cantidad} {movimiento.unidad}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <p className="text-gray-600">De: {movimiento.origen}</p>
                      <p className="text-gray-600">A: {movimiento.destino}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{movimiento.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Mostrando {filteredMovimientos.length} de {movimientos.length} movimientos
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
    </div>
  );
};

export default MovimientosInventario;