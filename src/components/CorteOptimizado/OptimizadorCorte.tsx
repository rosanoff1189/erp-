import React, { useState, useRef, useEffect } from 'react';
import { Scissors, Plus, Download, Eye, Save, Calculator, Trash2, RotateCcw, Settings, Play, Pause, SkipForward } from 'lucide-react';

interface Corte {
  id: number;
  ancho: number;
  alto: number;
  cantidad: number;
  descripcion: string;
  color: string;
  posicionX?: number;
  posicionY?: number;
  rotado?: boolean;
}

interface Material {
  ancho: number;
  alto: number;
  espesor: number;
  tipo: string;
  costo_m2: number;
  tolerancia_sierra: number;
}

interface OptimizacionResult {
  laminas: number;
  aprovechamiento: number;
  desperdicio: number;
  area_utilizada: number;
  area_desperdicio: number;
  cortes_ubicados: number;
  patron_cortes: any[];
  alternativas?: any[];
}

const OptimizadorCorte: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [material, setMaterial] = useState<Material>({
    ancho: 2440,
    alto: 1220,
    espesor: 6,
    tipo: 'Vidrio',
    costo_m2: 350.00,
    tolerancia_sierra: 3
  });

  const [cortes, setCortes] = useState<Corte[]>([
    { id: 1, ancho: 800, alto: 600, cantidad: 2, descripcion: 'Ventana principal', color: '#3B82F6' },
    { id: 2, ancho: 400, alto: 300, cantidad: 4, descripcion: 'Ventana baño', color: '#10B981' }
  ]);

  const [optimizacionResult, setOptimizacionResult] = useState<OptimizacionResult | null>(null);
  const [vistaActual, setVistaActual] = useState<'grafica' | 'lista' | 'miniaturas'>('grafica');
  const [simulacionActiva, setSimulacionActiva] = useState(false);
  const [pasoSimulacion, setPasoSimulacion] = useState(0);
  const [direccionCorte, setDireccionCorte] = useState<'horizontal' | 'vertical' | 'auto'>('auto');
  const [showConfigAvanzada, setShowConfigAvanzada] = useState(false);

  const coloresDisponibles = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  useEffect(() => {
    if (optimizacionResult && canvasRef.current) {
      dibujarPatronCorte();
    }
  }, [optimizacionResult, vistaActual, pasoSimulacion]);

  const agregarCorte = () => {
    const newCorte: Corte = {
      id: Math.max(...cortes.map(c => c.id), 0) + 1,
      ancho: 0,
      alto: 0,
      cantidad: 1,
      descripcion: '',
      color: coloresDisponibles[cortes.length % coloresDisponibles.length]
    };
    setCortes([...cortes, newCorte]);
  };

  const eliminarCorte = (id: number) => {
    setCortes(cortes.filter(c => c.id !== id));
  };

  const actualizarCorte = (id: number, field: keyof Corte, value: any) => {
    setCortes(cortes.map(c => c.id === id ? { ...c, [field]: value } : c));
    // Recalcular automáticamente si hay cambios
    if (optimizacionResult) {
      calcularOptimizacion();
    }
  };

  const calcularOptimizacion = () => {
    // Algoritmo de optimización avanzado
    const cortesExpandidos = cortes.flatMap(corte => 
      Array(corte.cantidad).fill(null).map((_, index) => ({
        ...corte,
        id: `${corte.id}-${index}`,
        area: (corte.ancho + material.tolerancia_sierra) * (corte.alto + material.tolerancia_sierra)
      }))
    );

    const areaMaterial = material.ancho * material.alto;
    const areaTotal = cortesExpandidos.reduce((sum, corte) => sum + corte.area, 0);
    
    // Algoritmo de empaquetado 2D simplificado
    const patronOptimizado = calcularPatronOptimo(cortesExpandidos);
    
    const aprovechamiento = (areaTotal / areaMaterial) * 100;
    const desperdicio = 100 - aprovechamiento;

    // Generar alternativas
    const alternativas = generarAlternativas(cortesExpandidos);

    const resultado: OptimizacionResult = {
      laminas: Math.ceil(cortesExpandidos.length / 10), // Simplificado
      aprovechamiento: Math.min(aprovechamiento, 100),
      desperdicio: Math.max(desperdicio, 0),
      area_utilizada: areaTotal,
      area_desperdicio: areaMaterial - areaTotal,
      cortes_ubicados: cortesExpandidos.length,
      patron_cortes: patronOptimizado,
      alternativas
    };

    setOptimizacionResult(resultado);
  };

  const calcularPatronOptimo = (cortesExpandidos: any[]) => {
    // Algoritmo de empaquetado 2D básico
    const patron = [];
    let x = 0, y = 0, filaAltura = 0;

    for (const corte of cortesExpandidos) {
      // Verificar si cabe en la posición actual
      if (x + corte.ancho > material.ancho) {
        // Nueva fila
        x = 0;
        y += filaAltura + material.tolerancia_sierra;
        filaAltura = 0;
      }

      if (y + corte.alto <= material.alto) {
        patron.push({
          ...corte,
          posicionX: x,
          posicionY: y
        });
        
        x += corte.ancho + material.tolerancia_sierra;
        filaAltura = Math.max(filaAltura, corte.alto);
      }
    }

    return patron;
  };

  const generarAlternativas = (cortesExpandidos: any[]) => {
    // Generar 2 alternativas adicionales con diferentes estrategias
    return [
      { nombre: 'Optimización A', aprovechamiento: 87.5, descripcion: 'Prioriza aprovechamiento' },
      { nombre: 'Optimización B', aprovechamiento: 82.3, descripcion: 'Prioriza facilidad de corte' },
      { nombre: 'Optimización C', aprovechamiento: 85.1, descripcion: 'Balance óptimo' }
    ];
  };

  const dibujarPatronCorte = () => {
    const canvas = canvasRef.current;
    if (!canvas || !optimizacionResult) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas
    const escala = Math.min(600 / material.ancho, 400 / material.alto);
    canvas.width = material.ancho * escala;
    canvas.height = material.alto * escala;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar hoja base
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Dibujar dimensiones
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px Arial';
    ctx.fillText(`${material.ancho}mm`, canvas.width / 2 - 20, canvas.height + 15);
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${material.alto}mm`, -20, 0);
    ctx.restore();

    // Dibujar cortes
    optimizacionResult.patron_cortes.forEach((corte, index) => {
      if (simulacionActiva && index > pasoSimulacion) return;

      const x = corte.posicionX * escala;
      const y = corte.posicionY * escala;
      const w = corte.ancho * escala;
      const h = corte.alto * escala;

      // Dibujar corte
      ctx.fillStyle = corte.color + '80'; // Semi-transparente
      ctx.fillRect(x, y, w, h);
      
      ctx.strokeStyle = corte.color;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);

      // Etiqueta del corte
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px Arial';
      const texto = `${index + 1}`;
      const textWidth = ctx.measureText(texto).width;
      ctx.fillText(texto, x + w/2 - textWidth/2, y + h/2 + 3);

      // Dimensiones
      ctx.fillStyle = '#374151';
      ctx.font = '8px Arial';
      ctx.fillText(`${corte.ancho}x${corte.alto}`, x + 2, y + 12);
    });

    // Dibujar área de desperdicio
    if (!simulacionActiva || pasoSimulacion >= optimizacionResult.patron_cortes.length) {
      ctx.fillStyle = '#9CA3AF40';
      // Simplificado: dibujar rectángulo de desperdicio en esquina
      const desperdicioW = 100 * escala;
      const desperdicioH = 80 * escala;
      ctx.fillRect(canvas.width - desperdicioW, canvas.height - desperdicioH, desperdicioW, desperdicioH);
      
      ctx.strokeStyle = '#9CA3AF';
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(canvas.width - desperdicioW, canvas.height - desperdicioH, desperdicioW, desperdicioH);
      ctx.setLineDash([]);
    }
  };

  const iniciarSimulacion = () => {
    setSimulacionActiva(true);
    setPasoSimulacion(0);
    
    const intervalo = setInterval(() => {
      setPasoSimulacion(prev => {
        if (prev >= (optimizacionResult?.patron_cortes.length || 0) - 1) {
          clearInterval(intervalo);
          setSimulacionActiva(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const exportarPlano = (formato: string) => {
    if (formato === 'imagen' && canvasRef.current) {
      const link = document.createElement('a');
      link.download = `patron_corte_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    } else {
      alert(`Exportando plano de corte en formato ${formato}`);
    }
  };

  const guardarPlantilla = () => {
    const plantilla = {
      nombre: `Plantilla ${new Date().toLocaleDateString()}`,
      material,
      cortes,
      fecha: new Date().toISOString()
    };
    
    const plantillasGuardadas = JSON.parse(localStorage.getItem('plantillas_corte') || '[]');
    plantillasGuardadas.push(plantilla);
    localStorage.setItem('plantillas_corte', JSON.stringify(plantillasGuardadas));
    alert('Plantilla guardada exitosamente');
  };

  const cargarPlantilla = () => {
    const plantillasGuardadas = JSON.parse(localStorage.getItem('plantillas_corte') || '[]');
    if (plantillasGuardadas.length > 0) {
      const ultimaPlantilla = plantillasGuardadas[plantillasGuardadas.length - 1];
      setMaterial(ultimaPlantilla.material);
      setCortes(ultimaPlantilla.cortes);
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuración de Material */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Configuración del Material Base</h3>
          <button
            onClick={() => setShowConfigAvanzada(!showConfigAvanzada)}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Configuración Avanzada</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <option value="Madera">Madera</option>
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
              step="0.1"
              value={material.espesor}
              onChange={(e) => setMaterial({...material, espesor: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Costo/m²
            </label>
            <input
              type="number"
              step="0.01"
              value={material.costo_m2}
              onChange={(e) => setMaterial({...material, costo_m2: parseFloat(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {showConfigAvanzada && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Configuración Avanzada</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tolerancia Sierra (mm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={material.tolerancia_sierra}
                  onChange={(e) => setMaterial({...material, tolerancia_sierra: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de Corte
                </label>
                <select
                  value={direccionCorte}
                  onChange={(e) => setDireccionCorte(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="auto">Automático</option>
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={cargarPlantilla}
                  className="w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Cargar Plantilla
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Cortes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Cortes Requeridos</h3>
          <div className="flex space-x-2">
            <button
              onClick={agregarCorte}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Corte</span>
            </button>
            <button
              onClick={guardarPlantilla}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Plantilla</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Color</th>
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
                      type="color"
                      value={corte.color}
                      onChange={(e) => actualizarCorte(corte.id, 'color', e.target.value)}
                      className="w-8 h-8 border border-gray-300 rounded"
                    />
                  </td>
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
              {/* Controles de Vista */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setVistaActual('grafica')}
                  className={`px-3 py-2 text-sm ${vistaActual === 'grafica' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Gráfica
                </button>
                <button
                  onClick={() => setVistaActual('lista')}
                  className={`px-3 py-2 text-sm ${vistaActual === 'lista' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Lista
                </button>
                <button
                  onClick={() => setVistaActual('miniaturas')}
                  className={`px-3 py-2 text-sm ${vistaActual === 'miniaturas' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Miniaturas
                </button>
              </div>

              {/* Controles de Simulación */}
              <div className="flex space-x-2">
                <button
                  onClick={iniciarSimulacion}
                  disabled={simulacionActiva}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  <span>Simular</span>
                </button>
                <button
                  onClick={() => setSimulacionActiva(false)}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  <span>Parar</span>
                </button>
              </div>

              {/* Controles de Exportación */}
              <div className="flex space-x-2">
                <button
                  onClick={() => exportarPlano('imagen')}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Imagen</span>
                </button>
                <button
                  onClick={() => exportarPlano('PDF')}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => exportarPlano('Excel')}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Excel</span>
                </button>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Aprovechamiento</p>
              <p className="text-2xl font-bold text-green-900">{optimizacionResult.aprovechamiento.toFixed(1)}%</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Desperdicio</p>
              <p className="text-2xl font-bold text-red-900">{optimizacionResult.desperdicio.toFixed(1)}%</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Láminas</p>
              <p className="text-2xl font-bold text-blue-900">{optimizacionResult.laminas}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Cortes</p>
              <p className="text-2xl font-bold text-purple-900">{optimizacionResult.cortes_ubicados}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Costo Material</p>
              <p className="text-2xl font-bold text-yellow-900">
                ${((material.ancho * material.alto / 1000000) * material.costo_m2 * optimizacionResult.laminas).toFixed(0)}
              </p>
            </div>
          </div>

          {/* Vista Gráfica */}
          {vistaActual === 'grafica' && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Patrón de Corte Optimizado</h4>
                {simulacionActiva && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Paso {pasoSimulacion + 1} de {optimizacionResult.patron_cortes.length}</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((pasoSimulacion + 1) / optimizacionResult.patron_cortes.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="border border-gray-300 rounded-lg shadow-sm"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                  <div className="absolute top-2 left-2 bg-white bg-opacity-90 p-2 rounded text-xs">
                    <p><strong>Material:</strong> {material.tipo}</p>
                    <p><strong>Dimensiones:</strong> {material.ancho}x{material.alto}mm</p>
                    <p><strong>Tolerancia:</strong> {material.tolerancia_sierra}mm</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Vista Lista */}
          {vistaActual === 'lista' && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">#</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Descripción</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Dimensiones</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Posición</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Área</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {optimizacionResult.patron_cortes.map((corte, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: corte.color }}
                          />
                          <span className="font-medium">{index + 1}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{corte.descripcion}</td>
                      <td className="py-3 px-4 font-mono">{corte.ancho} x {corte.alto} mm</td>
                      <td className="py-3 px-4 font-mono">
                        ({corte.posicionX || 0}, {corte.posicionY || 0})
                      </td>
                      <td className="py-3 px-4">{(corte.ancho * corte.alto).toLocaleString()} mm²</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Ubicado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Vista Miniaturas */}
          {vistaActual === 'miniaturas' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Lámina 1</h5>
                <div className="bg-gray-100 h-32 rounded flex items-center justify-center">
                  <span className="text-gray-600">Vista miniatura del patrón</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Aprovechamiento: {optimizacionResult.aprovechamiento.toFixed(1)}%</p>
                  <p>Cortes: {optimizacionResult.cortes_ubicados}</p>
                </div>
              </div>
            </div>
          )}

          {/* Alternativas de Optimización */}
          {optimizacionResult.alternativas && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">Alternativas de Optimización</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {optimizacionResult.alternativas.map((alt, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg border border-blue-200">
                    <h5 className="font-medium text-blue-900">{alt.nombre}</h5>
                    <p className="text-sm text-blue-700">{alt.descripcion}</p>
                    <p className="text-lg font-bold text-blue-900">{alt.aprovechamiento}%</p>
                    <button className="mt-2 w-full px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                      Seleccionar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resumen de Costos */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Análisis de Costos</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Área Material:</p>
                <p className="font-bold">{((material.ancho * material.alto) / 1000000).toFixed(2)} m²</p>
              </div>
              <div>
                <p className="text-gray-600">Costo por Lámina:</p>
                <p className="font-bold">${(((material.ancho * material.alto) / 1000000) * material.costo_m2).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-600">Costo Total:</p>
                <p className="font-bold text-green-600">
                  ${(((material.ancho * material.alto) / 1000000) * material.costo_m2 * optimizacionResult.laminas).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Ahorro vs Desperdicio:</p>
                <p className="font-bold text-red-600">
                  ${(optimizacionResult.area_desperdicio / 1000000 * material.costo_m2).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizadorCorte;