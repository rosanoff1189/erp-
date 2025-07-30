import React, { useState } from 'react';
import { DollarSign, Search, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const CuentasPorCobrar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const cuentasPorCobrar = [
    {
      id: 1,
      cliente: 'Constructora ABC S.A. de C.V.',
      rfc: 'CABC123456789',
      facturas: [
        {
          folio: 'FAC-2024-0156',
          fecha: '2024-01-15',
          vencimiento: '2024-02-14',
          total: 45680.00,
          saldoPendiente: 45680.00,
          diasVencido: 0,
          status: 'Vigente'
        },
        {
          folio: 'FAC-2024-0120',
          fecha: '2023-12-20',
          vencimiento: '2024-01-19',
          total: 32150.00,
          saldoPendiente: 32150.00,
          diasVencido: 12,
          status: 'Vencida'
        }
      ],
      saldoTotal: 77830.00,
      limiteCredito: 100000.00,
      vendedor: 'Carlos López'
    },
    {
      id: 2,
      cliente: 'Vidrios del Norte S.A.',
      rfc: 'VNO890123456',
      facturas: [
        {
          folio: 'FAC-2024-0157',
          fecha: '2024-01-16',
          vencimiento: '2024-02-15',
          total: 89750.00,
          saldoPendiente: 45000.00,
          diasVencido: 0,
          status: 'Parcial'
        }
      ],
      saldoTotal: 45000.00,
      limiteCredito: 150000.00,
      vendedor: 'Ana Martínez'
    },
    {
      id: 3,
      cliente: 'Juan Pérez Construcciones',
      rfc: 'PEXJ850429AB1',
      facturas: [
        {
          folio: 'FAC-2024-0158',
          fecha: '2024-01-17',
          vencimiento: '2024-02-16',
          total: 18920.00,
          saldoPendiente: 0.00,
          diasVencido: 0,
          status: 'Pagada'
        }
      ],
      saldoTotal: 0.00,
      limiteCredito: 50000.00,
      vendedor: 'José García'
    }
  ];

  const filteredCuentas = cuentasPorCobrar.filter(cuenta => {
    const matchesSearch = 
      cuenta.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuenta.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuenta.vendedor.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === 'vigentes') {
      matchesFilter = cuenta.facturas.some(f => f.status === 'Vigente');
    } else if (filterStatus === 'vencidas') {
      matchesFilter = cuenta.facturas.some(f => f.status === 'Vencida');
    } else if (filterStatus === 'pagadas') {
      matchesFilter = cuenta.facturas.some(f => f.status === 'Pagada');
    }
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Vigente':
        return 'bg-blue-100 text-blue-800';
      case 'Vencida':
        return 'bg-red-100 text-red-800';
      case 'Parcial':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pagada':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDiasVencidoColor = (dias: number) => {
    if (dias === 0) return 'text-green-600';
    if (dias <= 30) return 'text-yellow-600';
    if (dias <= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCreditoUtilizado = (saldo: number, limite: number) => {
    return limite > 0 ? (saldo / limite) * 100 : 0;
  };

  const totalCartera = cuentasPorCobrar.reduce((sum, cuenta) => sum + cuenta.saldoTotal, 0);
  const facturasPendientes = cuentasPorCobrar.reduce((sum, cuenta) => 
    sum + cuenta.facturas.filter(f => f.saldoPendiente > 0).length, 0);
  const facturasVencidas = cuentasPorCobrar.reduce((sum, cuenta) => 
    sum + cuenta.facturas.filter(f => f.status === 'Vencida').length, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cuentas por Cobrar</h3>
            <p className="text-sm text-gray-600">Gestión de cartera y cobranza</p>
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
              placeholder="Buscar clientes..."
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
            <option value="vigentes">Vigentes</option>
            <option value="vencidas">Vencidas</option>
            <option value="pagadas">Pagadas</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Cartera Total</p>
            <p className="text-2xl font-bold text-green-900">${totalCartera.toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Facturas Pendientes</p>
            <p className="text-2xl font-bold text-blue-900">{facturasPendientes}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Facturas Vencidas</p>
            <p className="text-2xl font-bold text-red-900">{facturasVencidas}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Clientes con Saldo</p>
            <p className="text-2xl font-bold text-yellow-900">
              {cuentasPorCobrar.filter(c => c.saldoTotal > 0).length}
            </p>
          </div>
        </div>

        {/* Cuentas por Cliente */}
        <div className="space-y-6">
          {filteredCuentas.map((cuenta) => (
            <div key={cuenta.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{cuenta.cliente}</h4>
                  <p className="text-sm text-gray-600 font-mono">{cuenta.rfc}</p>
                  <p className="text-sm text-gray-600">Vendedor: {cuenta.vendedor}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Saldo Total:</p>
                  <p className="text-xl font-bold text-green-600">${cuenta.saldoTotal.toLocaleString()}</p>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Límite de Crédito:</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            getCreditoUtilizado(cuenta.saldoTotal, cuenta.limiteCredito) > 80 
                              ? 'bg-red-500' 
                              : getCreditoUtilizado(cuenta.saldoTotal, cuenta.limiteCredito) > 60
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${getCreditoUtilizado(cuenta.saldoTotal, cuenta.limiteCredito)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        ${cuenta.limiteCredito.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Facturas del Cliente */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-900">Factura</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-900">Fecha</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-900">Vencimiento</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-900">Total</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-900">Saldo</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-900">Días</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-900">Status</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-900">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuenta.facturas.map((factura, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-2 px-3 font-mono text-sm">{factura.folio}</td>
                        <td className="py-2 px-3 text-sm">{factura.fecha}</td>
                        <td className="py-2 px-3 text-sm">{factura.vencimiento}</td>
                        <td className="py-2 px-3 text-sm font-medium">${factura.total.toLocaleString()}</td>
                        <td className="py-2 px-3 text-sm font-bold">
                          ${factura.saldoPendiente.toLocaleString()}
                        </td>
                        <td className="py-2 px-3 text-sm">
                          <span className={`font-medium ${getDiasVencidoColor(factura.diasVencido)}`}>
                            {factura.diasVencido === 0 ? 'Vigente' : `${factura.diasVencido} días`}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(factura.status)}`}>
                            {factura.status}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex space-x-1">
                            {factura.saldoPendiente > 0 && (
                              <button className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                                Cobrar
                              </button>
                            )}
                            <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                              Ver
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen de Antigüedad de Saldos */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Antigüedad de Saldos</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Por Vencer</p>
              <p className="text-lg font-bold text-green-600">$45,680</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">1-30 días</p>
              <p className="text-lg font-bold text-yellow-600">$32,150</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">31-60 días</p>
              <p className="text-lg font-bold text-orange-600">$0</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">61-90 días</p>
              <p className="text-lg font-bold text-red-600">$0</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">+90 días</p>
              <p className="text-lg font-bold text-red-800">$0</p>
            </div>
          </div>
        </div>

        {/* Alertas de Cobranza */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Facturas Vencidas</p>
              <p className="text-sm text-red-700">
                {facturasVencidas} facturas requieren seguimiento de cobranza
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <Calendar className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900">Próximos Vencimientos</p>
              <p className="text-sm text-yellow-700">
                2 facturas vencen en los próximos 7 días
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuentasPorCobrar;