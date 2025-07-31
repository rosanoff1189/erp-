import React, { useState } from 'react';
import { BarChart3, Search, Download, Eye, Calendar, TrendingUp, Filter, FileText } from 'lucide-react';

const HistorialCortes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMaterial, setFilterMaterial] = useState('all');
  const [filterFecha, setFilterFecha] = useState('');

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
      usuario: 'Carlos López',
      costo_material: 1708.00,
      ahorro_estimado: 213.50,
      cliente: 'Constructora ABC',
      observaciones: 'Optimización estándar aplicada'
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
      usuario: 'Ana Martínez',
      costo_material: 1957.50,
      ahorro_estimado: 150.75,
      cliente: 'Desarrollos Comerciales',
      observaciones: 'Patrón optimizado con rotación'
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
      usuario: 'José García',
      costo_material: 358.00,
      ahorro_estimado: 75.50,
      cliente: 'Oficinas Modernas',
      observaciones: 'Material con limitaciones de corte'
    },
    {
      id: 4,
      fecha: '2024-01-12',
      proyecto: 'Cancelería Residencial GHI',
      material: 'Vidrio 8mm',
      dimensiones: '2440x1220mm',
      cortes: 15,
      aprovechamiento: 94.2,
      desperdicio: 5.8,
      laminas: 4,
      usuario: 'María González',
      costo_material: 3416.00,
      ahorro_estimado: 198.13,
      cliente: 'Residencial Premium',
      observaciones: 'Excelente optimización lograda'
    },
    {
      id: 5,
      fecha: '2024-01-11',
      proyecto: 'Estructura Metálica JKL',
      material: 'Acero 4mm',
      dimensiones: '2500x1250mm',
      cortes: 20,
      aprovechamiento: 89.7,
      desperdicio: 10.3,
      laminas: 5,
      usuario: 'Roberto Silva',
      costo_material: 2812.50,
      ahorro_estimado: 289.69,
      cliente: 'Construcciones Industriales',
      observaciones: 'Patrón complejo con múltiples tamaños'
    }
  ];

  const filteredHistorial = historial.filter(item => {
    const matchesSearch = 
      item.proyecto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMaterial = filterMaterial === 'all' || 
      item.material.toLowerCase().includes(filterMaterial.toLowerCase());
    
    const matchesFecha = !filterFecha || item.fecha >= filterFecha;
    
    return matchesSearch && matchesMaterial && matchesFecha;
  });

  // Estadísticas calculadas
  const totalProyectos = historial.length;
  const promedioAprovechamiento = historial.reduce((sum, item) => sum + item.aprovechamiento, 0) / historial.length;
  const totalCortes = historial.reduce((sum, item) => sum + item.cortes, 0);
  const totalLaminas = historial.reduce((sum, item) => sum + item.laminas, 0);
  const ahorroTotal = historial.reduce((sum, item) => sum + item.ahorro_estimado, 0);
  const costoTotal = historial.reduce((sum, item) => sum + item.costo_material, 0);

  // Estadísticas por material
  const estadisticasPorMaterial = historial.reduce((acc, item) => {
    const materialBase = item.material.split(' ')[0]; // Vidrio, Aluminio, Acero
    if (!acc[materialBase]) {
      acc[materialBase] = { proyectos: 0, aprovechamiento: 0, ahorro: 0 };
    }
    acc[materialBase].proyectos++;
    acc[materialBase].aprovechamiento += item.aprovechamiento;
    acc[materialBase].ahorro += item.ahorro_estimado;
    return acc;
  }, {} as any);

  // Calcular promedios por material
  Object.keys(estadisticasPorMaterial).forEach(material => {
    estadisticasPorMaterial[material].aprovechamiento /= estadisticasPorMaterial[material].proyectos;
  });

  const exportarHistorial = (formato: string) => {
    alert(`Exportando historial completo en formato ${formato}`);
  };

  const verDetalleProyecto = (proyecto: any) => {
    alert(`Mostrando detalles del proyecto: ${proyecto.proyecto}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Historial de Optimizaciones</h3>
              <p className="text-sm text-gray-600">Registro completo de proyectos de corte y análisis de eficiencia</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => exportarHistorial('Excel')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Excel</span>
            </button>
            <button 
              onClick={() => exportarHistorial('PDF')}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Reporte PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filtros Avanzados */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar proyectos, materiales, usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterMaterial}
              onChange={(e) => setFilterMaterial(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los materiales</option>
              <option value="vidrio">Vidrio</option>
              <option value="aluminio">Aluminio</option>
              <option value="acero">Acero</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={filterFecha}
              onChange={(e) => setFilterFecha(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <button className="w-full flex items-center justify-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filtros Avanzados</span>
            </button>
          </div>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Proyectos</p>
            <p className="text-2xl font-bold text-blue-900">{totalProyectos}</p>
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
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Costo Total Material</p>
            <p className="text-2xl font-bold text-red-900">${costoTotal.toLocaleString()}</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg">
            <p className="text-sm text-teal-600 font-medium">Ahorro Total</p>
            <p className="text-2xl font-bold text-teal-900">${ahorroTotal.toLocaleString()}</p>
          </div>
        </div>

        {/* Tabla de Historial */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Proyecto</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Cliente</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Material</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Cortes</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Aprovechamiento</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Ahorro</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Usuario</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistorial.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm">{item.fecha}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{item.proyecto}</p>
                      <p className="text-xs text-gray-500">{item.observaciones}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{item.cliente}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium">{item.material}</p>
                      <p className="text-xs text-gray-500">{item.dimensiones}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {item.cortes}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            item.aprovechamiento >= 90 ? 'bg-green-500' :
                            item.aprovechamiento >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.aprovechamiento}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item.aprovechamiento}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-green-600">${item.ahorro_estimado}</p>
                      <p className="text-xs text-gray-500">{item.laminas} láminas</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{item.usuario}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => verDetalleProyecto(item)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => exportarHistorial('PDF')}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Descargar plano"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gráfico de Tendencias de Aprovechamiento */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Tendencia de Aprovechamiento (Últimos 30 días)</h4>
          <div className="h-40 flex items-end justify-between space-x-2">
            {historial.slice(-10).map((item, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="relative w-full">
                  <div
                    className={`rounded-t w-full transition-all duration-500 hover:opacity-80 cursor-pointer ${
                      item.aprovechamiento >= 90 ? 'bg-green-500' :
                      item.aprovechamiento >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ height: `${item.aprovechamiento * 1.5}px` }}
                    title={`${item.proyecto}: ${item.aprovechamiento}%`}
                  />
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                    {item.aprovechamiento.toFixed(1)}%
                  </div>
                </div>
                <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
                  {item.fecha.split('-')[2]}/{item.fecha.split('-')[1]}
                </span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-4">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Estadísticas por Material */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(estadisticasPorMaterial).map(([material, stats]: [string, any]) => (
            <div key={material} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-blue-900">{material}</h5>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Proyectos:</span>
                  <span className="font-medium text-blue-900">{stats.proyectos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Aprovechamiento:</span>
                  <span className="font-medium text-blue-900">{stats.aprovechamiento.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Ahorro total:</span>
                  <span className="font-medium text-green-600">${stats.ahorro.toFixed(0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Análisis de Eficiencia */}
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-4">Análisis de Eficiencia Global</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-green-700">Eficiencia Promedio</p>
              <p className="text-2xl font-bold text-green-900">{promedioAprovechamiento.toFixed(1)}%</p>
              <div className="mt-2 w-full bg-green-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${promedioAprovechamiento}%` }}
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-green-700">Material Ahorrado</p>
              <p className="text-2xl font-bold text-green-900">
                {((ahorroTotal / costoTotal) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-green-600">del costo total</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-green-700">Proyectos Eficientes</p>
              <p className="text-2xl font-bold text-green-900">
                {historial.filter(h => h.aprovechamiento >= 85).length}
              </p>
              <p className="text-xs text-green-600">≥85% aprovechamiento</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-green-700">Ahorro Mensual</p>
              <p className="text-2xl font-bold text-green-900">${ahorroTotal.toFixed(0)}</p>
              <p className="text-xs text-green-600">vs desperdicio tradicional</p>
            </div>
          </div>
        </div>

        {/* Recomendaciones de Mejora */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold text-yellow-900 mb-3">Recomendaciones de Mejora</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-800">
                Considerar rotación de piezas en proyectos con aprovechamiento &lt;80%
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-800">
                Agrupar cortes similares para optimizar secuencia de producción
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-800">
                Revisar tolerancias de sierra para materiales con bajo aprovechamiento
              </span>
            </div>
          </div>
        </div>

        {/* Comparativo Mensual */}
        <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
          <h4 className="font-semibold text-indigo-900 mb-4">Comparativo Mensual</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-indigo-800 mb-2">Enero 2024</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-indigo-700">Proyectos completados:</span>
                  <span className="font-medium">{totalProyectos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">Aprovechamiento promedio:</span>
                  <span className="font-medium">{promedioAprovechamiento.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">Ahorro generado:</span>
                  <span className="font-medium text-green-600">${ahorroTotal.toFixed(0)}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="font-medium text-indigo-800 mb-2">Diciembre 2023</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-indigo-700">Proyectos completados:</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">Aprovechamiento promedio:</span>
                  <span className="font-medium">82.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">Ahorro generado:</span>
                  <span className="font-medium text-green-600">$1,245</span>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600">
                  +{((promedioAprovechamiento - 82.3) / 82.3 * 100).toFixed(1)}% mejora vs mes anterior
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialCortes;