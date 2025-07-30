import React, { useState } from 'react';
import { Database, Download, Upload, RefreshCw, Search, Filter } from 'lucide-react';

const CatalogosSAT: React.FC = () => {
  const [activeTab, setActiveTab] = useState('productos-servicios');
  const [searchTerm, setSearchTerm] = useState('');

  const catalogos = [
    { id: 'productos-servicios', label: 'Productos y Servicios', count: 5412 },
    { id: 'monedas', label: 'Monedas', count: 185 },
    { id: 'unidades', label: 'Unidades de Medida', count: 89 },
    { id: 'metodos-pago', label: 'Métodos de Pago', count: 12 },
    { id: 'formas-pago', label: 'Formas de Pago', count: 99 },
    { id: 'impuestos', label: 'Impuestos', count: 45 }
  ];

  const sampleData = {
    'productos-servicios': [
      { clave: '43211701', descripcion: 'Vidrio para construcción', status: 'Activo' },
      { clave: '30111506', descripcion: 'Perfiles de aluminio', status: 'Activo' },
      { clave: '43211702', descripcion: 'Vidrio templado', status: 'Activo' },
      { clave: '30111507', descripcion: 'Marcos de aluminio', status: 'Activo' }
    ],
    'monedas': [
      { clave: 'MXN', descripcion: 'Peso Mexicano', status: 'Activo' },
      { clave: 'USD', descripcion: 'Dólar de los Estados Unidos', status: 'Activo' },
      { clave: 'EUR', descripcion: 'Euro', status: 'Activo' }
    ],
    'unidades': [
      { clave: 'PZA', descripcion: 'Pieza', status: 'Activo' },
      { clave: 'M2', descripcion: 'Metro cuadrado', status: 'Activo' },
      { clave: 'KG', descripcion: 'Kilogramo', status: 'Activo' }
    ]
  };

  const getCurrentData = () => {
    return sampleData[activeTab as keyof typeof sampleData] || [];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Catálogos SAT</h3>
              <p className="text-sm text-gray-600">Gestión de catálogos fiscales del SAT</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
              <span>Sincronizar SAT</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {catalogos.map((catalogo) => (
            <button
              key={catalogo.id}
              onClick={() => setActiveTab(catalogo.id)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === catalogo.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {catalogo.label}
              <span className="ml-2 text-xs text-gray-500">({catalogo.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en catálogo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Clave</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Descripción</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentData().map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-mono text-sm">{item.clave}</td>
                  <td className="py-3 px-4">{item.descripcion}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === 'Activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Mostrando 1-10 de {catalogos.find(c => c.id === activeTab)?.count} registros
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Anterior
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogosSAT;