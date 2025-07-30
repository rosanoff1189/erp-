import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, Eye, Save } from 'lucide-react';

const Reportes: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const reportes = [
    {
      id: 'facturacion',
      nombre: 'Reporte de Facturación',
      descripcion: 'Detalle de facturas emitidas por período',
      categoria: 'Ventas'
    },
    {
      id: 'pedidos-cancelados',
      nombre: 'Pedidos Cancelados',
      descripcion: 'Listado de pedidos cancelados con motivos',
      categoria: 'Ventas'
    },
    {
      id: 'lista-precios-cliente',
      nombre: 'Lista de Precios por Cliente',
      descripcion: 'Precios especiales asignados por cliente',
      categoria: 'Ventas'
    },
    {
      id: 'ventas-vendedor',
      nombre: 'Ventas por Vendedor',
      descripcion: 'Comparativo de ventas por vendedor',
      categoria: 'Ventas'
    },
    {
      id: 'clientes-precio-especial',
      nombre: 'Clientes con Precio Especial',
      descripcion: 'Listado de clientes con precios preferenciales',
      categoria: 'Clientes'
    },
    {
      id: 'ventas-generales',
      nombre: 'Ventas Generales',
      descripcion: 'Resumen general de ventas por período',
      categoria: 'Ventas'
    },
    {
      id: 'inventario-movimientos',
      nombre: 'Movimientos de Inventario',
      descripcion: 'Entradas y salidas de productos',
      categoria: 'Inventario'
    },
    {
      id: 'compras-proveedor',
      nombre: 'Compras por Proveedor',
      descripcion: 'Detalle de compras realizadas por proveedor',
      categoria: 'Compras'
    }
  ];

  const handleGenerateReport = () => {
    if (!selectedReport) {
      alert('Por favor seleccione un reporte');
      return;
    }
    setShowPreview(true);
  };

  const handleDownload = (format: string) => {
    alert(`Descargando reporte en formato ${format}`);
  };

  const categorias = [...new Set(reportes.map(r => r.categoria))];

  const sampleData = {
    'facturacion': [
      { folio: 'FAC-001', cliente: 'Constructora ABC', fecha: '2024-01-15', total: '$45,680.00', status: 'Pagada' },
      { folio: 'FAC-002', cliente: 'Vidrios del Norte', fecha: '2024-01-16', total: '$32,150.00', status: 'Pendiente' },
      { folio: 'FAC-003', cliente: 'Aluminios SA', fecha: '2024-01-17', total: '$78,920.00', status: 'Pagada' }
    ],
    'ventas-vendedor': [
      { vendedor: 'Carlos López', ventas: 15, monto: '$325,680.00', comision: '$16,284.00' },
      { vendedor: 'Ana Martínez', ventas: 12, monto: '$289,450.00', comision: '$14,472.50' },
      { vendedor: 'José García', ventas: 18, monto: '$412,380.00', comision: '$20,619.00' }
    ]
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Centro de Reportes</h3>
            <p className="text-sm text-gray-600">Generación y exportación de reportes del sistema</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selector de Reportes */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Reporte
                </label>
                <select
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar...</option>
                  {categorias.map((categoria) => (
                    <optgroup key={categoria} label={categoria}>
                      {reportes
                        .filter(r => r.categoria === categoria)
                        .map((reporte) => (
                          <option key={reporte.id} value={reporte.id}>
                            {reporte.nombre}
                          </option>
                        ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {selectedReport && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-1">
                    {reportes.find(r => r.id === selectedReport)?.nombre}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {reportes.find(r => r.id === selectedReport)?.descripcion}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Desde
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Hasta
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleGenerateReport}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Generar Vista Previa</span>
                </button>

                {showPreview && (
                  <>
                    <button
                      onClick={() => handleDownload('PDF')}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar PDF</span>
                    </button>
                    <button
                      onClick={() => handleDownload('Excel')}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar Excel</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Vista Previa */}
          <div className="lg:col-span-2">
            {showPreview && selectedReport ? (
              <div className="border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">
                      Vista Previa: {reportes.find(r => r.id === selectedReport)?.nombre}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {dateFrom || 'Inicio'} - {dateTo || 'Fin'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  {selectedReport === 'facturacion' && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 font-semibold">Folio</th>
                            <th className="text-left py-2 font-semibold">Cliente</th>
                            <th className="text-left py-2 font-semibold">Fecha</th>
                            <th className="text-left py-2 font-semibold">Total</th>
                            <th className="text-left py-2 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sampleData.facturacion.map((item, index) => (
                            <tr key={index} className="border-b border-gray-100">
                              <td className="py-2">{item.folio}</td>
                              <td className="py-2">{item.cliente}</td>
                              <td className="py-2">{item.fecha}</td>
                              <td className="py-2 font-medium">{item.total}</td>
                              <td className="py-2">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  item.status === 'Pagada' 
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {selectedReport === 'ventas-vendedor' && (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 font-semibold">Vendedor</th>
                            <th className="text-left py-2 font-semibold">Ventas</th>
                            <th className="text-left py-2 font-semibold">Monto</th>
                            <th className="text-left py-2 font-semibold">Comisión</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sampleData['ventas-vendedor'].map((item, index) => (
                            <tr key={index} className="border-b border-gray-100">
                              <td className="py-2">{item.vendedor}</td>
                              <td className="py-2">{item.ventas}</td>
                              <td className="py-2 font-medium">{item.monto}</td>
                              <td className="py-2 text-green-600 font-medium">{item.comision}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {!sampleData[selectedReport as keyof typeof sampleData] && (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Vista previa del reporte aparecerá aquí</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Selecciona un Reporte</h4>
                <p className="text-gray-600">
                  Elige un reporte del menú lateral y configura los parámetros para generar la vista previa
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;