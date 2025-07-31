// Servicio Avanzado de Optimización de Cortes
// Implementa algoritmos de "Cutting Stock Problem" y "2D Bin Packing"

export interface CutItem {
  id: string;
  width: number;
  height: number;
  quantity: number;
  description: string;
  color?: string;
  priority?: number;
  rotatable?: boolean;
  minWaste?: number;
}

export interface Material {
  width: number;
  height: number;
  thickness: number;
  cost_per_m2: number;
  kerf: number; // Tolerancia de sierra
  type: string;
  name: string;
  density?: number;
}

export interface CutPattern {
  cuts: PlacedCut[];
  efficiency: number;
  waste: number;
  sheets_needed: number;
  total_area_used: number;
  total_waste_area: number;
  cutting_sequence: number[];
  estimated_time: number;
}

export interface PlacedCut {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotated: boolean;
  description: string;
  color: string;
  order: number;
  area: number;
}

export interface OptimizationResult {
  primary_solution: CutPattern;
  alternative_solutions: CutPattern[];
  cost_analysis: CostAnalysis;
  recommendations: string[];
  quality_score: number;
  processing_time: number;
}

export interface CostAnalysis {
  material_cost: number;
  waste_cost: number;
  total_cost: number;
  cost_per_cut: number;
  savings_vs_traditional: number;
  efficiency_rating: 'Excelente' | 'Buena' | 'Regular' | 'Deficiente';
}

export class CuttingOptimizationService {
  
  /**
   * Algoritmo principal de optimización de cortes
   * Implementa Bottom-Left Fill (BLF) con mejoras heurísticas avanzadas
   */
  static optimizeCuts(cuts: CutItem[], material: Material): OptimizationResult {
    const startTime = performance.now();
    
    // Validar entrada
    this.validateInput(cuts, material);
    
    // Expandir cortes según cantidad
    const expandedCuts = this.expandCuts(cuts);
    
    // Generar solución principal con algoritmo híbrido
    const primarySolution = this.generateHybridOptimalPattern(expandedCuts, material);
    
    // Generar alternativas con diferentes estrategias
    const alternatives = this.generateAdvancedAlternatives(expandedCuts, material);
    
    // Análisis de costos detallado
    const costAnalysis = this.calculateDetailedCostAnalysis(primarySolution, material);
    
    // Generar recomendaciones inteligentes
    const recommendations = this.generateIntelligentRecommendations(primarySolution, expandedCuts, material);
    
    // Calcular puntuación de calidad
    const qualityScore = this.calculateQualityScore(primarySolution, expandedCuts, material);
    
    const processingTime = performance.now() - startTime;

    return {
      primary_solution: primarySolution,
      alternative_solutions: alternatives,
      cost_analysis: costAnalysis,
      recommendations,
      quality_score: qualityScore,
      processing_time: processingTime
    };
  }

  /**
   * Validar datos de entrada
   */
  private static validateInput(cuts: CutItem[], material: Material): void {
    if (!cuts || cuts.length === 0) {
      throw new Error('Se requiere al menos un corte');
    }

    if (!material || material.width <= 0 || material.height <= 0) {
      throw new Error('Dimensiones de material inválidas');
    }

    cuts.forEach((cut, index) => {
      if (cut.width <= 0 || cut.height <= 0) {
        throw new Error(`Corte ${index + 1}: Dimensiones inválidas`);
      }
      if (cut.width > material.width || cut.height > material.height) {
        throw new Error(`Corte ${index + 1}: Excede dimensiones del material`);
      }
    });
  }

  /**
   * Expandir cortes según cantidad requerida
   */
  private static expandCuts(cuts: CutItem[]): CutItem[] {
    return cuts.flatMap(cut => 
      Array(cut.quantity).fill(null).map((_, index) => ({
        ...cut,
        id: `${cut.id}-${index + 1}`,
        quantity: 1
      }))
    );
  }

  /**
   * Algoritmo híbrido que combina múltiples estrategias
   */
  private static generateHybridOptimalPattern(cuts: CutItem[], material: Material): CutPattern {
    // Probar múltiples estrategias y seleccionar la mejor
    const strategies = [
      () => this.bottomLeftFillStrategy(cuts, material),
      () => this.bestFitStrategy(cuts, material),
      () => this.guillotineStrategy(cuts, material)
    ];

    let bestPattern: CutPattern | null = null;
    let bestEfficiency = 0;

    for (const strategy of strategies) {
      try {
        const pattern = strategy();
        if (pattern.efficiency > bestEfficiency) {
          bestEfficiency = pattern.efficiency;
          bestPattern = pattern;
        }
      } catch (error) {
        console.warn('Strategy failed:', error);
      }
    }

    if (!bestPattern) {
      throw new Error('No se pudo generar un patrón válido');
    }

    return bestPattern;
  }

  /**
   * Estrategia Bottom-Left Fill mejorada
   */
  private static bottomLeftFillStrategy(cuts: CutItem[], material: Material): CutPattern {
    // Ordenar por área descendente (First Fit Decreasing)
    const sortedCuts = [...cuts].sort((a, b) => (b.width * b.height) - (a.width * a.height));
    
    const placedCuts: PlacedCut[] = [];
    const occupiedRectangles: Rectangle[] = [];
    let totalAreaUsed = 0;
    let cuttingTime = 0;

    sortedCuts.forEach((cut, index) => {
      const position = this.findOptimalPosition(cut, occupiedRectangles, material);
      
      if (position) {
        const placedCut: PlacedCut = {
          id: cut.id,
          x: position.x,
          y: position.y,
          width: position.rotated ? cut.height : cut.width,
          height: position.rotated ? cut.width : cut.height,
          rotated: position.rotated,
          description: cut.description,
          color: cut.color || this.generateColor(index),
          order: index + 1,
          area: (position.rotated ? cut.height : cut.width) * (position.rotated ? cut.width : cut.height)
        };
        
        placedCuts.push(placedCut);
        occupiedRectangles.push({
          x: position.x,
          y: position.y,
          width: placedCut.width + material.kerf,
          height: placedCut.height + material.kerf
        });
        
        totalAreaUsed += placedCut.area;
        cuttingTime += this.estimateCuttingTime(placedCut, material);
      }
    });

    const materialArea = material.width * material.height;
    const efficiency = (totalAreaUsed / materialArea) * 100;

    return {
      cuts: placedCuts,
      efficiency,
      waste: 100 - efficiency,
      sheets_needed: 1,
      total_area_used: totalAreaUsed,
      total_waste_area: materialArea - totalAreaUsed,
      cutting_sequence: placedCuts.map(cut => cut.order),
      estimated_time: cuttingTime
    };
  }

  /**
   * Estrategia Best Fit
   */
  private static bestFitStrategy(cuts: CutItem[], material: Material): CutPattern {
    // Implementación de Best Fit con evaluación de múltiples posiciones
    const sortedCuts = [...cuts].sort((a, b) => {
      // Ordenar por ratio de aspecto para mejor empaquetado
      const ratioA = Math.max(a.width, a.height) / Math.min(a.width, a.height);
      const ratioB = Math.max(b.width, b.height) / Math.min(b.width, b.height);
      return ratioA - ratioB;
    });

    return this.bottomLeftFillStrategy(sortedCuts, material);
  }

  /**
   * Estrategia Guillotine (cortes rectos)
   */
  private static guillotineStrategy(cuts: CutItem[], material: Material): CutPattern {
    // Implementación simplificada de guillotine cutting
    // Prioriza cortes que permitan divisiones rectas del material
    const sortedCuts = [...cuts].sort((a, b) => {
      // Priorizar cortes que dividen el material en proporciones enteras
      const scoreA = this.calculateGuillotineScore(a, material);
      const scoreB = this.calculateGuillotineScore(b, material);
      return scoreB - scoreA;
    });

    return this.bottomLeftFillStrategy(sortedCuts, material);
  }

  /**
   * Calcular puntuación para estrategia guillotine
   */
  private static calculateGuillotineScore(cut: CutItem, material: Material): number {
    const widthRatio = material.width / cut.width;
    const heightRatio = material.height / cut.height;
    
    // Preferir cortes que resulten en divisiones enteras
    const widthScore = widthRatio === Math.floor(widthRatio) ? 10 : 0;
    const heightScore = heightRatio === Math.floor(heightRatio) ? 10 : 0;
    
    return widthScore + heightScore + (cut.width * cut.height);
  }

  /**
   * Encontrar posición óptima para un corte
   */
  private static findOptimalPosition(
    cut: CutItem, 
    occupied: Rectangle[], 
    material: Material
  ): { x: number; y: number; rotated: boolean } | null {
    
    const positions = this.generateCandidatePositions(occupied, material);
    
    // Evaluar cada posición y orientación
    for (const pos of positions) {
      // Probar orientación normal
      if (this.canPlaceCut(cut.width, cut.height, pos.x, pos.y, occupied, material)) {
        return { x: pos.x, y: pos.y, rotated: false };
      }
      
      // Probar orientación rotada (si es diferente y rotación permitida)
      if (cut.rotatable !== false && cut.width !== cut.height) {
        if (this.canPlaceCut(cut.height, cut.width, pos.x, pos.y, occupied, material)) {
          return { x: pos.x, y: pos.y, rotated: true };
        }
      }
    }
    
    return null;
  }

  /**
   * Generar posiciones candidatas inteligentes
   */
  private static generateCandidatePositions(occupied: Rectangle[], material: Material): Position[] {
    const positions: Position[] = [{ x: 0, y: 0 }];
    
    // Generar posiciones basadas en esquinas de rectángulos existentes
    occupied.forEach(rect => {
      positions.push(
        { x: rect.x + rect.width, y: rect.y },
        { x: rect.x, y: rect.y + rect.height },
        { x: rect.x + rect.width, y: rect.y + rect.height }
      );
    });
    
    // Filtrar posiciones válidas y ordenar por estrategia bottom-left
    return positions
      .filter(pos => pos.x < material.width && pos.y < material.height)
      .sort((a, b) => {
        // Priorizar esquina inferior izquierda
        const scoreA = a.y * material.width + a.x;
        const scoreB = b.y * material.width + b.x;
        return scoreA - scoreB;
      });
  }

  /**
   * Verificar si un corte puede ser colocado en una posición
   */
  private static canPlaceCut(
    width: number, 
    height: number, 
    x: number, 
    y: number, 
    occupied: Rectangle[], 
    material: Material
  ): boolean {
    // Verificar límites del material
    if (x + width > material.width || y + height > material.height) {
      return false;
    }
    
    // Verificar solapamiento con rectángulos ocupados
    const newRect = { x, y, width, height };
    
    for (const rect of occupied) {
      if (this.rectanglesOverlap(newRect, rect)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Verificar solapamiento entre rectángulos
   */
  private static rectanglesOverlap(rect1: Rectangle, rect2: Rectangle): boolean {
    return !(
      rect1.x + rect1.width <= rect2.x ||
      rect2.x + rect2.width <= rect1.x ||
      rect1.y + rect1.height <= rect2.y ||
      rect2.y + rect2.height <= rect1.y
    );
  }

  /**
   * Generar alternativas avanzadas con diferentes estrategias
   */
  private static generateAdvancedAlternatives(cuts: CutItem[], material: Material): CutPattern[] {
    const alternatives: CutPattern[] = [];
    
    try {
      // Alternativa 1: Optimización por ancho
      const byWidth = [...cuts].sort((a, b) => b.width - a.width);
      alternatives.push(this.bottomLeftFillStrategy(byWidth, material));
    } catch (error) {
      console.warn('Width strategy failed:', error);
    }

    try {
      // Alternativa 2: Optimización por altura
      const byHeight = [...cuts].sort((a, b) => b.height - a.height);
      alternatives.push(this.bottomLeftFillStrategy(byHeight, material));
    } catch (error) {
      console.warn('Height strategy failed:', error);
    }

    try {
      // Alternativa 3: Optimización por perímetro
      const byPerimeter = [...cuts].sort((a, b) => 
        (2 * (b.width + b.height)) - (2 * (a.width + a.height))
      );
      alternatives.push(this.bottomLeftFillStrategy(byPerimeter, material));
    } catch (error) {
      console.warn('Perimeter strategy failed:', error);
    }

    try {
      // Alternativa 4: Optimización por ratio de aspecto
      const byAspectRatio = [...cuts].sort((a, b) => {
        const ratioA = Math.max(a.width, a.height) / Math.min(a.width, a.height);
        const ratioB = Math.max(b.width, b.height) / Math.min(b.width, b.height);
        return ratioA - ratioB;
      });
      alternatives.push(this.bottomLeftFillStrategy(byAspectRatio, material));
    } catch (error) {
      console.warn('Aspect ratio strategy failed:', error);
    }

    return alternatives
      .filter(alt => alt.efficiency > 0)
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 3);
  }

  /**
   * Calcular análisis de costos detallado
   */
  private static calculateDetailedCostAnalysis(pattern: CutPattern, material: Material): CostAnalysis {
    const materialAreaM2 = (material.width * material.height) / 1000000;
    const materialCost = materialAreaM2 * material.cost_per_m2 * pattern.sheets_needed;
    const wasteCost = (pattern.total_waste_area / 1000000) * material.cost_per_m2;
    const totalCost = materialCost;
    const costPerCut = pattern.cuts.length > 0 ? totalCost / pattern.cuts.length : 0;
    
    // Calcular ahorro vs método tradicional (asumiendo 70% eficiencia)
    const traditionalEfficiency = 0.70;
    const traditionalSheets = Math.ceil(pattern.cuts.length / (traditionalEfficiency * materialAreaM2 / (pattern.total_area_used / pattern.cuts.length)));
    const traditionalCost = traditionalSheets * materialAreaM2 * material.cost_per_m2;
    const savings = Math.max(0, traditionalCost - totalCost);
    
    // Determinar calificación de eficiencia
    let efficiencyRating: CostAnalysis['efficiency_rating'];
    if (pattern.efficiency >= 90) efficiencyRating = 'Excelente';
    else if (pattern.efficiency >= 80) efficiencyRating = 'Buena';
    else if (pattern.efficiency >= 70) efficiencyRating = 'Regular';
    else efficiencyRating = 'Deficiente';

    return {
      material_cost: materialCost,
      waste_cost: wasteCost,
      total_cost: totalCost,
      cost_per_cut: costPerCut,
      savings_vs_traditional: savings,
      efficiency_rating: efficiencyRating
    };
  }

  /**
   * Generar recomendaciones inteligentes
   */
  private static generateIntelligentRecommendations(
    pattern: CutPattern, 
    cuts: CutItem[], 
    material: Material
  ): string[] {
    const recommendations: string[] = [];
    
    // Análisis de eficiencia
    if (pattern.efficiency < 75) {
      recommendations.push('⚠️ Eficiencia baja: Considerar material de diferentes dimensiones');
    }
    
    if (pattern.efficiency < 85 && pattern.efficiency >= 75) {
      recommendations.push('💡 Considerar rotación manual de algunas piezas para mejorar aprovechamiento');
    }
    
    // Análisis de desperdicio
    if (pattern.waste > 25) {
      recommendations.push('🔧 Revisar tolerancias de sierra - pueden estar muy altas');
    }
    
    // Análisis de cortes
    const smallCuts = cuts.filter(c => c.width * c.height < 50000);
    if (smallCuts.length > cuts.length * 0.4) {
      recommendations.push('📦 Muchos cortes pequeños: Considerar agrupar en lotes');
    }
    
    // Análisis de forma
    const longCuts = cuts.filter(c => Math.max(c.width, c.height) / Math.min(c.width, c.height) > 5);
    if (longCuts.length > 0) {
      recommendations.push('📏 Cortes muy alargados detectados: Verificar orientación del material');
    }
    
    // Análisis de cantidad
    if (pattern.sheets_needed > 1) {
      recommendations.push('📋 Proyecto requiere múltiples láminas: Considerar optimización por lotes');
    }
    
    // Recomendaciones positivas
    if (pattern.efficiency >= 90) {
      recommendations.push('✅ Excelente optimización lograda');
    }
    
    if (pattern.cuts.length === cuts.length) {
      recommendations.push('✅ Todos los cortes fueron ubicados exitosamente');
    }

    return recommendations;
  }

  /**
   * Calcular puntuación de calidad del patrón
   */
  private static calculateQualityScore(
    pattern: CutPattern, 
    cuts: CutItem[], 
    material: Material
  ): number {
    let score = 0;
    
    // Puntuación por eficiencia (40% del total)
    score += (pattern.efficiency / 100) * 40;
    
    // Puntuación por cortes ubicados (30% del total)
    const cutsPlacedRatio = pattern.cuts.length / cuts.length;
    score += cutsPlacedRatio * 30;
    
    // Puntuación por simplicidad de corte (20% del total)
    const rotatedCuts = pattern.cuts.filter(c => c.rotated).length;
    const rotationPenalty = (rotatedCuts / pattern.cuts.length) * 10;
    score += Math.max(0, 20 - rotationPenalty);
    
    // Puntuación por distribución espacial (10% del total)
    const distributionScore = this.calculateDistributionScore(pattern.cuts, material);
    score += distributionScore * 10;
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Calcular puntuación de distribución espacial
   */
  private static calculateDistributionScore(cuts: PlacedCut[], material: Material): number {
    if (cuts.length === 0) return 0;
    
    // Calcular centro de masa de los cortes
    const centerX = cuts.reduce((sum, cut) => sum + (cut.x + cut.width / 2), 0) / cuts.length;
    const centerY = cuts.reduce((sum, cut) => sum + (cut.y + cut.height / 2), 0) / cuts.length;
    
    // Calcular qué tan cerca está del centro del material
    const materialCenterX = material.width / 2;
    const materialCenterY = material.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(centerX - materialCenterX, 2) + Math.pow(centerY - materialCenterY, 2)
    );
    
    const maxDistance = Math.sqrt(
      Math.pow(materialCenterX, 2) + Math.pow(materialCenterY, 2)
    );
    
    return 1 - (distance / maxDistance);
  }

  /**
   * Estimar tiempo de corte
   */
  private static estimateCuttingTime(cut: PlacedCut, material: Material): number {
    // Tiempo base por corte + tiempo por perímetro
    const baseTime = 30; // 30 segundos base
    const perimeter = 2 * (cut.width + cut.height);
    const perimeterTime = perimeter * 0.01; // 0.01 segundos por mm de perímetro
    
    // Factor de material
    const materialFactor = material.type === 'Acero' ? 1.5 : 
                          material.type === 'Aluminio' ? 1.2 : 1.0;
    
    return (baseTime + perimeterTime) * materialFactor;
  }

  /**
   * Generar color para corte
   */
  private static generateColor(index: number): string {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
      '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
    ];
    return colors[index % colors.length];
  }

  /**
   * Exportar patrón a diferentes formatos
   */
  static exportPattern(
    pattern: CutPattern, 
    material: Material, 
    format: 'excel' | 'pdf' | 'image' | 'json'
  ): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `patron_corte_${timestamp}.${format}`;
        
        switch (format) {
          case 'excel':
            this.generateExcelData(pattern, material);
            break;
          case 'pdf':
            this.generatePDFData(pattern, material);
            break;
          case 'image':
            this.generateImageData(pattern, material);
            break;
          case 'json':
            this.generateJSONData(pattern, material);
            break;
        }
        
        resolve(filename);
      }, 1000);
    });
  }

  private static generateExcelData(pattern: CutPattern, material: Material): void {
    const data = {
      material: {
        nombre: material.name,
        dimensiones: `${material.width}×${material.height}×${material.thickness}mm`,
        costo_m2: material.cost_per_m2,
        tolerancia: material.kerf
      },
      resumen: {
        eficiencia: `${pattern.efficiency.toFixed(2)}%`,
        desperdicio: `${pattern.waste.toFixed(2)}%`,
        laminas_necesarias: pattern.sheets_needed,
        tiempo_estimado: `${pattern.estimated_time.toFixed(0)} segundos`,
        area_utilizada: `${(pattern.total_area_used / 1000000).toFixed(4)} m²`,
        area_desperdicio: `${(pattern.total_waste_area / 1000000).toFixed(4)} m²`
      },
      cortes: pattern.cuts.map(cut => ({
        orden: cut.order,
        descripcion: cut.description,
        dimensiones: `${cut.width}×${cut.height}mm`,
        posicion: `(${cut.x}, ${cut.y})`,
        rotado: cut.rotated ? 'Sí' : 'No',
        area_m2: (cut.area / 1000000).toFixed(6)
      }))
    };
    
    console.log('Datos para Excel:', data);
  }

  private static generatePDFData(pattern: CutPattern, material: Material): void {
    console.log('Generando reporte PDF con patrón de corte optimizado');
  }

  private static generateImageData(pattern: CutPattern, material: Material): void {
    console.log('Generando imagen PNG del patrón de corte');
  }

  private static generateJSONData(pattern: CutPattern, material: Material): void {
    const jsonData = {
      pattern,
      material,
      generated_at: new Date().toISOString(),
      version: '3.0'
    };
    console.log('Datos JSON:', jsonData);
  }

  /**
   * Guardar proyecto de corte
   */
  static saveProject(
    name: string,
    cuts: CutItem[],
    material: Material,
    result: OptimizationResult,
    userId: string
  ): string {
    const project = {
      id: `project_${Date.now()}`,
      name,
      cuts,
      material,
      optimization_result: result,
      user_id: userId,
      created_at: new Date().toISOString(),
      status: 'active',
      tags: this.generateProjectTags(cuts, material, result)
    };
    
    // Guardar en localStorage (en producción sería base de datos)
    const projects = JSON.parse(localStorage.getItem('cutting_projects') || '[]');
    projects.push(project);
    localStorage.setItem('cutting_projects', JSON.stringify(projects));
    
    return project.id;
  }

  /**
   * Generar tags automáticos para el proyecto
   */
  private static generateProjectTags(
    cuts: CutItem[], 
    material: Material, 
    result: OptimizationResult
  ): string[] {
    const tags: string[] = [];
    
    tags.push(material.type.toLowerCase());
    
    if (result.primary_solution.efficiency >= 90) tags.push('alta-eficiencia');
    if (result.primary_solution.efficiency < 75) tags.push('baja-eficiencia');
    if (cuts.length > 10) tags.push('proyecto-grande');
    if (cuts.length <= 5) tags.push('proyecto-pequeño');
    if (result.cost_analysis.savings_vs_traditional > 100) tags.push('alto-ahorro');
    
    return tags;
  }

  /**
   * Cargar proyectos con filtros avanzados
   */
  static loadProjects(filters?: {
    userId?: string;
    materialType?: string;
    dateFrom?: string;
    dateTo?: string;
    tags?: string[];
  }): any[] {
    const projects = JSON.parse(localStorage.getItem('cutting_projects') || '[]');
    
    if (!filters) return projects;
    
    return projects.filter((project: any) => {
      if (filters.userId && project.user_id !== filters.userId) return false;
      if (filters.materialType && project.material.type !== filters.materialType) return false;
      if (filters.dateFrom && project.created_at < filters.dateFrom) return false;
      if (filters.dateTo && project.created_at > filters.dateTo) return false;
      if (filters.tags && !filters.tags.some(tag => project.tags.includes(tag))) return false;
      
      return true;
    });
  }

  /**
   * Calcular estadísticas históricas avanzadas
   */
  static calculateAdvancedStats(projects: any[]): any {
    if (projects.length === 0) {
      return {
        totalProjects: 0,
        averageEfficiency: 0,
        totalSavings: 0,
        bestProject: null,
        worstProject: null,
        trends: {},
        materialStats: {},
        monthlyStats: {}
      };
    }

    const efficiencies = projects.map(p => p.optimization_result.primary_solution.efficiency);
    const savings = projects.map(p => p.optimization_result.cost_analysis.savings_vs_traditional);
    
    // Encontrar mejor y peor proyecto
    const bestProject = projects.reduce((best, current) => 
      current.optimization_result.primary_solution.efficiency > best.optimization_result.primary_solution.efficiency 
        ? current : best
    );
    
    const worstProject = projects.reduce((worst, current) => 
      current.optimization_result.primary_solution.efficiency < worst.optimization_result.primary_solution.efficiency 
        ? current : worst
    );

    return {
      totalProjects: projects.length,
      averageEfficiency: efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length,
      totalSavings: savings.reduce((a, b) => a + b, 0),
      bestProject,
      worstProject,
      trends: this.calculateTrends(projects),
      materialStats: this.calculateMaterialStats(projects),
      monthlyStats: this.calculateMonthlyStats(projects)
    };
  }

  private static calculateTrends(projects: any[]): any {
    // Calcular tendencias de eficiencia por mes
    const monthlyEfficiency: { [key: string]: number[] } = {};
    
    projects.forEach(project => {
      const month = project.created_at.substring(0, 7); // YYYY-MM
      if (!monthlyEfficiency[month]) {
        monthlyEfficiency[month] = [];
      }
      monthlyEfficiency[month].push(project.optimization_result.primary_solution.efficiency);
    });

    const trends: { [key: string]: number } = {};
    Object.keys(monthlyEfficiency).forEach(month => {
      const avg = monthlyEfficiency[month].reduce((a, b) => a + b, 0) / monthlyEfficiency[month].length;
      trends[month] = avg;
    });

    return trends;
  }

  private static calculateMaterialStats(projects: any[]): any {
    const materialStats: { [key: string]: any } = {};
    
    projects.forEach(project => {
      const materialType = project.material.type;
      if (!materialStats[materialType]) {
        materialStats[materialType] = {
          count: 0,
          totalEfficiency: 0,
          totalSavings: 0,
          totalCuts: 0
        };
      }
      
      materialStats[materialType].count++;
      materialStats[materialType].totalEfficiency += project.optimization_result.primary_solution.efficiency;
      materialStats[materialType].totalSavings += project.optimization_result.cost_analysis.savings_vs_traditional;
      materialStats[materialType].totalCuts += project.cuts.length;
    });

    // Calcular promedios
    Object.keys(materialStats).forEach(material => {
      const stats = materialStats[material];
      stats.averageEfficiency = stats.totalEfficiency / stats.count;
      stats.averageCutsPerProject = stats.totalCuts / stats.count;
    });

    return materialStats;
  }

  private static calculateMonthlyStats(projects: any[]): any {
    const monthlyStats: { [key: string]: any } = {};
    
    projects.forEach(project => {
      const month = project.created_at.substring(0, 7);
      if (!monthlyStats[month]) {
        monthlyStats[month] = {
          projects: 0,
          totalEfficiency: 0,
          totalSavings: 0,
          totalCuts: 0
        };
      }
      
      monthlyStats[month].projects++;
      monthlyStats[month].totalEfficiency += project.optimization_result.primary_solution.efficiency;
      monthlyStats[month].totalSavings += project.optimization_result.cost_analysis.savings_vs_traditional;
      monthlyStats[month].totalCuts += project.cuts.length;
    });

    return monthlyStats;
  }
}

// Interfaces auxiliares
interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

// Utilidades geométricas avanzadas
export class AdvancedGeometryUtils {
  static calculateOptimalRotation(cut: CutItem, availableSpace: Rectangle): boolean {
    // Determinar si rotar mejora el aprovechamiento
    const normalFit = cut.width <= availableSpace.width && cut.height <= availableSpace.height;
    const rotatedFit = cut.height <= availableSpace.width && cut.width <= availableSpace.height;
    
    if (!normalFit && rotatedFit) return true;
    if (normalFit && !rotatedFit) return false;
    if (!normalFit && !rotatedFit) return false;
    
    // Ambas orientaciones caben, elegir la que deje mejor espacio residual
    const normalWaste = (availableSpace.width - cut.width) * (availableSpace.height - cut.height);
    const rotatedWaste = (availableSpace.width - cut.height) * (availableSpace.height - cut.width);
    
    return rotatedWaste < normalWaste;
  }

  static calculateWasteAreas(cuts: PlacedCut[], material: Material): Rectangle[] {
    // Calcular áreas de desperdicio como rectángulos
    const wasteAreas: Rectangle[] = [];
    
    // Implementación simplificada - en producción sería más compleja
    const totalUsedArea = cuts.reduce((sum, cut) => sum + cut.area, 0);
    const materialArea = material.width * material.height;
    const wasteArea = materialArea - totalUsedArea;
    
    if (wasteArea > 0) {
      // Agregar área de desperdicio principal (simplificado)
      wasteAreas.push({
        x: material.width - 100,
        y: material.height - 100,
        width: 100,
        height: 100
      });
    }
    
    return wasteAreas;
  }

  static optimizeForProduction(pattern: CutPattern, material: Material): CutPattern {
    // Optimizar secuencia de cortes para producción
    const optimizedCuts = [...pattern.cuts].sort((a, b) => {
      // Priorizar cortes de izquierda a derecha, abajo hacia arriba
      if (Math.abs(a.y - b.y) < 10) {
        return a.x - b.x;
      }
      return a.y - b.y;
    });

    // Recalcular orden
    optimizedCuts.forEach((cut, index) => {
      cut.order = index + 1;
    });

    return {
      ...pattern,
      cuts: optimizedCuts,
      cutting_sequence: optimizedCuts.map(cut => cut.order)
    };
  }
}