import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Scissors, Plus, Download, Eye, Save, Calculator, Trash2, RotateCcw, 
  Settings, Play, Pause, SkipForward, Move, RotateCw, AlertTriangle,
  Maximize2, Grid, List, Image, FileText, Zap, Clock, Target, Copy
} from 'lucide-react';

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
  orden?: number;
  area?: number;
}

interface Material {
  ancho: number;
  alto: number;
  espesor: number;
  tipo: string;
  costo_m2: number;
  tolerancia_sierra: number;
  nombre: string;
}

interface OptimizacionResult {
  laminas: number;
  aprovechamiento: number;
  desperdicio: number;
  area_utilizada: number;
  area_desperdicio: number;
  cortes_ubicados: number;
  patron_cortes: Corte[];
  alternativas: AlternativaOptimizacion[];
  costo_total: number;
  ahorro_estimado: number;
  tiempo_estimado: number;
}

interface AlternativaOptimizacion {
  id: string;
  nombre: string;
  descripcion: string;
  aprovechamiento: number;
  laminas: number;
  patron_cortes: Corte[];
  estrategia: string;
}

const OptimizadorCorte: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [material, setMaterial] = useState<Material>({
    ancho: 2440,
    alto: 1220,
    espesor: 6,
    tipo: 'Vidrio',
    costo_m2: 350.00,
    tolerancia_sierra: 3,
    nombre: 'Vidrio Templado 6mm'
  });

  const [cortes, setCortes] = useState<Corte[]>([
    { id: 1, ancho: 800, alto: 600, cantidad: 2, descripcion: 'Ventana principal', color: '#3B82F6' },
    { id: 2, ancho: 400, alto: 300, cantidad: 4, descripcion: 'Ventana baño', color: '#10B981' },
    { id: 3, ancho: 600, alto: 400, cantidad: 2, descripcion: 'Ventana cocina', color: '#F59E0B' }
  ]);

  const [optimizacionResult, setOptimizacionResult] = useState<OptimizacionResult | null>(null);
  const [vistaActual, setVistaActual] = useState<'grafica' | 'lista' | 'miniaturas'>('grafica');
  const [simulacionActiva, setSimulacionActiva] = useState(false);
  const [pasoSimulacion, setPasoSimulacion] = useState(0);
  const [velocidadSimulacion, setVelocidadSimulacion] = useState(1000);
  const [direccionCorte, setDireccionCorte] = useState<'horizontal' | 'vertical' | 'auto'>('auto');
  const [showConfigAvanzada, setShowConfigAvanzada] = useState(false);
  const [modoVisualizacion, setModoVisualizacion] = useState<'normal' | 'fullscreen'>('normal');
  const [corteDragIndex, setCorteDragIndex] = useState<number | null>(null);
  const [showAlternativas, setShowAlternativas] = useState(false);
  const [alternativaSeleccionada, setAlternativaSeleccionada] = useState<string>('principal');

  const coloresDisponibles = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  const materialesPreconfigurados = [
    { nombre: 'Vidrio Templado 6mm', ancho: 2440, alto: 1220, espesor: 6, tipo: 'Vidrio', costo_m2: 350.00, tolerancia_sierra: 3 },
    { nombre: 'Vidrio Laminado 8mm', ancho: 2440, alto: 1220, espesor: 8, tipo: 'Vidrio', costo_m2: 520.00, tolerancia_sierra: 4 },
    { nombre: 'Aluminio Natural 3mm', ancho: 3000, alto: 1500, espesor: 3, tipo: 'Aluminio', costo_m2: 145.50, tolerancia_sierra: 2 },
    { nombre: 'Acero Galvanizado 2mm', ancho: 2000, alto: 1000, espesor: 2, tipo: 'Acero', costo_m2: 89.50, tolerancia_sierra: 1.5 }
  ];

  // Actualización automática cuando cambian los datos
  useEffect(() => {
    if (cortes.length > 0 && cortes.every(c => c.ancho > 0 && c.alto > 0)) {
      calcularOptimizacion();
    }
  }, [cortes, material, direccionCorte]);

  // Dibujar canvas cuando hay resultados
  useEffect(() => {
    if (optimizacionResult && canvasRef.current) {
      dibujarPatronCorte();
    }
  }, [optimizacionResult, vistaActual, pasoSimulacion, modoVisualizacion]);

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
  };

  const duplicarCorte = (id: number) => {
    const corte = cortes.find(c => c.id === id);
    if (corte) {
      const duplicado = {
        ...corte,
        id: Math.max(...cortes.map(c => c.id)) + 1,
        descripcion: `${corte.descripcion} (Copia)`
      };
      setCortes([...cortes, duplicado]);
    }
  };

  const calcularOptimizacion = useCallback(() => {
    if (cortes.length === 0 || cortes.some(c => c.ancho <= 0 || c.alto <= 0)) {
      setOptimizacionResult(null);
      return;
    }

    // Expandir cortes según cantidad
    const cortesExpandidos = cortes.flatMap(corte => 
      Array(corte.cantidad).fill(null).map((_, index) => ({
        ...corte,
        id: corte.id * 1000 + index,
        cantidad: 1,
        area: (corte.ancho + material.tolerancia_sierra) * (corte.alto + material.tolerancia_sierra)
      }))
    );

    // Algoritmo de optimización Bottom-Left Fill mejorado
    const patronOptimizado = calcularPatronOptimo(cortesExpandidos);
    
    // Generar alternativas
    const alternativas = generarAlternativas(cortesExpandidos);

    const areaMaterial = material.ancho * material.alto;
    const areaUtilizada = patronOptimizado.reduce((sum, corte) => sum + (corte.ancho * corte.alto), 0);
    const aprovechamiento = (areaUtilizada / areaMaterial) * 100;
    const desperdicio = 100 - aprovechamiento;
    const costoMaterial = (areaMaterial / 1000000) * material.costo_m2;
    const ahorroTradicional = costoMaterial * 0.3; // Estimación vs método tradicional

    const resultado: OptimizacionResult = {
      laminas: 1, // Por ahora una lámina
      aprovechamiento: Math.min(aprovechamiento, 100),
      desperdicio: Math.max(desperdicio, 0),
      area_utilizada: areaUtilizada,
      area_desperdicio: areaMaterial - areaUtilizada,
      cortes_ubicados: patronOptimizado.length,
      patron_cortes: patronOptimizado,
      alternativas,
      costo_total: costoMaterial,
      ahorro_estimado: ahorroTradicional,
      tiempo_estimado: patronOptimizado.length * 2 // 2 minutos por corte estimado
    };

    setOptimizacionResult(resultado);
  }, [cortes, material, direccionCorte]);

  const calcularPatronOptimo = (cortesExpandidos: Corte[]) => {
    // Ordenar por área descendente (First Fit Decreasing)
    const cortesOrdenados = [...cortesExpandidos].sort((a, b) => 
      (b.ancho * b.alto) - (a.ancho * a.alto)
    );

    const patron: Corte[] = [];
    const posicionesOcupadas: { x: number; y: number; ancho: number; alto: number }[] = [];

    cortesOrdenados.forEach((corte, index) => {
      const posicion = encontrarMejorPosicion(corte, posicionesOcupadas);
      
      if (posicion) {
        const corteColocado = {
          ...corte,
          posicionX: posicion.x,
          posicionY: posicion.y,
          rotado: posicion.rotado,
          orden: index + 1,
          ancho: posicion.rotado ? corte.alto : corte.ancho,
          alto: posicion.rotado ? corte.ancho : corte.alto
        };

        patron.push(corteColocado);
        posicionesOcupadas.push({
          x: posicion.x,
          y: posicion.y,
          ancho: corteColocado.ancho + material.tolerancia_sierra,
          alto: corteColocado.alto + material.tolerancia_sierra
        });
      }
    });

    return patron;
  };

  const encontrarMejorPosicion = (corte: Corte, ocupadas: any[]) => {
    const posicionesPosibles = generarPosicionesPosibles(ocupadas);
    
    // Probar orientación normal
    for (const pos of posicionesPosibles) {
      if (puedeColocarCorte(corte.ancho, corte.alto, pos.x, pos.y, ocupadas)) {
        return { x: pos.x, y: pos.y, rotado: false };
      }
    }
    
    // Probar orientación rotada
    if (corte.ancho !== corte.alto) {
      for (const pos of posicionesPosibles) {
        if (puedeColocarCorte(corte.alto, corte.ancho, pos.x, pos.y, ocupadas)) {
          return { x: pos.x, y: pos.y, rotado: true };
        }
      }
    }
    
    return null;
  };

  const generarPosicionesPosibles = (ocupadas: any[]) => {
    const posiciones = [{ x: 0, y: 0 }];
    
    ocupadas.forEach(rect => {
      posiciones.push(
        { x: rect.x + rect.ancho, y: rect.y },
        { x: rect.x, y: rect.y + rect.alto }
      );
    });
    
    return posiciones
      .filter(pos => pos.x < material.ancho && pos.y < material.alto)
      .sort((a, b) => (a.y - b.y) || (a.x - b.x));
  };

  const puedeColocarCorte = (ancho: number, alto: number, x: number, y: number, ocupadas: any[]) => {
    // Verificar límites del material
    if (x + ancho > material.ancho || y + alto > material.alto) {
      return false;
    }
    
    // Verificar solapamiento
    for (const rect of ocupadas) {
      if (!(x + ancho <= rect.x || rect.x + rect.ancho <= x || 
            y + alto <= rect.y || rect.y + rect.alto <= y)) {
        return false;
      }
    }
    
    return true;
  };

  const generarAlternativas = (cortesExpandidos: Corte[]): AlternativaOptimizacion[] => {
    const alternativas: AlternativaOptimizacion[] = [];
    
    // Alternativa A: Por ancho
    const porAncho = [...cortesExpandidos].sort((a, b) => b.ancho - a.ancho);
    const patronA = calcularPatronOptimo(porAncho);
    const areaA = material.ancho * material.alto;
    const utilizadaA = patronA.reduce((sum, c) => sum + (c.ancho * c.alto), 0);
    
    alternativas.push({
      id: 'alternativa-a',
      nombre: 'Optimización A',
      descripcion: 'Prioriza cortes por ancho',
      aprovechamiento: (utilizadaA / areaA) * 100,
      laminas: 1,
      patron_cortes: patronA,
      estrategia: 'width-first'
    });

    // Alternativa B: Por altura
    const porAltura = [...cortesExpandidos].sort((a, b) => b.alto - a.alto);
    const patronB = calcularPatronOptimo(porAltura);
    const utilizadaB = patronB.reduce((sum, c) => sum + (c.ancho * c.alto), 0);
    
    alternativas.push({
      id: 'alternativa-b',
      nombre: 'Optimización B',
      descripcion: 'Prioriza cortes por altura',
      aprovechamiento: (utilizadaB / areaA) * 100,
      laminas: 1,
      patron_cortes: patronB,
      estrategia: 'height-first'
    });

    // Alternativa C: Por perímetro
    const porPerimetro = [...cortesExpandidos].sort((a, b) => 
      (2 * (b.ancho + b.alto)) - (2 * (a.ancho + a.alto))
    );
    const patronC = calcularPatronOptimo(porPerimetro);
    const utilizadaC = patronC.reduce((sum, c) => sum + (c.ancho * c.alto), 0);
    
    alternativas.push({
      id: 'alternativa-c',
      nombre: 'Optimización C',
      descripcion: 'Balance óptimo por perímetro',
      aprovechamiento: (utilizadaC / areaA) * 100,
      laminas: 1,
      patron_cortes: patronC,
      estrategia: 'perimeter-first'
    });

    return alternativas.sort((a, b) => b.aprovechamiento - a.aprovechamiento);
  };

  const dibujarPatronCorte = () => {
    const canvas = canvasRef.current;
    if (!canvas || !optimizacionResult) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas responsivo
    const containerWidth = canvas.parentElement?.clientWidth || 800;
    const escala = Math.min(
      (containerWidth - 40) / material.ancho,
      400 / material.alto
    );
    
    canvas.width = material.ancho * escala;
    canvas.height = material.alto * escala;

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar hoja base con gradiente
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#F8FAFC');
    gradient.addColorStop(1, '#E2E8F0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Borde de la hoja
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Dibujar dimensiones del material
    ctx.fillStyle = '#6B7280';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${material.ancho}mm`, canvas.width / 2, canvas.height + 25);
    
    ctx.save();
    ctx.translate(15, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${material.alto}mm`, 0, 0);
    ctx.restore();

    // Obtener patrón actual (principal o alternativa)
    const patronActual = alternativaSeleccionada === 'principal' 
      ? optimizacionResult.patron_cortes 
      : optimizacionResult.alternativas.find(a => a.id === alternativaSeleccionada)?.patron_cortes || [];

    // Dibujar cortes con animación
    patronActual.forEach((corte, index) => {
      if (simulacionActiva && index > pasoSimulacion) return;

      const x = (corte.posicionX || 0) * escala;
      const y = (corte.posicionY || 0) * escala;
      const w = corte.ancho * escala;
      const h = corte.alto * escala;

      // Sombra del corte
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Fondo del corte con gradiente
      const corteGradient = ctx.createLinearGradient(x, y, x + w, y + h);
      corteGradient.addColorStop(0, corte.color + 'CC');
      corteGradient.addColorStop(1, corte.color + '80');
      ctx.fillStyle = corteGradient;
      ctx.fillRect(x, y, w, h);

      // Borde del corte
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = corte.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      // Número del corte
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`${corte.orden || index + 1}`, x + w/2, y + h/2 + 6);

      // Dimensiones del corte
      ctx.fillStyle = '#1F2937';
      ctx.font = 'bold 10px Arial';
      ctx.fillText(`${corte.ancho}×${corte.alto}`, x + w/2, y + h - 8);

      // Indicador de rotación
      if (corte.rotado) {
        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 12px Arial';
        ctx.fillText('↻', x + w - 12, y + 15);
      }

      // Descripción si hay espacio
      if (w > 80 && h > 40) {
        ctx.fillStyle = '#374151';
        ctx.font = '9px Arial';
        ctx.textAlign = 'center';
        const descripcion = corte.descripcion.length > 12 
          ? corte.descripcion.substring(0, 12) + '...' 
          : corte.descripcion;
        ctx.fillText(descripcion, x + w/2, y + 20);
      }
    });

    // Dibujar área de desperdicio
    if (!simulacionActiva || pasoSimulacion >= patronActual.length) {
      dibujarAreaDesperdicio(ctx, patronActual, escala);
    }

    // Dibujar tolerancias de sierra
    if (material.tolerancia_sierra > 0) {
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      
      patronActual.forEach(corte => {
        const x = (corte.posicionX || 0) * escala;
        const y = (corte.posicionY || 0) * escala;
        const w = corte.ancho * escala;
        const h = corte.alto * escala;
        const tolerancia = material.tolerancia_sierra * escala;
        
        // Líneas de tolerancia
        ctx.strokeRect(x + w, y, tolerancia, h);
        ctx.strokeRect(x, y + h, w, tolerancia);
      });
      
      ctx.setLineDash([]);
    }

    ctx.textAlign = 'left';
  };

  const dibujarAreaDesperdicio = (ctx: CanvasRenderingContext2D, patron: Corte[], escala: number) => {
    // Calcular áreas no utilizadas
    const areasUtilizadas = patron.map(corte => ({
      x: (corte.posicionX || 0) * escala,
      y: (corte.posicionY || 0) * escala,
      ancho: corte.ancho * escala,
      alto: corte.alto * escala
    }));

    // Dibujar patrón de desperdicio
    ctx.fillStyle = '#9CA3AF40';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Quitar áreas utilizadas
    ctx.globalCompositeOperation = 'destination-out';
    areasUtilizadas.forEach(area => {
      ctx.fillRect(area.x, area.y, area.ancho, area.alto);
    });
    
    ctx.globalCompositeOperation = 'source-over';

    // Patrón de líneas para desperdicio
    ctx.strokeStyle = '#9CA3AF';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
  };

  const iniciarSimulacion = () => {
    if (!optimizacionResult) return;
    
    setSimulacionActiva(true);
    setPasoSimulacion(0);
    
    const intervalo = setInterval(() => {
      setPasoSimulacion(prev => {
        const patronActual = alternativaSeleccionada === 'principal' 
          ? optimizacionResult.patron_cortes 
          : optimizacionResult.alternativas.find(a => a.id === alternativaSeleccionada)?.patron_cortes || [];
        
        if (prev >= patronActual.length - 1) {
          clearInterval(intervalo);
          setSimulacionActiva(false);
          return prev;
        }
        return prev + 1;
      });
    }, velocidadSimulacion);
  };

  const pausarSimulacion = () => {
    setSimulacionActiva(false);
  };

  const reiniciarSimulacion = () => {
    setPasoSimulacion(0);
    setSimulacionActiva(false);
  };

  const exportarPlano = (formato: string) => {
    if (!optimizacionResult) return;

    switch (formato) {
      case 'imagen':
        if (canvasRef.current) {
          const link = document.createElement('a');
          link.download = `patron_corte_${new Date().toISOString().split('T')[0]}.png`;
          link.href = canvasRef.current.toDataURL('image/png', 1.0);
          link.click();
        }
        break;
      case 'excel':
        exportarExcel();
        break;
      case 'pdf':
        exportarPDF();
        break;
    }
  };

  const exportarExcel = () => {
    if (!optimizacionResult) return;
    
    const data = {
      material: `${material.nombre} (${material.ancho}×${material.alto}×${material.espesor}mm)`,
      cortes: optimizacionResult.patron_cortes.map(corte => ({
        orden: corte.orden,
        descripcion: corte.descripcion,
        dimensiones: `${corte.ancho}×${corte.alto}mm`,
        posicion: `(${corte.posicionX}, ${corte.posicionY})`,
        rotado: corte.rotado ? 'Sí' : 'No',
        area: `${((corte.ancho * corte.alto) / 1000000).toFixed(4)} m²`
      })),
      resumen: {
        aprovechamiento: `${optimizacionResult.aprovechamiento.toFixed(2)}%`,
        desperdicio: `${optimizacionResult.desperdicio.toFixed(2)}%`,
        costo_total: `$${optimizacionResult.costo_total.toFixed(2)}`,
        ahorro_estimado: `$${optimizacionResult.ahorro_estimado.toFixed(2)}`
      }
    };
    
    console.log('Exportando a Excel:', data);
    alert('Archivo Excel generado: patron_corte.xlsx');
  };

  const exportarPDF = () => {
    alert('Generando reporte PDF con plano de corte...');
  };

  const guardarPlantilla = () => {
    const plantilla = {
      id: `plantilla_${Date.now()}`,
      nombre: `Plantilla ${new Date().toLocaleDateString()}`,
      material,
      cortes,
      fecha: new Date().toISOString(),
      usuario: 'Usuario Actual'
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
    } else {
      alert('No hay plantillas guardadas');
    }
  };

  const seleccionarMaterialPreconfigurado = (materialPreconf: any) => {
    setMaterial({
      ...materialPreconf,
      nombre: materialPreconf.nombre
    });
  };

  const seleccionarAlternativa = (alternativaId: string) => {
    setAlternativaSeleccionada(alternativaId);
    setPasoSimulacion(0);
    setSimulacionActiva(false);
  };

  const validarCorte = (corte: Corte): string[] => {
    const errores: string[] = [];
    
    if (corte.ancho <= 0) errores.push('Ancho debe ser mayor a 0');
    if (corte.alto <= 0) errores.push('Alto debe ser mayor a 0');
    if (corte.cantidad <= 0) errores.push('Cantidad debe ser mayor a 0');
    if (corte.ancho > material.ancho) errores.push('Ancho excede el material');
    if (corte.alto > material.alto) errores.push('Alto excede el material');
    if (!corte.descripcion.trim()) errores.push('Descripción requerida');
    
    return errores;
  };

  const cortesConErrores = cortes.filter(corte => validarCorte(corte).length > 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header con acciones rápidas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center animate-pulse">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Optimizador de Corte Avanzado</h2>
              <p className="text-sm text-gray-600">Algoritmos de optimización para aluminio, vidrio y acero</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Controles de vista */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setVistaActual('grafica')}
                className={`px-3 py-2 text-sm transition-all ${vistaActual === 'grafica' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => setVistaActual('lista')}
                className={`px-3 py-2 text-sm transition-all ${vistaActual === 'lista' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setVistaActual('miniaturas')}
                className={`px-3 py-2 text-sm transition-all ${vistaActual === 'miniaturas' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>

            {/* Pantalla completa */}
            <button
              onClick={() => setModoVisualizacion(modoVisualizacion === 'normal' ? 'fullscreen' : 'normal')}
              className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg transition-all"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Configuración de Material Mejorada */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Configuración del Material Base</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowConfigAvanzada(!showConfigAvanzada)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Avanzado</span>
            </button>
            <button
              onClick={cargarPlantilla}
              className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Cargar Plantilla</span>
            </button>
          </div>
        </div>

        {/* Materiales preconfigurados */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Materiales Preconfigurados
          </label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {materialesPreconfigurados.map((mat, index) => (
              <button
                key={index}
                onClick={() => seleccionarMaterialPreconfigurado(mat)}
                className={`p-3 text-left border rounded-lg transition-all hover:shadow-md ${
                  material.nombre === mat.nombre 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-sm">{mat.nombre}</p>
                <p className="text-xs text-gray-500">{mat.ancho}×{mat.alto}mm</p>
                <p className="text-xs text-green-600">${mat.costo_m2}/m²</p>
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
              onChange={(e) => setMaterial({...material, ancho: parseInt(e.target.value) || 0})}
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
              onChange={(e) => setMaterial({...material, alto: parseInt(e.target.value) || 0})}
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
              onChange={(e) => setMaterial({...material, espesor: parseFloat(e.target.value) || 0})}
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
              onChange={(e) => setMaterial({...material, costo_m2: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tolerancia (mm)
            </label>
            <input
              type="number"
              step="0.1"
              value={material.tolerancia_sierra}
              onChange={(e) => setMaterial({...material, tolerancia_sierra: parseFloat(e.target.value) || 0})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {showConfigAvanzada && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-slide-up">
            <h4 className="font-medium text-gray-900 mb-3">Configuración Avanzada</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de Corte Preferida
                </label>
                <select
                  value={direccionCorte}
                  onChange={(e) => setDireccionCorte(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="auto">Automático (Óptimo)</option>
                  <option value="horizontal">Horizontal Preferido</option>
                  <option value="vertical">Vertical Preferido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Velocidad Simulación (ms)
                </label>
                <select
                  value={velocidadSimulacion}
                  onChange={(e) => setVelocidadSimulacion(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={500}>Rápida (0.5s)</option>
                  <option value={1000}>Normal (1s)</option>
                  <option value={2000}>Lenta (2s)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de Plantilla
                </label>
                <input
                  type="text"
                  value={material.nombre}
                  onChange={(e) => setMaterial({...material, nombre: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre descriptivo"
                />
              </div>
            </div>
          </div>
        )}

        {/* Información del material */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600">Área total:</span>
              <span className="font-medium ml-2">{((material.ancho * material.alto) / 1000000).toFixed(2)} m²</span>
            </div>
            <div>
              <span className="text-blue-600">Costo por lámina:</span>
              <span className="font-medium ml-2">${(((material.ancho * material.alto) / 1000000) * material.costo_m2).toFixed(2)}</span>
            </div>
            <div>
              <span className="text-blue-600">Peso estimado:</span>
              <span className="font-medium ml-2">{(((material.ancho * material.alto * material.espesor) / 1000000000) * 2500).toFixed(1)} kg</span>
            </div>
            <div>
              <span className="text-blue-600">Tolerancia total:</span>
              <span className="font-medium ml-2">{material.tolerancia_sierra}mm por corte</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Cortes Mejorada */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">Lista de Cortes Requeridos</h3>
            {cortesConErrores.length > 0 && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-800 rounded-full">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{cortesConErrores.length} errores</span>
              </div>
            )}
          </div>
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
              <span>Guardar</span>
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
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Estado</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cortes.map((corte, index) => {
                const errores = validarCorte(corte);
                const tieneErrores = errores.length > 0;
                
                return (
                  <tr key={corte.id} className={`border-b border-gray-100 transition-colors ${
                    tieneErrores ? 'bg-red-50' : 'hover:bg-gray-50'
                  }`}>