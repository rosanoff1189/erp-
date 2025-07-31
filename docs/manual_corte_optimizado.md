# Manual del Módulo de Corte Optimizado
## ERP Nube Aluminio/Vidrio v3.0

## Introducción

El módulo de **Corte Optimizado** es una herramienta avanzada que utiliza algoritmos de optimización para calcular el patrón de cortes más eficiente en materiales como vidrio, aluminio y acero. Reduce el desperdicio, minimiza costos y optimiza el tiempo de producción.

## Características Principales

### 🎯 **Optimización Avanzada**
- **Algoritmos híbridos** que combinan múltiples estrategias
- **Cálculo en tiempo real** con actualización dinámica
- **Múltiples alternativas** de optimización
- **Aprovechamiento superior al 90%** en casos óptimos

### 📊 **Visualización Interactiva**
- **Vista gráfica** con representación proporcional del material
- **Simulación paso a paso** del proceso de corte
- **Colores distintivos** para cada tipo de corte
- **Indicadores visuales** de desperdicio y tolerancias

### 📱 **Totalmente Responsivo**
- **Funciona en móvil, tablet y desktop** sin perder funcionalidad
- **Interfaz táctil** optimizada para uso en planta
- **Pantalla completa** para mejor visualización
- **Controles gestuales** para zoom y navegación

## Acceso al Módulo

### Ubicación en el Menú
El módulo se encuentra en el menú principal, ubicado estratégicamente **antes de Utilerías** para acceso prioritario.

### Acceso Rápido desde Otros Módulos
- **Dashboard**: Botón "Optimizar Corte" en acciones rápidas
- **Inventario**: Enlace directo desde fichas de productos
- **Ventas**: Acceso desde pedidos y cotizaciones
- **Productos**: Botón de optimización en cada producto

## Flujo de Trabajo

### 1. Configuración del Material Base

#### Materiales Preconfigurados
El sistema incluye materiales comunes preconfigurados:
- **Vidrio Templado 6mm**: 2440×1220mm, $350/m²
- **Vidrio Laminado 8mm**: 2440×1220mm, $520/m²
- **Aluminio Natural 3mm**: 3000×1500mm, $145.50/m²
- **Acero Galvanizado 2mm**: 2000×1000mm, $89.50/m²

#### Configuración Manual
```
Tipo de Material: Vidrio/Aluminio/Acero/Madera/Otro
Dimensiones: Ancho × Alto × Espesor (mm)
Costo por m²: Precio del material
Tolerancia Sierra: Grosor del corte (kerf)
```

#### Configuración Avanzada
- **Dirección de corte preferida**: Horizontal/Vertical/Automático
- **Velocidad de simulación**: Rápida/Normal/Lenta
- **Nombre de plantilla**: Para reutilización

### 2. Definición de Cortes

#### Agregar Cortes
Para cada corte requerido, especificar:
- **Descripción**: Nombre descriptivo del corte
- **Dimensiones**: Ancho × Alto en milímetros
- **Cantidad**: Número de piezas requeridas
- **Color**: Color distintivo para visualización

#### Validación Automática
El sistema valida automáticamente:
- ✅ Dimensiones positivas
- ✅ Cortes que caben en el material
- ✅ Descripciones completas
- ⚠️ Alertas visuales para errores

#### Funciones Avanzadas
- **Duplicar cortes**: Copiar cortes similares
- **Arrastrar y reordenar**: Cambiar secuencia manualmente
- **Plantillas**: Guardar y reutilizar patrones comunes

### 3. Cálculo de Optimización

#### Algoritmos Utilizados
1. **Bottom-Left Fill (BLF)**: Algoritmo principal
2. **Best Fit**: Optimización por mejor ajuste
3. **Guillotine**: Para cortes rectos preferidos
4. **Híbrido**: Combina múltiples estrategias

#### Cálculo Automático
- **Actualización en tiempo real** al modificar datos
- **Múltiples alternativas** generadas automáticamente
- **Validación de factibilidad** antes del cálculo

### 4. Visualización de Resultados

#### Vista Gráfica
- **Representación proporcional** del material base
- **Cortes coloreados** con numeración secuencial
- **Áreas de desperdicio** marcadas en gris
- **Tolerancias de sierra** visualizadas
- **Dimensiones y etiquetas** superpuestas

#### Vista Lista
Tabla detallada con:
- Orden de corte
- Descripción
- Dimensiones finales
- Posición en el material
- Área individual
- Estado de rotación

#### Vista Miniaturas
- **Múltiples láminas** cuando es necesario
- **Comparación visual** de alternativas
- **Resumen de eficiencia** por lámina

### 5. Simulación Interactiva

#### Controles de Simulación
- **▶️ Iniciar**: Comenzar simulación paso a paso
- **⏸️ Pausar**: Detener temporalmente
- **🔄 Reiniciar**: Volver al inicio
- **⏩ Velocidad**: Ajustar velocidad de animación

#### Características de la Simulación
- **Animación fluida** de colocación de cortes
- **Barra de progreso** visual
- **Indicadores de paso actual**
- **Visualización de secuencia** de producción

### 6. Alternativas de Optimización

#### Estrategias Disponibles
- **Optimización A**: Prioriza cortes por ancho
- **Optimización B**: Prioriza cortes por altura  
- **Optimización C**: Balance óptimo por perímetro
- **Optimización Principal**: Mejor resultado híbrido

#### Comparación de Alternativas
- **Aprovechamiento** de cada estrategia
- **Número de láminas** requeridas
- **Facilidad de corte** estimada
- **Selección rápida** entre alternativas

## Análisis de Resultados

### Estadísticas Principales
- **Aprovechamiento**: Porcentaje de material utilizado
- **Desperdicio**: Porcentaje y área de material no utilizado
- **Láminas necesarias**: Cantidad de material base requerido
- **Cortes ubicados**: Número de cortes que caben
- **Tiempo estimado**: Duración estimada de producción

### Análisis de Costos
- **Costo total del material**: Basado en precio por m²
- **Costo del desperdicio**: Valor del material no utilizado
- **Ahorro vs método tradicional**: Comparación con corte manual
- **Costo por corte**: Distribución del costo total

### Recomendaciones Inteligentes
El sistema genera recomendaciones automáticas:
- 💡 **Mejoras de eficiencia**: Sugerencias para optimizar
- ⚠️ **Alertas de problemas**: Identificación de issues
- 🔧 **Ajustes técnicos**: Modificaciones recomendadas
- ✅ **Confirmaciones**: Validación de buenas prácticas

## Exportación y Documentación

### Formatos de Exportación

#### 🖼️ **Imagen PNG**
- **Plano visual** del patrón de corte
- **Alta resolución** para impresión
- **Leyenda de colores** incluida
- **Dimensiones y tolerancias** marcadas

#### 📊 **Excel Detallado**
```
Hoja 1: Resumen del Proyecto
- Material utilizado
- Estadísticas de aprovechamiento
- Análisis de costos

Hoja 2: Lista de Cortes
- Orden de corte
- Descripción
- Dimensiones
- Posición
- Estado de rotación

Hoja 3: Análisis de Desperdicio
- Áreas no utilizadas
- Recomendaciones de mejora
```

#### 📄 **Reporte PDF**
- **Plano técnico** para producción
- **Lista de materiales** requeridos
- **Instrucciones de corte** paso a paso
- **Análisis de costos** detallado

### Plantillas y Reutilización

#### Guardar Plantillas
- **Patrones frecuentes**: Para pedidos repetitivos
- **Configuraciones de material**: Reutilizar configuraciones
- **Proyectos tipo**: Para diferentes categorías

#### Cargar Plantillas
- **Acceso rápido** a patrones guardados
- **Modificación sobre plantilla** existente
- **Historial de uso** y popularidad

## Configuración Avanzada

### Tolerancias y Precisión
- **Tolerancia de sierra (kerf)**: Grosor del corte
- **Precisión de posicionamiento**: Ajuste fino
- **Margen de seguridad**: Espacio adicional

### Optimización Personalizada
- **Dirección de corte**: Horizontal/Vertical preferido
- **Prioridad de cortes**: Orden de importancia
- **Rotación permitida**: Habilitar/deshabilitar rotación
- **Algoritmo preferido**: Selección de estrategia

### Integración con Producción
- **Códigos QR**: Para identificación en planta
- **Secuencia optimizada**: Orden de corte eficiente
- **Tiempo estimado**: Planificación de producción
- **Control de calidad**: Verificaciones automáticas

## Historial y Análisis

### Registro de Proyectos
Todos los proyectos se guardan automáticamente con:
- **Fecha y hora** de cálculo
- **Usuario responsable**
- **Cliente asociado**
- **Material utilizado**
- **Resultados de optimización**

### Estadísticas Históricas
- **Aprovechamiento promedio** por período
- **Ahorro acumulado** vs método tradicional
- **Tendencias de eficiencia** por material
- **Proyectos más exitosos**

### Análisis por Material
- **Eficiencia por tipo** de material
- **Costos promedio** por proyecto
- **Tiempo de corte** estimado vs real
- **Proveedores más eficientes**

## Casos de Uso Específicos

### 🏠 **Cancelería Residencial**
- **Ventanas estándar**: 800×600mm, 400×300mm
- **Puertas**: 900×2100mm, 700×2100mm
- **Aprovechamiento típico**: 85-92%
- **Material preferido**: Vidrio templado 6mm

### 🏢 **Proyectos Comerciales**
- **Fachadas**: Paneles grandes 1200×800mm
- **Ventanería**: Múltiples tamaños modulares
- **Aprovechamiento típico**: 88-95%
- **Material preferido**: Vidrio laminado 8mm

### 🏭 **Aplicaciones Industriales**
- **Estructuras**: Perfiles y láminas de acero
- **Protecciones**: Paneles de seguridad
- **Aprovechamiento típico**: 75-85%
- **Material preferido**: Acero galvanizado

## Mejores Prácticas

### ✅ **Recomendaciones de Uso**
1. **Agrupar cortes similares** en un mismo proyecto
2. **Verificar tolerancias** antes de producción
3. **Usar plantillas** para proyectos repetitivos
4. **Revisar alternativas** antes de decidir
5. **Documentar modificaciones** en observaciones

### ⚠️ **Precauciones**
1. **Validar dimensiones** del material disponible
2. **Considerar limitaciones** de maquinaria
3. **Verificar stock** antes de optimizar
4. **Revisar costos** actualizados de materiales

### 🔧 **Optimización de Resultados**
1. **Ajustar tolerancias** según maquinaria real
2. **Permitir rotación** cuando sea posible
3. **Usar dirección automática** para mejor resultado
4. **Considerar múltiples láminas** si es más eficiente

## Integración con Otros Módulos

### 📦 **Inventario**
- **Verificación de stock** automática
- **Reserva de material** para proyectos
- **Actualización de existencias** post-corte

### 💰 **Ventas**
- **Cotizaciones precisas** basadas en optimización
- **Cálculo de costos** real del material
- **Tiempo de entrega** estimado

### 👥 **Clientes**
- **Historial de proyectos** por cliente
- **Patrones frecuentes** identificados
- **Descuentos por volumen** aplicados

### 📊 **Reportes**
- **Estadísticas de eficiencia** por período
- **Análisis de desperdicios** por material
- **ROI del módulo** de optimización

## Soporte Técnico

### 🆘 **Problemas Comunes**

#### "No se puede calcular optimización"
- ✅ Verificar que todos los cortes tengan dimensiones válidas
- ✅ Confirmar que los cortes caben en el material
- ✅ Revisar que haya al menos un corte definido

#### "Aprovechamiento muy bajo"
- 💡 Probar diferentes alternativas de optimización
- 💡 Ajustar tolerancias de sierra
- 💡 Considerar material de diferentes dimensiones
- 💡 Permitir rotación de cortes

#### "Algunos cortes no caben"
- 🔧 Verificar dimensiones del material base
- 🔧 Reducir tolerancias si es posible
- 🔧 Dividir proyecto en múltiples láminas
- 🔧 Considerar cortes en diagonal

### 📞 **Contacto de Soporte**
- **Email**: soporte@erpnube.com
- **Teléfono**: 01-800-ERP-NUBE
- **Chat en línea**: Disponible en el sistema
- **Documentación**: https://docs.erpnube.com/corte-optimizado

## Actualizaciones y Mejoras

### 🆕 **Versión 3.0 - Características Nuevas**
- ✨ **Simulación en tiempo real** con animaciones
- ✨ **Múltiples vistas** (gráfica, lista, miniaturas)
- ✨ **Algoritmos híbridos** mejorados
- ✨ **Exportación avanzada** en múltiples formatos
- ✨ **Plantillas inteligentes** con reutilización
- ✨ **Análisis de costos** detallado
- ✨ **Recomendaciones automáticas**

### 🔮 **Próximas Mejoras**
- **Optimización multi-material**: Combinar diferentes materiales
- **IA predictiva**: Aprendizaje de patrones de uso
- **Integración con maquinaria**: Control directo de equipos
- **Realidad aumentada**: Visualización 3D del corte

---

**Versión del Manual**: 3.0  
**Fecha de Actualización**: Enero 2025  
**Compatibilidad**: ERP Nube Aluminio/Vidrio v3.0+