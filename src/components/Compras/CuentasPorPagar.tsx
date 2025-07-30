import React, { useState } from 'react';
import { DollarSign, Search, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const CuentasPorPagar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const cuentasPorPagar = [
    {
      id: 1,
      proveedor: 'Aluminios Industriales S.A.',
      rfc: 'AIN123456789',
      facturas: [
        {
          folio: 'PROV-A-001',
          fecha: '2024-01-15',
          vencimiento: '2024-02-14',
          total: 125430.50,
          saldoPendiente: 125430.50,
          diasVencido: 0,
          status: 'Vigente',
          ordenCompra: 'OC-2024-001'
        },
        {
          folio: 'PROV-A-002',
          fecha: '2023-12-20',
          vencimiento: '2024-01-19',
          total: 89750.00,
          saldoPendiente: 89750.00,
          diasVencido: 12,
          status: 'Vencida',
          ordenCompra: 'OC-2023-089'
        }
      ],
      saldoTotal: 215180.50,
      limiteCredito: 300000.00,
      comprador: 'Juan Pérez'
    },
    {
      id: 2,
      proveedor: 'Vidrios del Bajío',
      rfc: 'VCB890123456',
      facturas: [
        {
          folio: 'PROV-B-045',
          fecha: '2024-01-16',
          vencimiento: '2024-02-15',
          total: 67500.00,
          saldoPendiente: 30000.00,
          diasVencido: 0,
          status: 'Parcial',
          ordenCompra: 'OC-2024-002'
        }
      ],
      saldoTotal: 30000.00,
      limiteCredito: 150000.00,
      comprador: 'María García'
    },
    {
      id: 3,
      proveedor: 'Herrajes Premium',
      rfc: 'HAP850429AB1',
      facturas: [
        {
          folio: 'PROV-C-123',
          fecha: '2024-01-17',
          vencimiento: '2024-02-16',
          total: 45200.00,
          saldoPendiente: 0.00,
          diasVencido: 0,
          status: 'Pagada',
          ordenCompra: 'OC-2024-003'
        }
      ],
      saldoTotal: 0.00,
      limiteCredito: 100000.00,
      comprador: 'Carlos Silva'
    }
  ];

  const filteredCuentas = cuentasPorPagar.filter(cuenta => {
    const matchesSearch = 
      cuenta.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuenta.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuenta.comprador.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  const totalPorPagar = cuentasPorPagar.reduce((sum, cuenta) => sum + cuenta.saldoTotal, 0);
  const facturasPendientes = cuentasPorPagar.reduce((sum, cuenta) => 
    sum + cuenta.facturas.filter(f => f.saldoPendiente > 0).length, 0);
  const facturasVencidas = cuentasPorPagar.reduce((sum, cuenta) => 
    sum + cuenta.facturas.filter(f => f.status === 'Vencida').length, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <DollarSign className="w-6 h-6 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cuentas por Pagar</h3>
            <p className="text-sm text-gray-600">Gestión de pagos a proveedores</p>
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
              placeholder="Buscar proveedores..."
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
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Total por Pagar</p>
            <p className="text-2xl font-bold text-red-900">${totalPorPagar.toLocaleString()}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Facturas Pendientes</p>
            <p className="text-2xl font-bold text-blue-900">{facturasPendientes}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Facturas Vencidas</p>
            <p className="text-2xl font-bold text-yellow-900">{facturasVencidas}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Proveedores con Saldo</p>
            <p className="text-2xl font-bold text-green-900">
              {cuentasPorPagar.filter(c => c.saldoTotal > 0).length}
            </p>
          </div>
        </div>

        {/* Cuentas por Proveedor */}
        <div className="space-y-6">
          {filteredCuentas.map((cuenta) => (
            <div key={cuenta.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{cuenta.proveedor}</h4>
                  <p className="text-sm text-gray-600 font-mono">{cuenta.rfc}</p>
                  <p className="text-sm text-gray-600">Comprador: {cuenta.comprador}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Saldo Total:</p>
                  <p className="text-xl font-bold text-red-600">${cuenta.saldoTotal.toLocaleString()}</p>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Límite de Crédito:</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (cuenta.saldoTotal / cuenta.limiteCredito) * 100 > 80 
                              ? 'bg-red-500' 
                              : (cuenta.saldoTotal / cuenta.limiteCredito) * 100 > 60
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${(cuenta.saldoTotal / cuenta.limiteCredito) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        ${cuenta.limiteCredito.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Facturas del Proveedor */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-900">Factura</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-900">Fecha</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-900">Vencimiento</th>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-900">OC</th>
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
                        <td className="py-2 px-3 font-mono text-sm">{factura.ordenCompra}</td>
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
                              <button className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                                Pagar
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
          <h4 className="font-semibold text-gray-900 mb-4">Antigüedad de Saldos por Pagar</h4>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Por Vencer</p>
              <p className="text-lg font-bold text-green-600">$155,430</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">1-30 días</p>
              <p className="text-lg font-bold text-yellow-600">$89,750</p>
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

        {/* Alertas de Pagos */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Facturas Vencidas</p>
              <p className="text-sm text-red-700">
                {facturasVencidas} facturas requieren pago inmediato
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <Calendar className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900">Próximos Vencimientos</p>
              <p className="text-sm text-yellow-700">
                1 factura vence en los próximos 7 días
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuentasPorPagar;