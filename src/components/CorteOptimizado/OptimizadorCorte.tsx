import React, { useState } from 'react';
import { Scissors, Plus, Download, Eye, Save, Calculator, Trash2 } from 'lucide-react';

interface Corte {
  id: number;
  ancho: number;
  alto: number;
  cantidad: number;
  descripcion: string;
}

interface Material {
  ancho: number;
  alto: number;
  espesor: number;
  tipo: string;
}

const OptimizadorCorte: React.FC = () => {
  const [material, setMaterial] = useState<Material>({
    ancho: 2440,
    alto: 1220,
    espesor: 6,
    tipo: 'Vidrio'
  });

  const [cortes, setCortes] = useState<Corte[]>([
    { id: 1, ancho: 800, alto: 600, cantidad: 2, descripcion: 'Ventana principal' },
    { id: 2, ancho: 400, alto: 300, cantidad: 4, descripcion: 'Ventana baño' }
  ]);

  const [optimizacionResult, setOptimizacionResult] = useState<any>(null);
  const [showVisualizacion, setShowVisualizacion] = useState(false);

  const agregarCorte = () => {
    const newCorte: Corte = {
      id: Math.max(...cortes.map(c => c.id), 0) + 1,
      ancho: 0,
      alto: 0,
      cantidad: 1,
      descripcion: ''
    };
    setCortes([...cortes, newCorte]);
  };

  const eliminarCorte = (id: number) => {
    setCortes(cortes.filter(c => c.id !== id));
  };

  const actualizarCorte = (id: number, field: keyof Corte, value: any) => {
    setCortes(cortes.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const calcularOptimizacion = () => {
    // Algoritmo de optimización simplificado
    const cortesExpandidos = cortes.flatMap(corte => 
      Array(corte.cantidad).fill(null).map((_, index) => ({
        ...corte,
        id: `${corte.id}-${index}`,
        area: corte.ancho * corte.alto
      }))
    );

    const areaMaterial = material.ancho * material.alto;
    const areaTotal = cortesExpandidos.reduce((sum, corte) => sum + corte.area, 0);
    const aprovechamiento = (areaTotal / areaMaterial) * 100;
    const desperdicio = 100 - aprovechamiento;

    // Simulación de patrón de corte
    const patron = {
      laminas: 1,
      cortes_ubicados: cortesExpandidos.length,
      aprovechamiento: aprovechamiento.toFixed(2),
      desperdicio: desperdicio.toFixed(2),
      area_utilizada: areaTotal,
      area_desperdicio: areaMaterial - areaTotal
    };

    setOptimizacionResult(patron);
    setShowVisualizacion(true);
  };

  const exportarPlano = (formato: string) => {
    alert(`Exportando plano de corte en formato ${formato}`);
  };

  const guardarProyecto = () => {
    const proyecto = {
      material,
      cortes,
      optimizacion: optimizacionResult,
      fecha: new Date().toISOString()
    };
    
    localStorage.setItem(`corte_proyecto_${Date.now()}`, JSON.stringify(proyecto));
    alert('Proyecto guardado exitosamente');
  };

  return (
    <div className="space-y-6">
      {/* Configuración de Material */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración del Material Base</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Material
            </label>
            <select
              value={material.tipo}
              onChange={(e) => setMaterial({...material, tipo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Vidrio">Vidrio</option>
              <option value="Aluminio">Aluminio</option>
              <option value="Acero">Acero</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ancho (mm)
            </label>
            <input
              type="number"
              value={material.ancho}
              onChange={(e) => setMaterial({...material, ancho: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alto (mm)
            </label>
            <input
              type="number"
              value={material.alto}
              onChange={(e) => setMaterial({...material, alto: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Espesor (mm)
            </label>
            <input
              type="number"
              value={material.espesor}
              onChange={(e) => setMaterial({...material, espesor: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Lista de Cortes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Cortes Requeridos</h3>
          <button
            onClick={agregarCorte}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Corte</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Descripción</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Ancho (mm)</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Alto (mm)</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Cantidad</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Área Total</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cortes.map((corte) => (
                <tr key={corte.id} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={corte.descripcion}
                      onChange={(e) => actualizarCorte(corte.id, 'descripcion', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Descripción del corte"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={corte.ancho}
                      onChange={(e) => actualizarCorte(corte.id, 'ancho', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={corte.alto}
                      onChange={(e) => actualizarCorte(corte.id, 'alto', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      value={corte.cantidad}
                      onChange={(e) => actualizarCorte(corte.id, 'cantidad', parseInt(e.target.value))}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      min="1"
                    />
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {(corte.ancho * corte.alto * corte.cantidad).toLocaleString()} mm²
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => eliminarCorte(corte.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={calcularOptimizacion}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Calculator className="w-5 h-5" />
            <span>Calcular Optimización</span>
          </button>
        </div>
      </div>

      {/* Resultados de Optimización */}
      {optimizacionResult && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Resultados de Optimización</h3>
            <div className="flex space-x-2">
              <button
                onClick={guardarProyecto}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Guardar</span>
              </button>
              <button
                onClick={() => exportarPlano('PDF')}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => exportarPlano('Excel')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Excel</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Aprovechamiento</p>
              <p className="text-2xl font-bold text-green-900">{optimizacionResult.aprovechamiento}%</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Desperdicio</p>
              <p className="text-2xl font-bold text-red-900">{optimizacionResult.desperdicio}%</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Láminas Necesarias</p>
              <p className="text-2xl font-bold text-blue-900">{optimizacionResult.laminas}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Cortes Ubicados</p>
              <p className="text-2xl font-bold text-purple-900">{optimizacionResult.cortes_ubicados}</p>
            </div>
          </div>

          {/* Visualización del Patrón de Corte */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Patrón de Corte Optimizado</h4>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div 
                className="bg-white border-2 border-gray-400 mx-auto relative"
                style={{
                  width: '400px',
                  height: '200px',
                  aspectRatio: `${material.ancho}/${material.alto}`
                }}
              >
                {/* Simulación visual de cortes */}
                <div className="absolute top-2 left-2 w-20 h-12 bg-blue-200 border border-blue-400 flex items-center justify-center text-xs">
                  Corte 1
                </div>
                <div className="absolute top-2 left-24 w-20 h-12 bg-blue-200 border border-blue-400 flex items-center justify-center text-xs">
                  Corte 2
                </div>
                <div className="absolute top-16 left-2 w-16 h-8 bg-green-200 border border-green-400 flex items-center justify-center text-xs">
                  C3
                </div>
                <div className="absolute top-16 left-20 w-16 h-8 bg-green-200 border border-green-400 flex items-center justify-center text-xs">
                  C4
                </div>
                <div className="absolute bottom-2 right-2 w-24 h-16 bg-red-100 border border-red-300 flex items-center justify-center text-xs">
                  Desperdicio
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p><strong>Material:</strong> {material.tipo} {material.ancho}x{material.alto}x{material.espesor}mm</p>
              <p><strong>Área utilizada:</strong> {optimizacionResult.area_utilizada?.toLocaleString()} mm²</p>
              <p><strong>Área desperdicio:</strong> {optimizacionResult.area_desperdicio?.toLocaleString()} mm²</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizadorCorte;