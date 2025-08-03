import React, { useState, useRef, useEffect } from 'react';
import { 
  Scissors, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Save, 
  Settings,
  Eye,
  Grid,
  List,
  Maximize,
  Calculator,
  Zap,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { CuttingOptimizationService } from '../../services/CuttingOptimizationService';

interface CutItem {
  id: string;
  description: string;
  width: number;
  height: number;
  quantity: number;
  color: string;
}

interface Material {
  id: string;
  name: string;
  type: string;
  width: number;
  height: number;
  thickness: number;
  cost_per_m2: number;
  kerf: number;
}

interface PlacedCut {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotated: boolean;
  description: string;
  color: string;
  order: number;
}

const OptimizadorCorte: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewMode, setViewMode] = useState<'graphic' | 'list' | 'thumbnails'>('graphic');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState(1000);

  // Material configuration
  const [selectedMaterial, setSelectedMaterial] = useState<Material>({
    id: '1',
    name: 'Vidrio Templado 6mm',
    type: 'Vidrio',
    width: 2440,
    height: 1220,
    thickness: 6,
    cost_per_m2: 350.00,
    kerf: 3
  });

  // Cuts configuration
  const [cuts, setCuts] = useState<CutItem[]>([
    {
      id: '1',
      description: 'Ventana Principal',
      width: 1200,
      height: 800,
      quantity: 2,
      color: '#3B82F6'
    },
    {
      id: '2',
      description: 'Ventana Secundaria',
      width: 800,
      height: 600,
      quantity: 3,
      color: '#10B981'
    }
  ]);

  // Optimization results
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [placedCuts, setPlacedCuts] = useState<PlacedCut[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Predefined materials
  const predefinedMaterials: Material[] = [
    {
      id: '1',
      name: 'Vidrio Templado 6mm',
      type: 'Vidrio',
      width: 2440,
      height: 1220,
      thickness: 6,
      cost_per_m2: 350.00,
      kerf: 3
    },
    {
      id: '2',
      name: 'Vidrio Laminado 8mm',
      type: 'Vidrio',
      width: 2440,
      height: 1220,
      thickness: 8,
      cost_per_m2: 520.00,
      kerf: 4
    },
    {
      id: '3',
      name: 'Aluminio Natural 3mm',
      type: 'Aluminio',
      width: 3000,
      height: 1500,
      thickness: 3,
      cost_per_m2: 145.50,
      kerf: 2
    },
    {
      id: '4',
      name: 'Acero Galvanizado 2mm',
      type: 'Acero',
      width: 2000,
      height: 1000,
      thickness: 2,
      cost_per_m2: 89.50,
      kerf: 1.5
    }
  ];

  // Colors for cuts
  const cutColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  // Add new cut
  const addCut = () => {
    const newCut: CutItem = {
      id: Date.now().toString(),
      description: `Corte ${cuts.length + 1}`,
      width: 500,
      height: 300,
      quantity: 1,
      color: cutColors[cuts.length % cutColors.length]
    };
    setCuts([...cuts, newCut]);
  };

  // Remove cut
  const removeCut = (id: string) => {
    setCuts(cuts.filter(cut => cut.id !== id));
  };

  // Update cut
  const updateCut = (id: string, field: keyof CutItem, value: any) => {
    setCuts(cuts.map(cut => 
      cut.id === id ? { ...cut, [field]: value } : cut
    ));
  };

  // Calculate optimization
  const calculateOptimization = async () => {
    if (cuts.length === 0) {
      alert('Agregue al menos un corte para optimizar');
      return;
    }

    setIsCalculating(true);
    
    try {
      // Expand cuts by quantity
      const expandedCuts = cuts.flatMap(cut => 
        Array(cut.quantity).fill(null).map((_, index) => ({
          id: `${cut.id}-${index + 1}`,
          width: cut.width,
          height: cut.height,
          quantity: 1,
          description: `${cut.description} (${index + 1})`,
          color: cut.color,
          rotatable: true
        }))
      );

      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Use optimization service
      const result = CuttingOptimizationService.optimizeCuts(expandedCuts, selectedMaterial);
      
      setOptimizationResult(result);
      setPlacedCuts(result.primary_solution.cuts);
      
      // Draw on canvas
      drawOptimization(result.primary_solution.cuts);
      
    } catch (error) {
      console.error('Error en optimización:', error);
      alert('Error al calcular optimización');
    } finally {
      setIsCalculating(false);
    }
  };

  // Draw optimization on canvas
  const drawOptimization = (cuts: PlacedCut[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate scale
    const padding = 20;
    const scaleX = (canvas.width - padding * 2) / selectedMaterial.width;
    const scaleY = (canvas.height - padding * 2) / selectedMaterial.height;
    const scale = Math.min(scaleX, scaleY);

    // Draw material base
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.strokeRect(
      padding,
      padding,
      selectedMaterial.width * scale,
      selectedMaterial.height * scale
    );

    // Draw material info
    ctx.fillStyle = '#374151';
    ctx.font = '14px Arial';
    ctx.fillText(
      `${selectedMaterial.name} - ${selectedMaterial.width}x${selectedMaterial.height}mm`,
      padding,
      padding - 5
    );

    // Draw cuts
    cuts.forEach((cut, index) => {
      const x = padding + cut.x * scale;
      const y = padding + cut.y * scale;
      const width = cut.width * scale;
      const height = cut.height * scale;

      // Fill cut area
      ctx.fillStyle = cut.color + '80'; // Semi-transparent
      ctx.fillRect(x, y, width, height);

      // Draw cut border
      ctx.strokeStyle = cut.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Draw cut number
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        cut.order.toString(),
        x + width / 2,
        y + height / 2 + 4
      );

      // Draw dimensions
      ctx.fillStyle = '#374151';
      ctx.font = '10px Arial';
      ctx.fillText(
        `${cut.width}x${cut.height}`,
        x + width / 2,
        y + height / 2 + 16
      );

      // Draw rotation indicator
      if (cut.rotated) {
        ctx.fillStyle = '#F59E0B';
        ctx.font = '8px Arial';
        ctx.fillText('↻', x + 5, y + 12);
      }
    });

    // Draw waste areas (simplified)
    if (optimizationResult) {
      const wasteAreas = calculateWasteAreas(cuts);
      wasteAreas.forEach(waste => {
        ctx.fillStyle = '#9CA3AF40';
        ctx.fillRect(
          padding + waste.x * scale,
          padding + waste.y * scale,
          waste.width * scale,
          waste.height * scale
        );
      });
    }
  };

  // Calculate waste areas (simplified)
  const calculateWasteAreas = (cuts: PlacedCut[]) => {
    // Simplified waste calculation
    const wasteAreas = [];
    
    // Find largest empty area (simplified)
    const maxX = Math.max(...cuts.map(c => c.x + c.width));
    const maxY = Math.max(...cuts.map(c => c.y + c.height));
    
    if (maxX < selectedMaterial.width) {
      wasteAreas.push({
        x: maxX,
        y: 0,
        width: selectedMaterial.width - maxX,
        height: selectedMaterial.height
      });
    }
    
    if (maxY < selectedMaterial.height) {
      wasteAreas.push({
        x: 0,
        y: maxY,
        width: maxX,
        height: selectedMaterial.height - maxY
      });
    }
    
    return wasteAreas;
  };

  // Start simulation
  const startSimulation = () => {
    if (!placedCuts.length) {
      alert('Primero calcule la optimización');
      return;
    }
    
    setIsSimulating(true);
    setSimulationStep(0);
    
    const interval = setInterval(() => {
      setSimulationStep(prev => {
        if (prev >= placedCuts.length - 1) {
          setIsSimulating(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, simulationSpeed);
  };

  // Reset simulation
  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationStep(0);
    if (placedCuts.length > 0) {
      drawOptimization(placedCuts);
    }
  };

  // Export functions
  const exportToExcel = () => {
    if (!optimizationResult) {
      alert('Primero calcule la optimización');
      return;
    }
    
    CuttingOptimizationService.exportPattern(
      optimizationResult.primary_solution,
      selectedMaterial,
      'excel'
    ).then(filename => {
      alert(`Archivo Excel generado: ${filename}`);
    });
  };

  const exportToPDF = () => {
    if (!optimizationResult) {
      alert('Primero calcule la optimización');
      return;
    }
    
    CuttingOptimizationService.exportPattern(
      optimizationResult.primary_solution,
      selectedMaterial,
      'pdf'
    ).then(filename => {
      alert(`Archivo PDF generado: ${filename}`);
    });
  };

  const exportToImage = () => {
    if (!optimizationResult) {
      alert('Primero calcule la optimización');
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `patron_corte_${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Save project
  const saveProject = () => {
    if (!optimizationResult) {
      alert('Primero calcule la optimización');
      return;
    }
    
    const projectName = prompt('Nombre del proyecto:');
    if (!projectName) return;
    
    const projectId = CuttingOptimizationService.saveProject(
      projectName,
      cuts,
      selectedMaterial,
      optimizationResult,
      'user-1'
    );
    
    alert(`Proyecto guardado con ID: ${projectId}`);
  };

  // Effect to redraw canvas when view changes
  useEffect(() => {
    if (placedCuts.length > 0) {
      drawOptimization(placedCuts);
    }
  }, [selectedMaterial, placedCuts, viewMode]);

  // Effect for simulation
  useEffect(() => {
    if (isSimulating && placedCuts.length > 0) {
      const cutsToShow = placedCuts.slice(0, simulationStep + 1);
      drawOptimization(cutsToShow);
    }
  }, [simulationStep, isSimulating]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Scissors className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Optimizador de Corte Avanzado</h3>
              <p className="text-sm text-gray-600">Algoritmos de optimización para aluminio, vidrio y acero</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* View Mode Selector */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('graphic')}
                className={`p-2 ${viewMode === 'graphic' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                title="Vista Gráfica"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                title="Vista Lista"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('thumbnails')}
                className={`p-2 ${viewMode === 'thumbnails' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
                title="Vista Miniaturas"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
              title="Pantalla Completa"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Material Selection */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Configuración del Material
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material Base
                  </label>
                  <select
                    value={selectedMaterial.id}
                    onChange={(e) => {
                      const material = predefinedMaterials.find(m => m.id === e.target.value);
                      if (material) setSelectedMaterial(material);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {predefinedMaterials.map(material => (
                      <option key={material.id} value={material.id}>
                        {material.name} ({material.width}x{material.height}mm)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ancho (mm)
                    </label>
                    <input
                      type="number"
                      value={selectedMaterial.width}
                      onChange={(e) => setSelectedMaterial({
                        ...selectedMaterial,
                        width: parseInt(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alto (mm)
                    </label>
                    <input
                      type="number"
                      value={selectedMaterial.height}
                      onChange={(e) => setSelectedMaterial({
                        ...selectedMaterial,
                        height: parseInt(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Costo/m² ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={selectedMaterial.cost_per_m2}
                      onChange={(e) => setSelectedMaterial({
                        ...selectedMaterial,
                        cost_per_m2: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tolerancia (mm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={selectedMaterial.kerf}
                      onChange={(e) => setSelectedMaterial({
                        ...selectedMaterial,
                        kerf: parseFloat(e.target.value) || 0
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cuts Configuration */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Calculator className="w-4 h-4 mr-2" />
                  Cortes Requeridos
                </h4>
                <button
                  onClick={addCut}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar</span>
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cuts.map((cut, index) => (
                  <div key={cut.id} className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: cut.color }}
                        />
                        <span className="text-sm font-medium">#{index + 1}</span>
                      </div>
                      <button
                        onClick={() => removeCut(cut.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Descripción"
                        value={cut.description}
                        onChange={(e) => updateCut(cut.id, 'description', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                      />
                      
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          placeholder="Ancho"
                          value={cut.width}
                          onChange={(e) => updateCut(cut.id, 'width', parseInt(e.target.value) || 0)}
                          className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Alto"
                          value={cut.height}
                          onChange={(e) => updateCut(cut.id, 'height', parseInt(e.target.value) || 0)}
                          className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="number"
                          placeholder="Cant."
                          value={cut.quantity}
                          onChange={(e) => updateCut(cut.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={calculateOptimization}
                disabled={isCalculating || cuts.length === 0}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Calculando...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Calcular Optimización</span>
                  </>
                )}
              </button>

              {optimizationResult && (
                <>
                  {/* Simulation Controls */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">Simulación de Corte</h5>
                    <div className="flex items-center space-x-2 mb-2">
                      <button
                        onClick={startSimulation}
                        disabled={isSimulating}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
                      >
                        <Play className="w-3 h-3" />
                        <span className="text-sm">Iniciar</span>
                      </button>
                      <button
                        onClick={resetSimulation}
                        className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span className="text-sm">Reiniciar</span>
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-blue-700 mb-1">Velocidad:</label>
                      <select
                        value={simulationSpeed}
                        onChange={(e) => setSimulationSpeed(parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-blue-500"
                      >
                        <option value={500}>Rápida</option>
                        <option value={1000}>Normal</option>
                        <option value={2000}>Lenta</option>
                      </select>
                    </div>
                    
                    {isSimulating && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-blue-700 mb-1">
                          <span>Progreso:</span>
                          <span>{simulationStep + 1} / {placedCuts.length}</span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((simulationStep + 1) / placedCuts.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Export Options */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={exportToExcel}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Excel</span>
                    </button>
                    <button
                      onClick={exportToPDF}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">PDF</span>
                    </button>
                    <button
                      onClick={exportToImage}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Imagen</span>
                    </button>
                    <button
                      onClick={saveProject}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span className="text-sm">Guardar</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-2">
            {viewMode === 'graphic' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Vista Gráfica del Patrón</h4>
                  {optimizationResult && (
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-green-600 font-medium">
                        Aprovechamiento: {optimizationResult.primary_solution.efficiency.toFixed(1)}%
                      </span>
                      <span className="text-red-600 font-medium">
                        Desperdicio: {optimizationResult.primary_solution.waste.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={500}
                    className="border border-gray-300 rounded-lg bg-white w-full"
                    style={{ maxHeight: isFullscreen ? '80vh' : '500px' }}
                  />
                  
                  {!optimizationResult && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg">
                      <div className="text-center">
                        <Scissors className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">Configure los cortes y presione "Calcular Optimización"</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {viewMode === 'list' && optimizationResult && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Vista Detallada de Cortes</h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 text-sm font-semibold text-gray-900">Orden</th>
                        <th className="text-left py-2 px-3 text-sm font-semibold text-gray-900">Descripción</th>
                        <th className="text-left py-2 px-3 text-sm font-semibold text-gray-900">Dimensiones</th>
                        <th className="text-left py-2 px-3 text-sm font-semibold text-gray-900">Posición</th>
                        <th className="text-left py-2 px-3 text-sm font-semibold text-gray-900">Rotado</th>
                        <th className="text-left py-2 px-3 text-sm font-semibold text-gray-900">Área</th>
                      </tr>
                    </thead>
                    <tbody>
                      {placedCuts.map((cut) => (
                        <tr key={cut.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-2 px-3">
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: cut.color }}
                              />
                              <span className="text-sm font-medium">{cut.order}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-sm">{cut.description}</td>
                          <td className="py-2 px-3 text-sm font-mono">{cut.width}×{cut.height}mm</td>
                          <td className="py-2 px-3 text-sm font-mono">({cut.x}, {cut.y})</td>
                          <td className="py-2 px-3">
                            {cut.rotated ? (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                Sí ↻
                              </span>
                            ) : (
                              <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                No
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-sm">{(cut.area / 1000000).toFixed(4)} m²</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {viewMode === 'thumbnails' && optimizationResult && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Vista de Miniaturas</h4>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <h5 className="font-medium text-gray-900 mb-2">Solución Principal</h5>
                    <div className="bg-gray-100 h-32 rounded mb-2 flex items-center justify-center">
                      <span className="text-xs text-gray-600">Miniatura del patrón</span>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Eficiencia:</span>
                        <span className="font-medium text-green-600">
                          {optimizationResult.primary_solution.efficiency.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Láminas:</span>
                        <span className="font-medium">{optimizationResult.primary_solution.sheets_needed}</span>
                      </div>
                    </div>
                  </div>

                  {optimizationResult.alternative_solutions.map((alt, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2">Alternativa {index + 1}</h5>
                      <div className="bg-gray-100 h-32 rounded mb-2 flex items-center justify-center">
                        <span className="text-xs text-gray-600">Patrón alternativo</span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Eficiencia:</span>
                          <span className="font-medium text-blue-600">
                            {alt.efficiency.toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Láminas:</span>
                          <span className="font-medium">{alt.sheets_needed}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Results Summary */}
            {optimizationResult && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h5 className="font-medium text-green-900">Eficiencia</h5>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {optimizationResult.primary_solution.efficiency.toFixed(1)}%
                  </p>
                  <p className="text-sm text-green-700">
                    {optimizationResult.cost_analysis.efficiency_rating}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    <h5 className="font-medium text-blue-900">Costo Total</h5>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    ${optimizationResult.cost_analysis.total_cost.toFixed(2)}
                  </p>
                  <p className="text-sm text-blue-700">
                    {optimizationResult.primary_solution.sheets_needed} lámina(s)
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <h5 className="font-medium text-yellow-900">Ahorro</h5>
                  </div>
                  <p className="text-2xl font-bold text-yellow-900">
                    ${optimizationResult.cost_analysis.savings_vs_traditional.toFixed(2)}
                  </p>
                  <p className="text-sm text-yellow-700">vs método tradicional</p>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {optimizationResult && optimizationResult.recommendations.length > 0 && (
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                <h5 className="font-medium text-yellow-900 mb-3">Recomendaciones</h5>
                <ul className="space-y-2">
                  {optimizationResult.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-yellow-800 flex items-start space-x-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizadorCorte;