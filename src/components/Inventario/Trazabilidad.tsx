import React, { useState } from 'react';
import { RotateCcw, Search, Package, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

const Trazabilidad: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  const productos = [
    { id: 1, codigo: 'VT-6MM-001', nombre: 'Vidrio Templado 6mm' },
    { id: 2, codigo: 'AL-NAT-001', nombre: 'Perfil Aluminio Natural' },
    { id: 3, codigo: 'VL-8MM-001', nombre: 'Vidrio Laminado 8mm' }
  ];

  const trazabilidad = [
    {
      id: 1,
      fecha: '2024-01-10 08:30',
      tipo: 'Entrada',
      documento: 'NE-001',
      cantidad: 100,
      saldoAnterior: 25,
      saldoNuevo: 125,
      origen: 'Compra - Aluminios Industriales S.A.',
      destino: 'Almacén General',
      lote: 'LT-2024-001',
      usuario: 'Juan Pérez',
      observaciones: 'Recepción según OC-089'
    },
    {
      id: 2,
      fecha: '2024-01-12 14:15',
      tipo: 'Salida',
      documento: 'NS-045',
      cantidad: -15,
      saldoAnterior: 125,
      saldoNuevo: 110,
      origen: 'Almacén General',
      destino: 'Cliente - Constructora ABC',
      lote: 'LT-2024-001',
      usuario: 'María López',
      observaciones: 'Entrega según FAC-123'
    },
    {
      id: 3,
      fecha: '2024-01-15 10:45',
      tipo: 'Salida',
      documento: 'NS-089',
      cantidad: -25,
      saldoAnterior: 110,
      saldoNuevo: 85,
      origen: 'Almacén General',
      destino: 'Cliente - Vidrios del Norte',
      lote: 'LT-2024-001',
      usuario: 'Carlos Silva',
      observaciones: 'Entrega según FAC-156'
    },
    {
      id: 4,
      fecha: '2024-01-16 16:20',
      tipo: 'Transferencia',
      documento: 'TR-012',
      cantidad: -20,
      saldoAnterior: 85,
      saldoNuevo: 65,
      origen: 'Almacén General',
      destino: 'Almacén Sucursal Norte',
      lote: 'LT-2024-001',
      usuario: 'Ana García',
      observaciones: 'Transferencia entre sucursales'
    },
    {
      id: 5,
      fecha: '2024-01-17 09:10',
      tipo: 'Ajuste',
      documento: 'AJ-005',
      cantidad: -5,
      saldoAnterior: 65,
      saldoNuevo: 60,
      origen: 'Almacén General',
      destino: 'Ajuste por Merma',
      lote: 'LT-2024-001',
      usuario: 'Juan Pérez',
      observaciones: 'Ajuste por producto dañado'
    }
  ];

  const lotes = [
    {
      lote: 'LT-2024-001',
      fechaIngreso: '2024-01-10',
      proveedor: 'Aluminios Industriales S.A.',
      cantidadInicial: 100,
      cantidadActual: 60,
      status: 'Activo'
    },
    {
      lote: 'LT-2023-089',
      fechaIngreso: '2023-12-15',
      proveedor: 'Aluminios Industriales S.A.',
      cantidadInicial: 150,
      cantidadActual: 0,
      status: 'Agotado'
    }
  ];

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Entrada':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'Salida':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'Transferencia':
        return <ArrowRight className="w-4 h-4 text-blue-600" />;
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
          <RotateCcw className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trazabilidad de Productos</h3>
            <p className="text-sm text-gray-600">Seguimiento completo de movimientos por producto y lote</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Producto
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los productos</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.codigo}>
                  {producto.codigo} - {producto.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar en Movimientos
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por documento, lote, usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Información de Lotes */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Lotes Disponibles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lotes.map((lote, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900">{lote.lote}</h5>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    lote.status === 'Activo' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {lote.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Fecha Ingreso: {lote.fechaIngreso}</p>
                  <p>Proveedor: {lote.proveedor}</p>
                  <p>Cantidad: {lote.cantidadActual} / {lote.cantidadInicial}</p>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(lote.cantidadActual / lote.cantidadInicial) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historial de Movimientos */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Historial de Movimientos</h4>
          <div className="space-y-3">
            {trazabilidad.map((movimiento) => (
              <div key={movimiento.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getTipoIcon(movimiento.tipo)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(movimiento.tipo)}`}>
                          {movimiento.tipo}
                        </span>
                        <span className="font-mono text-sm text-gray-600">{movimiento.documento}</span>
                      </div>
                      <p className="text-sm text-gray-500">{movimiento.fecha}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      movimiento.cantidad > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {movimiento.cantidad > 0 ? '+' : ''}{movimiento.cantidad} M2
                    </p>
                    <p className="text-sm text-gray-500">
                      Saldo: {movimiento.saldoAnterior} → {movimiento.saldoNuevo}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Origen:</p>
                    <p className="text-sm font-medium">{movimiento.origen}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Destino:</p>
                    <p className="text-sm font-medium">{movimiento.destino}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">Lote: <span className="font-mono">{movimiento.lote}</span></span>
                    <span className="text-gray-500">Usuario: {movimiento.usuario}</span>
                  </div>
                </div>

                {movimiento.observaciones && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                    {movimiento.observaciones}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resumen */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">Resumen de Trazabilidad</h5>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-blue-600">Total Entradas:</p>
              <p className="font-bold text-blue-900">
                {trazabilidad.filter(m => m.tipo === 'Entrada').reduce((sum, m) => sum + m.cantidad, 0)} M2
              </p>
            </div>
            <div>
              <p className="text-blue-600">Total Salidas:</p>
              <p className="font-bold text-blue-900">
                {Math.abs(trazabilidad.filter(m => m.tipo === 'Salida').reduce((sum, m) => sum + m.cantidad, 0))} M2
              </p>
            </div>
            <div>
              <p className="text-blue-600">Transferencias:</p>
              <p className="font-bold text-blue-900">
                {Math.abs(trazabilidad.filter(m => m.tipo === 'Transferencia').reduce((sum, m) => sum + m.cantidad, 0))} M2
              </p>
            </div>
            <div>
              <p className="text-blue-600">Stock Actual:</p>
              <p className="font-bold text-blue-900">60 M2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trazabilidad;