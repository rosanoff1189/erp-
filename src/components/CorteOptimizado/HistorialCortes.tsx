import React, { useState } from 'react';
import { BarChart3, Search, Download, Eye, Calendar } from 'lucide-react';

const HistorialCortes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const historial = [
    {
      id: 1,
      fecha: '2024-01-15',
      proyecto: 'Ventanas Residencial ABC',
      material: 'Vidrio 6mm',
      dimensiones: '2440x1220mm',
      cortes: 8,
      aprovechamiento: 87.5,
      desperdicio: 12.5,
      laminas: 2,
      usuario: 'Carlos López'
    },
    {
      id: 2,
      fecha: '2024-01-14',
      proyecto: 'Fachada Comercial XYZ',
      material: 'Aluminio 3mm',
      dimensiones: '3000x1500mm',
      cortes: 12,
      aprovechamiento: 92.3,
      desperdicio: 7.7,
      laminas: 3,
      usuario: 'Ana Martínez'
    },
    {
      id: 3,
      fecha: '2024-01-13',
      proyecto: 'Puertas Oficina DEF',
      material: 'Acero 2mm',
      dimensiones: '2000x1000mm',
      cortes: 6,
      aprovechamiento: 78.9,
      desperdicio: 21.1,
      laminas: 2,
      usuario: 'José García'
    }
  ];

  const filteredHistorial = historial.filter(item =>
    item.proyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const promedioAprovechamiento = historial.reduce((sum, item) => sum + item.aprovechamiento, 0) / historial.length;
  const totalCortes = historial.reduce((sum, item) => sum + item.cortes, 0);
  const totalLaminas = historial.reduce((sum, item) => sum + item.laminas, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Historial de Optimizaciones</h3>
              <p className="text-sm text-gray-600">Registro de proyectos de corte y estadísticas</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Exportar Historial</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar proyectos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Proyectos</p>
            <p className="text-2xl font-bold text-blue-900">{historial.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Aprovechamiento Promedio</p>
            <p className="text-2xl font-bold text-green-900">{promedioAprovechamiento.toFixed(1)}%</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Total Cortes</p>
            <p className="text-2xl font-bold text-purple-900">{totalCortes}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Láminas Utilizadas</p>
            <p className="text-2xl font-bold text-yellow-900">{totalLaminas}</p>
          </div>
        </div>

        {/* Historial Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Proyecto</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Material</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Cortes</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Aprovechamiento</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Láminas</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Usuario</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistorial.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm">{item.fecha}</td>
                  <td className="py-3 px-4 font-medium">{item.proyecto}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium">{item.material}</p>
                      <p className="text-xs text-gray-500">{item.dimensiones}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">{item.cortes}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.aprovechamiento >= 90 ? 'bg-green-500' :
                            item.aprovechamiento >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.aprovechamiento}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item.aprovechamiento}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">{item.laminas}</td>
                  <td className="py-3 px-4 text-sm">{item.usuario}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="p-1 text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-800">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gráfico de Tendencias */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Tendencia de Aprovechamiento</h4>
          <div className="h-32 flex items-end justify-between space-x-2">
            {historial.map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="bg-blue-500 rounded-t w-full transition-all duration-500 hover:bg-blue-600"
                  style={{ height: `${item.aprovechamiento}%` }}
                />
                <span className="text-xs text-gray-600 mt-1">{item.fecha.split('-')[2]}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Estadísticas por Material */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">Vidrio</h5>
            <p className="text-sm text-blue-700">Aprovechamiento promedio: 87.5%</p>
            <p className="text-sm text-blue-700">Proyectos: 1</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h5 className="font-medium text-green-900 mb-2">Aluminio</h5>
            <p className="text-sm text-green-700">Aprovechamiento promedio: 92.3%</p>
            <p className="text-sm text-green-700">Proyectos: 1</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h5 className="font-medium text-purple-900 mb-2">Acero</h5>
            <p className="text-sm text-purple-700">Aprovechamiento promedio: 78.9%</p>
            <p className="text-sm text-purple-700">Proyectos: 1</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialCortes;