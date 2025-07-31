// Servicio de Optimización de Cortes
// Implementa algoritmos avanzados para el problema de "Cutting Stock"

export interface CutItem {
  id: string;
  width: number;
  height: number;
  quantity: number;
  description: string;
  color?: string;
  priority?: number;
  rotatable?: boolean;
}

export interface Material {
  width: number;
  height: number;
  thickness: number;
  cost_per_m2: number;
  kerf: number; // Tolerancia de sierra
  type: string;
}

export interface CutPattern {
  cuts: PlacedCut[];
  efficiency: number;
  waste: number;
  sheets_needed: number;
  total_area_used: number;
  total_waste_area: number;
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
}

export interface OptimizationResult {
  primary_solution: CutPattern;
  alternative_solutions: CutPattern[];
  cost_analysis: CostAnalysis;
  recommendations: string[];
}

export interface CostAnalysis {
  material_cost: number;
  waste_cost: number;
  total_cost: number;
  cost_per_cut: number;
  savings_vs_traditional: number;
}

export class CuttingOptimizationService {
  
  /**
   * Algoritmo principal de optimización de cortes
   * Implementa Bottom-Left Fill (BLF) con mejoras heurísticas
   */
  static optimizeCuts(cuts: CutItem[], material: Material): OptimizationResult {
    // Expandir cortes según cantidad
    const expandedCuts = this.expandCuts(cuts);
    
    // Generar solución principal
    const primarySolution = this.generateOptimalPattern(expandedCuts, material);
    
    // Generar alternativas
    const alternatives = this.generateAlternatives(expandedCuts, material);
    
    // Análisis de costos
    const costAnalysis = this.calculateCostAnalysis(primarySolution, material);
    
    // Generar recomendaciones
    const recommendations = this.generateRecommendations(primarySolution, expandedCuts);
    
    return {
      primary_solution: primarySolution,
      alternative_solutions: alternatives,
      cost_analysis: costAnalysis,
      recommendations
    };
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
   * Algoritmo Bottom-Left Fill mejorado
   */
  private static generateOptimalPattern(cuts: CutItem[], material: Material): CutPattern {
    // Ordenar cortes por área descendente (estrategia First Fit Decreasing)
    const sortedCuts = [...cuts].sort((a, b) => (b.width * b.height) - (a.width * a.height));
    
    const placedCuts: PlacedCut[] = [];
    const sheets: PlacedCut[][] = [];
    let currentSheet: PlacedCut[] = [];
    
    for (const cut of sortedCuts) {
      const position = this.findBestPosition(cut, currentSheet, material);
      
      if (position) {
        const placedCut: PlacedCut = {
          id: cut.id,
          x: position.x,
          y: position.y,
          width: position.rotated ? cut.height : cut.width,
          height: position.rotated ? cut.width : cut.height,
          rotated: position.rotated,
          description: cut.description,
          color: cut.color || '#3B82F6'
        };
        
        currentSheet.push(placedCut);
        placedCuts.push(placedCut);
      } else {
        // No cabe en la hoja actual, crear nueva hoja
        if (currentSheet.length > 0) {
          sheets.push([...currentSheet]);
          currentSheet = [];
        }
        
        // Intentar colocar en nueva hoja
        const newPosition = this.findBestPosition(cut, [], material);
        if (newPosition) {
          const placedCut: PlacedCut = {
            id: cut.id,
            x: newPosition.x,
            y: newPosition.y,
            width: newPosition.rotated ? cut.height : cut.width,
            height: newPosition.rotated ? cut.width : cut.height,
            rotated: newPosition.rotated,
            description: cut.description,
            color: cut.color || '#3B82F6'
          };
          
          currentSheet.push(placedCut);
          placedCuts.push(placedCut);
        }
      }
    }
    
    if (currentSheet.length > 0) {
      sheets.push(currentSheet);
    }

    // Calcular estadísticas
    const totalMaterialArea = material.width * material.height * sheets.length;
    const totalUsedArea = placedCuts.reduce((sum, cut) => sum + (cut.width * cut.height), 0);
    const efficiency = (totalUsedArea / totalMaterialArea) * 100;
    
    return {
      cuts: placedCuts,
      efficiency,
      waste: 100 - efficiency,
      sheets_needed: sheets.length,
      total_area_used: totalUsedArea,
      total_waste_area: totalMaterialArea - totalUsedArea
    };
  }

  /**
   * Encontrar la mejor posición para un corte en una hoja
   */
  private static findBestPosition(
    cut: CutItem, 
    existingCuts: PlacedCut[], 
    material: Material
  ): { x: number; y: number; rotated: boolean } | null {
    
    const positions = this.generatePossiblePositions(existingCuts, material);
    
    // Probar orientación normal
    for (const pos of positions) {
      if (this.canPlaceCut(cut.width, cut.height, pos.x, pos.y, existingCuts, material)) {
        return { x: pos.x, y: pos.y, rotated: false };
      }
    }
    
    // Probar orientación rotada (si es diferente)
    if (cut.width !== cut.height) {
      for (const pos of positions) {
        if (this.canPlaceCut(cut.height, cut.width, pos.x, pos.y, existingCuts, material)) {
          return { x: pos.x, y: pos.y, rotated: true };
        }
      }
    }
    
    return null;
  }

  /**
   * Generar posiciones posibles basadas en cortes existentes
   */
  private static generatePossiblePositions(existingCuts: PlacedCut[], material: Material) {
    const positions = [{ x: 0, y: 0 }]; // Esquina inferior izquierda
    
    // Agregar posiciones basadas en esquinas de cortes existentes
    for (const cut of existingCuts) {
      positions.push(
        { x: cut.x + cut.width + material.kerf, y: cut.y },
        { x: cut.x, y: cut.y + cut.height + material.kerf }
      );
    }
    
    // Ordenar por posición bottom-left
    return positions
      .filter(pos => pos.x < material.width && pos.y < material.height)
      .sort((a, b) => (a.y - b.y) || (a.x - b.x));
  }

  /**
   * Verificar si un corte puede ser colocado en una posición
   */
  private static canPlaceCut(
    width: number, 
    height: number, 
    x: number, 
    y: number, 
    existingCuts: PlacedCut[], 
    material: Material
  ): boolean {
    // Verificar límites del material
    if (x + width > material.width || y + height > material.height) {
      return false;
    }
    
    // Verificar solapamiento con cortes existentes
    for (const existing of existingCuts) {
      if (this.rectanglesOverlap(
        x, y, width, height,
        existing.x, existing.y, existing.width, existing.height,
        material.kerf
      )) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Verificar solapamiento entre rectángulos considerando tolerancia
   */
  private static rectanglesOverlap(
    x1: number, y1: number, w1: number, h1: number,
    x2: number, y2: number, w2: number, h2: number,
    kerf: number
  ): boolean {
    return !(
      x1 + w1 + kerf <= x2 ||
      x2 + w2 + kerf <= x1 ||
      y1 + h1 + kerf <= y2 ||
      y2 + h2 + kerf <= y1
    );
  }

  /**
   * Generar soluciones alternativas con diferentes estrategias
   */
  private static generateAlternatives(cuts: CutItem[], material: Material): CutPattern[] {
    const alternatives: CutPattern[] = [];
    
    // Alternativa 1: Ordenar por ancho
    const byWidth = [...cuts].sort((a, b) => b.width - a.width);
    alternatives.push(this.generateOptimalPattern(byWidth, material));
    
    // Alternativa 2: Ordenar por altura
    const byHeight = [...cuts].sort((a, b) => b.height - a.height);
    alternatives.push(this.generateOptimalPattern(byHeight, material));
    
    // Alternativa 3: Ordenar por perímetro
    const byPerimeter = [...cuts].sort((a, b) => 
      (2 * (b.width + b.height)) - (2 * (a.width + a.height))
    );
    alternatives.push(this.generateOptimalPattern(byPerimeter, material));
    
    return alternatives
      .filter(alt => alt.efficiency > 0)
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 3);
  }

  /**
   * Calcular análisis de costos
   */
  private static calculateCostAnalysis(pattern: CutPattern, material: Material): CostAnalysis {
    const materialAreaM2 = (material.width * material.height) / 1000000;
    const materialCost = materialAreaM2 * material.cost_per_m2 * pattern.sheets_needed;
    const wasteCost = (pattern.total_waste_area / 1000000) * material.cost_per_m2;
    const totalCost = materialCost;
    const costPerCut = totalCost / pattern.cuts.length;
    
    // Calcular ahorro vs método tradicional (asumiendo 70% eficiencia)
    const traditionalSheets = Math.ceil(pattern.cuts.length / (0.7 * materialAreaM2 / (pattern.total_area_used / pattern.cuts.length)));
    const traditionalCost = traditionalSheets * materialAreaM2 * material.cost_per_m2;
    const savings = traditionalCost - totalCost;
    
    return {
      material_cost: materialCost,
      waste_cost: wasteCost,
      total_cost: totalCost,
      cost_per_cut: costPerCut,
      savings_vs_traditional: Math.max(0, savings)
    };
  }

  /**
   * Generar recomendaciones de optimización
   */
  private static generateRecommendations(pattern: CutPattern, cuts: CutItem[]): string[] {
    const recommendations: string[] = [];
    
    if (pattern.efficiency < 80) {
      recommendations.push('Considerar rotación de piezas para mejorar aprovechamiento');
    }
    
    if (pattern.waste > 20) {
      recommendations.push('Revisar tolerancias de sierra para reducir desperdicio');
    }
    
    const smallCuts = cuts.filter(c => c.width * c.height < 50000);
    if (smallCuts.length > cuts.length * 0.3) {
      recommendations.push('Agrupar cortes pequeños para optimizar secuencia');
    }
    
    if (pattern.sheets_needed > 3) {
      recommendations.push('Considerar dividir el proyecto en lotes más pequeños');
    }
    
    return recommendations;
  }

  /**
   * Exportar patrón de corte a diferentes formatos
   */
  static exportPattern(pattern: CutPattern, material: Material, format: 'excel' | 'pdf' | 'image'): string {
    switch (format) {
      case 'excel':
        return this.exportToExcel(pattern, material);
      case 'pdf':
        return this.exportToPDF(pattern, material);
      case 'image':
        return this.exportToImage(pattern, material);
      default:
        throw new Error('Formato no soportado');
    }
  }

  private static exportToExcel(pattern: CutPattern, material: Material): string {
    // Simular exportación a Excel
    const data = {
      material: {
        dimensions: `${material.width}x${material.height}mm`,
        thickness: `${material.thickness}mm`,
        cost: `$${material.cost_per_m2}/m²`
      },
      cuts: pattern.cuts.map((cut, index) => ({
        numero: index + 1,
        descripcion: cut.description,
        dimensiones: `${cut.width}x${cut.height}mm`,
        posicion: `(${cut.x}, ${cut.y})`,
        rotado: cut.rotated ? 'Sí' : 'No',
        area: `${(cut.width * cut.height / 1000000).toFixed(4)} m²`
      })),
      resumen: {
        eficiencia: `${pattern.efficiency.toFixed(2)}%`,
        desperdicio: `${pattern.waste.toFixed(2)}%`,
        laminas: pattern.sheets_needed,
        area_utilizada: `${(pattern.total_area_used / 1000000).toFixed(4)} m²`,
        area_desperdicio: `${(pattern.total_waste_area / 1000000).toFixed(4)} m²`
      }
    };
    
    console.log('Datos para Excel:', data);
    return `patron_corte_${new Date().toISOString().split('T')[0]}.xlsx`;
  }

  private static exportToPDF(pattern: CutPattern, material: Material): string {
    // Simular exportación a PDF
    console.log('Generando PDF con patrón de corte');
    return `patron_corte_${new Date().toISOString().split('T')[0]}.pdf`;
  }

  private static exportToImage(pattern: CutPattern, material: Material): string {
    // Simular exportación a imagen
    console.log('Generando imagen del patrón de corte');
    return `patron_corte_${new Date().toISOString().split('T')[0]}.png`;
  }

  /**
   * Guardar proyecto de corte
   */
  static saveProject(
    name: string,
    cuts: CutItem[],
    material: Material,
    pattern: CutPattern,
    userId: string
  ): string {
    const project = {
      id: `project_${Date.now()}`,
      name,
      cuts,
      material,
      pattern,
      userId,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    // Guardar en localStorage (en producción sería base de datos)
    const projects = JSON.parse(localStorage.getItem('cutting_projects') || '[]');
    projects.push(project);
    localStorage.setItem('cutting_projects', JSON.stringify(projects));
    
    return project.id;
  }

  /**
   * Cargar proyectos guardados
   */
  static loadProjects(userId?: string): any[] {
    const projects = JSON.parse(localStorage.getItem('cutting_projects') || '[]');
    return userId ? projects.filter((p: any) => p.userId === userId) : projects;
  }

  /**
   * Calcular estadísticas históricas
   */
  static calculateHistoricalStats(projects: any[]): any {
    if (projects.length === 0) {
      return {
        averageEfficiency: 0,
        totalProjects: 0,
        totalSavings: 0,
        bestEfficiency: 0,
        worstEfficiency: 0
      };
    }

    const efficiencies = projects.map(p => p.pattern.efficiency);
    const savings = projects.map(p => p.pattern.cost_analysis?.savings_vs_traditional || 0);
    
    return {
      averageEfficiency: efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length,
      totalProjects: projects.length,
      totalSavings: savings.reduce((a, b) => a + b, 0),
      bestEfficiency: Math.max(...efficiencies),
      worstEfficiency: Math.min(...efficiencies),
      efficiencyTrend: this.calculateTrend(efficiencies),
      materialTypes: this.groupByMaterialType(projects)
    };
  }

  private static calculateTrend(values: number[]): 'improving' | 'declining' | 'stable' {
    if (values.length < 2) return 'stable';
    
    const recent = values.slice(-3);
    const older = values.slice(-6, -3);
    
    if (recent.length === 0 || older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    const difference = recentAvg - olderAvg;
    
    if (difference > 2) return 'improving';
    if (difference < -2) return 'declining';
    return 'stable';
  }

  private static groupByMaterialType(projects: any[]): any {
    return projects.reduce((acc, project) => {
      const type = project.material.type;
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          averageEfficiency: 0,
          totalSavings: 0
        };
      }
      acc[type].count++;
      acc[type].averageEfficiency += project.pattern.efficiency;
      acc[type].totalSavings += project.pattern.cost_analysis?.savings_vs_traditional || 0;
      return acc;
    }, {});
  }

  /**
   * Algoritmo de optimización genética (versión simplificada)
   */
  static geneticOptimization(cuts: CutItem[], material: Material, generations: number = 50): CutPattern {
    // Implementación simplificada del algoritmo genético
    let bestPattern = this.generateOptimalPattern(cuts, material);
    
    for (let gen = 0; gen < generations; gen++) {
      // Generar población de soluciones
      const population = this.generatePopulation(cuts, material, 20);
      
      // Evaluar fitness (eficiencia)
      const evaluated = population.map(pattern => ({
        pattern,
        fitness: pattern.efficiency
      }));
      
      // Seleccionar mejor solución
      const best = evaluated.sort((a, b) => b.fitness - a.fitness)[0];
      
      if (best.fitness > bestPattern.efficiency) {
        bestPattern = best.pattern;
      }
    }
    
    return bestPattern;
  }

  private static generatePopulation(cuts: CutItem[], material: Material, size: number): CutPattern[] {
    const population: CutPattern[] = [];
    
    for (let i = 0; i < size; i++) {
      // Crear variación aleatoria en el orden de cortes
      const shuffledCuts = [...cuts].sort(() => Math.random() - 0.5);
      const pattern = this.generateOptimalPattern(shuffledCuts, material);
      population.push(pattern);
    }
    
    return population;
  }
}

// Utilidades para cálculos geométricos
export class GeometryUtils {
  static calculateArea(width: number, height: number): number {
    return width * height;
  }

  static calculatePerimeter(width: number, height: number): number {
    return 2 * (width + height);
  }

  static mmToM2(areaMm2: number): number {
    return areaMm2 / 1000000;
  }

  static m2ToMm(areaM2: number): number {
    return areaM2 * 1000000;
  }

  static calculateWeight(area: number, thickness: number, density: number): number {
    // área en mm², espesor en mm, densidad en g/cm³
    const volume = area * thickness; // mm³
    const volumeCm3 = volume / 1000; // cm³
    return volumeCm3 * density; // gramos
  }
}