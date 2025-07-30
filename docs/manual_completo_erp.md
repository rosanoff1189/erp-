# Manual Completo ERP Nube Aluminio/Vidrio

## Introducción
ERP Nube Aluminio/Vidrio es un sistema integral de gestión empresarial diseñado específicamente para empresas del sector de aluminio y vidrio. Ofrece funcionalidades completas para la gestión de ventas, compras, inventario, facturación electrónica SAT y administración avanzada.

## Características Principales

### Diseño y Usabilidad
- **Tema**: Fondo blanco minimalista con colores secundarios (#0080FF, #2EC4B6, #FFBF00)
- **Interfaz**: Responsive con animaciones suaves y movimiento UI
- **Multiempresa**: Soporte para múltiples empresas
- **Multiusuario**: Sistema robusto de usuarios y permisos configurables
- **Sucursales**: Gestión de múltiples sucursales
- **Exportaciones**: Excel, PDF, CSV
- **Integración**: MySQL/SQL Server completa

## Instalación y Configuración

### Requisitos del Sistema
- Servidor web (Apache/Nginx)
- PHP 8.0 o superior
- MySQL 8.0 o MariaDB 10.5+
- Node.js 18+ (para el frontend)

### Pasos de Instalación

1. **Crear Base de Datos**
   ```sql
   CREATE DATABASE erp_aluminio_vidrio;
   ```

2. **Ejecutar Scripts SQL**
   - Utiliza el script SQL completo incluido
   - Configura usuarios y permisos iniciales
   - Pobla con datos de demostración

3. **Configurar Conexión**
   - Configura credenciales de base de datos
   - Establece parámetros de conexión

4. **Registrar API SAT**
   - Configura credenciales para facturación electrónica
   - Prueba conexión con el PAC (Facturama, FacturoPorTi, etc.)

### Asistente de Creación Automática
El sistema incluye un **botón especial** en Utilerías > Administrador BD que permite:
- Crear toda la estructura ERP desde cero
- Poblar automáticamente con datos de demostración
- Configurar catálogos SAT
- Establecer usuarios y roles por defecto
- Configurar sucursales múltiples

## Módulos del Sistema

### 1. Dashboard
Panel principal con métricas y KPIs en tiempo real:
- Ventas del mes con tendencias
- Órdenes pendientes
- Productos en stock
- Clientes activos
- Gráficos interactivos
- Actividad reciente

### 2. Archivo
- **Catálogos SAT**: Gestión completa de catálogos fiscales con sincronización
- **Líneas de Producción**: Configuración de líneas de productos especializadas
- **Acabados de Aluminio**: Catálogo completo de acabados, colores y características
- **Conceptos CxC y CxP**: Configuración de conceptos contables
- **Choferes**: Gestión completa de conductores con licencias y vencimientos
- **Autotransporte**: Flota vehicular con seguros y mantenimiento
- **Reparto**: Rutas y zonas de entrega optimizadas
- **Reportes**: Centro de reportes especializados del módulo

### 3. Catálogos
- **Productos**: Gestión completa de inventario con códigos SAT
- **Clientes**: CRM avanzado con múltiples vistas y gestión de cartera
- **Proveedores**: Gestión completa de cuentas por pagar
- **Vendedores**: Equipo de ventas con comisiones y metas

### 4. Inventario
- **Movimientos**: Historial completo con trazabilidad
- **Notas de Entrada**: Recepciones de mercancía con validaciones
- **Notas de Salida**: Entregas y despachos controlados
- **Inventario Físico**: Conteos cíclicos y ajustes
- **Trazabilidad**: Seguimiento completo por lotes y ubicaciones

### 5. Ventas
- **Facturas**: CFDI 4.0 con timbrado SAT automático
- **Cotizaciones**: Propuestas comerciales con seguimiento
- **Pedidos**: Órdenes de venta con control de producción
- **Remisiones**: Notas de entrega con control de facturación
- **Cuentas por Cobrar**: Gestión avanzada de cartera
- **Devoluciones**: Notas de crédito y cambios

### 6. Compras
- **Órdenes de Compra**: Solicitudes con aprobaciones
- **Compras**: Registro de recepciones con validaciones
- **Cotizaciones**: Solicitudes de cotización comparativas
- **Cuentas por Pagar**: Gestión de pagos con vencimientos

### 7. Configuración
- **Datos de la Empresa**: Información fiscal completa
- **Usuarios**: Gestión avanzada de cuentas
- **Roles y Permisos**: Control granular de acceso
- **Sucursales**: Configuración multi-sucursal

### 8. Utilerías (Módulo Avanzado)

#### Control de Usuarios
- Gestión avanzada de usuarios, roles y permisos
- Bitácora completa de accesos y actividades
- Auditoría de cambios con valores anteriores/nuevos
- Restablecimiento de contraseñas
- Búsqueda avanzada y filtros

#### Procesos Especiales
- **Actualización Masiva**: Clientes, proveedores, precios
- **Cancelación Masiva CFDI**: Por rangos de fechas con motivos SAT
- **Importar/Exportar**: Datos masivos (productos, precios, mínimos/máximos, pedidos)
- **Verificar Sellos Digitales SAT**: Validación de integridad
- **Gestionar Acabados**: Actualización masiva de características
- **Actualizar Leyenda Fiscal**: Modificación de leyendas en facturas
- **Reportes Masivos**: Generación de reportes completos
- **Actualizar Precios**: Por porcentaje, manual o Excel
- **Importar Catálogo SAT**: Productos y servicios actualizados
- **Sincronizar Inventario**: Multi-almacén y sucursales

#### Administrador de Base de Datos
- **Respaldo**: Completo, estructura o solo datos
- **Restauración**: Desde archivos de respaldo
- **Clonado**: Copias exactas de la BD
- **Migración**: Entre versiones del sistema
- **Optimización**: Mejora de rendimiento
- **Asistente ERP**: Creación completa de estructura

## Gestión Avanzada de Clientes

### Vistas Disponibles
1. **Lista Estándar**: Vista tabular tradicional con filtros
2. **Tarjetas/Grid**: Vista de tarjetas con información resumida
3. **Ficha Detallada**: Vista completa con histórico y políticas

### Filtros Avanzados
- RFC (búsqueda exacta o parcial)
- Nombre/Razón Social
- Status (Activo/Inactivo)
- Sucursal
- Rango de Saldo
- Fecha de última compra
- Método de pago preferido
- Precio especial (Sí/No)

### Funcionalidades Avanzadas
- **Exportar Excel**: Desde cualquier vista o filtro aplicado
- **Ficha Completa**: 
  - Datos generales y fiscales
  - Políticas comerciales
  - Histórico completo de ventas
  - Observaciones y comentarios
  - Información SAT detallada
  - Estado financiero actual

## Importación y Exportación de Datos

### Plantillas de Importación Disponibles

#### Clientes (clientes.csv)
```csv
nombre,status,telefono,correo,direccion,rfc,saldo,precio_especial,descuento,metodo_pago_preferido,comentarios
"Constructora ABC","Activo","555-0123","contacto@abc.com","Av. Reforma 123","CABC123456789",85430.50,TRUE,15.0,"Transferencia","Cliente preferencial"
```

#### Productos (productos.csv)
```csv
codigo,descripcion,status,linea,ubicacion,unidad_sat,clave_sat,precio_base,costo,stock_min,stock_max
"VT-6MM-001","Vidrio Templado 6mm","Activo","Vidrios","A-01-15","M2","43211701",350.00,210.00,50,500
```

#### Proveedores (proveedores.csv)
```csv
nombre,status,telefono,correo,direccion,rfc,saldo,metodo_pago_habitual,condiciones_credito,contacto_principal,categoria
"Aluminios SA","Activo","555-1001","ventas@aluminios.com","Zona Industrial 15","AIN123456789",125430.50,"Transferencia","30 días","Ing. María López","Materia Prima"
```

#### Precios (precios.csv)
```csv
codigo,precio_base,costo,descuento,fecha_vigencia
"VT-6MM-001",350.00,210.00,0.0,"2024-02-01"
```

#### Inventario (inventario.csv)
```csv
codigo,stock_actual,stock_min,stock_max,ubicacion,lote
"VT-6MM-001",125,50,500,"A-01-15","LT-2024-001"
```

### Proceso de Importación
1. Acceder a **Utilerías > Importar/Exportar**
2. Seleccionar tipo de importación
3. Descargar plantilla correspondiente
4. Llenar datos en Excel/CSV
5. Arrastrar archivo o seleccionar
6. Ejecutar proceso y revisar resultados detallados

### Exportaciones Disponibles
- **Clientes Completo**: Con histórico de ventas
- **Productos Completo**: Con precios, costos y existencias
- **Inventario Actual**: Por almacén y ubicación
- **Ventas por Período**: Reportes detallados
- **Cartera de Clientes**: Análisis de saldos
- **Cuentas por Pagar**: Vencimientos y saldos
- **Movimientos de Inventario**: Historial completo
- **Facturas SAT**: Con datos fiscales y UUID

## Facturación Electrónica SAT (CFDI 4.0)

### Configuración de API
El sistema soporta múltiples proveedores de timbrado:
- **Facturama**: API completa con timbrado y cancelación
- **FacturoPorTi**: Integración directa
- **Finkok**: Soporte completo
- **Otros PACs**: Configuración personalizable

### Ejemplo de Integración
```javascript
const facturaData = {
  "Serie": "A",
  "Folio": "789",
  "Fecha": "2025-01-30T11:00:00",
  "FormaPago": "01",
  "MetodoPago": "PUE",
  "LugarExpedicion": "64000",
  "Moneda": "MXN",
  "TipoDeComprobante": "I",
  "Receptor": {
    "Rfc": "CABC123456789",
    "Nombre": "Constructora ABC S.A. de C.V.",
    "UsoCFDI": "G03"
  },
  "Conceptos": [{
    "ClaveProdServ": "43211701",
    "Cantidad": 10,
    "Unidad": "M2",
    "Descripcion": "Vidrio Templado 6mm",
    "ValorUnitario": 350.00,
    "Importe": 3500.00
  }]
};
```

### Funcionalidades SAT
- **Timbrado Automático**: Al guardar facturas
- **Cancelación Masiva**: Por rangos de fechas
- **Verificación de Sellos**: Validación de integridad
- **Importación de Catálogos**: Productos y servicios SAT
- **Actualización de Leyendas**: Fiscales personalizables

## Procesos Especiales Avanzados

### Actualización Masiva
- **Clientes**: Datos completos desde Excel
- **Proveedores**: Información comercial
- **Precios**: Por porcentaje, línea o archivo Excel
- **Inventario**: Mínimos, máximos y ubicaciones

### Facturación SAT Avanzada
- **Cancelación Masiva CFDI**: Con motivos específicos
- **Verificar Sellos**: Validación en línea con SAT
- **Actualizar Leyenda Fiscal**: Personalización de textos
- **Importar Catálogo SAT**: Actualización automática

### Gestión de Productos
- **Acabados**: Colores, tipos y costos adicionales
- **Catálogo SAT**: Importación de productos oficiales
- **Mínimos/Máximos**: Actualización masiva de niveles
- **Sincronización**: Entre almacenes y sucursales

## Administración de Base de Datos

### Operaciones Disponibles
- **Respaldo Completo**: Estructura y datos
- **Respaldo Incremental**: Solo cambios
- **Restauración**: Desde archivos de respaldo
- **Clonado**: Copias exactas para pruebas
- **Migración**: Actualización entre versiones
- **Optimización**: Mejora de rendimiento automática

### Asistente de Creación ERP
Función especial que permite:
1. **Crear Estructura Completa**: Todas las tablas necesarias
2. **Poblar con Datos Demo**: Información de prueba realista
3. **Configurar Catálogos SAT**: Productos y servicios oficiales
4. **Establecer Usuarios**: Roles y permisos por defecto
5. **Configurar Empresa**: Datos fiscales básicos

### Monitoreo y Estadísticas
- **Tamaño de BD**: Monitoreo en tiempo real
- **Número de Tablas**: Control de estructura
- **Registros Totales**: Conteo automático
- **Último Respaldo**: Fecha y hora
- **Versión**: Control de versiones
- **Conexiones Activas**: Monitoreo de usuarios

## Roles y Permisos Avanzados

### Roles Predefinidos
- **Administrador**: Acceso completo al sistema
- **Vendedor**: Ventas, clientes y cotizaciones
- **Almacenista**: Inventario y movimientos
- **Comprador**: Compras, proveedores y órdenes
- **Contador**: Facturación, reportes y contabilidad
- **Gerente**: Supervisión y reportes ejecutivos

### Permisos Configurables
- **Lectura/Escritura**: Por módulo específico
- **Restricciones por Sucursal**: Control geográfico
- **Límites de Montos**: Aprobaciones requeridas
- **Horarios de Acceso**: Control temporal
- **IP Permitidas**: Seguridad por ubicación

## Seguridad y Auditoría

### Bitácora de Accesos
- **Inicios de Sesión**: Fecha, hora e IP
- **Intentos Fallidos**: Control de seguridad
- **Acciones por Usuario**: Registro detallado
- **Módulos Accedidos**: Trazabilidad completa
- **Tiempo de Sesión**: Control de actividad

### Auditoría de Cambios
- **Registro de Modificaciones**: Antes y después
- **Usuario Responsable**: Trazabilidad completa
- **Fecha y Hora Exacta**: Timestamp preciso
- **Tabla y Registro**: Identificación específica
- **Tipo de Operación**: INSERT, UPDATE, DELETE

### Control de Usuarios
- **Bloqueo Automático**: Por intentos fallidos
- **Restablecimiento de Contraseñas**: Proceso seguro
- **Sesiones Múltiples**: Control y limitación
- **Caducidad de Contraseñas**: Políticas configurables

## Filtros y Consultas Avanzadas

### Filtros Disponibles
- **Por RFC**: Búsqueda exacta o parcial con validación
- **Por Nombre**: Búsqueda en razón social completa
- **Por Status**: Activo/Inactivo con subcategorías
- **Por Sucursal**: Filtrado geográfico
- **Por Saldo**: Rangos configurables
- **Por Fecha**: Períodos personalizables
- **Por Vendedor**: Asignación específica
- **Por Línea de Producto**: Categorización

### Exportaciones Inteligentes
- **Mantener Filtros**: En exportaciones
- **Incluir Totales**: Resúmenes automáticos
- **Formatos Múltiples**: Excel, PDF, CSV
- **Plantillas Personalizables**: Diseño propio
- **Programación**: Exportaciones automáticas

## Integración con Sistemas Externos

### APIs Disponibles
- **Facturación SAT**: Múltiples proveedores
- **Bancos**: Conciliación automática
- **Marketplaces**: Importación de pedidos
- **Contabilidad**: Exportación de pólizas
- **CRM**: Sincronización de clientes

### Webhooks
- **Notificaciones**: Eventos importantes
- **Sincronización**: Datos en tiempo real
- **Alertas**: Configurables por usuario
- **Integraciones**: Sistemas terceros

## Reportes y Análisis

### Reportes Estándar
- **Ventas por Período**: Detallado y resumido
- **Inventario**: Existencias y movimientos
- **Cartera**: Antigüedad de saldos
- **Compras**: Por proveedor y período
- **Facturación**: Con datos SAT
- **Comisiones**: Por vendedor

### Reportes Personalizables
- **Constructor Visual**: Drag & drop
- **Filtros Dinámicos**: Configurables
- **Gráficos**: Múltiples tipos
- **Exportación**: Varios formatos
- **Programación**: Automática

## Mantenimiento y Soporte

### Actualizaciones Automáticas
- **Notificaciones**: Nuevas versiones
- **Respaldo Automático**: Antes de actualizar
- **Migración**: Datos automática
- **Verificación**: Integridad post-actualización
- **Rollback**: En caso de problemas

### Soporte Técnico
- **Documentación**: Completa y actualizada
- **Videos Tutoriales**: Paso a paso
- **Base de Conocimientos**: Preguntas frecuentes
- **Soporte en Línea**: Chat integrado
- **Actualizaciones**: Automáticas y manuales

### Monitoreo del Sistema
- **Performance**: Métricas en tiempo real
- **Uso de Recursos**: CPU, memoria, disco
- **Conexiones**: Usuarios activos
- **Errores**: Log detallado
- **Alertas**: Configurables

## Casos de Uso Específicos

### Empresa de Cancelería
- **Productos**: Ventanas, puertas, fachadas
- **Acabados**: Múltiples opciones de aluminio
- **Medidas**: Productos a medida
- **Instalación**: Control de servicios
- **Garantías**: Seguimiento post-venta

### Distribuidor de Vidrio
- **Inventario**: Control por lotes
- **Cortes**: Optimización de material
- **Transporte**: Cuidado especial
- **Merma**: Control de desperdicios
- **Calidad**: Inspecciones

### Fabricante de Herrajes
- **Producción**: Control de procesos
- **Materias Primas**: Gestión de insumos
- **Acabados**: Múltiples procesos
- **Empaque**: Control de presentaciones
- **Distribución**: Red de vendedores

## Mejores Prácticas

### Configuración Inicial
1. **Configurar Empresa**: Datos fiscales completos
2. **Crear Sucursales**: Según estructura organizacional
3. **Definir Usuarios**: Roles y permisos específicos
4. **Importar Catálogos**: Productos, clientes, proveedores
5. **Configurar API SAT**: Para facturación electrónica
6. **Establecer Respaldos**: Programación automática

### Operación Diaria
1. **Revisar Dashboard**: Métricas importantes
2. **Procesar Pedidos**: Flujo de ventas
3. **Actualizar Inventario**: Movimientos diarios
4. **Generar Facturas**: Timbrado automático
5. **Revisar Alertas**: Stocks, vencimientos
6. **Exportar Reportes**: Análisis periódicos

### Mantenimiento Periódico
1. **Respaldos**: Verificar programación
2. **Optimización**: Base de datos mensual
3. **Limpieza**: Datos obsoletos
4. **Actualización**: Catálogos SAT
5. **Revisión**: Permisos y usuarios
6. **Auditoría**: Cambios importantes

## Solución de Problemas

### Problemas Comunes
- **Conexión BD**: Verificar credenciales
- **Timbrado SAT**: Revisar configuración API
- **Importación**: Validar formato de archivos
- **Permisos**: Verificar roles de usuario
- **Performance**: Optimizar base de datos

### Herramientas de Diagnóstico
- **Log del Sistema**: Errores detallados
- **Monitor de Performance**: Métricas en tiempo real
- **Verificador de Integridad**: Base de datos
- **Test de Conexiones**: APIs externas
- **Validador de Datos**: Consistencia

## Contacto y Soporte

### Información de Contacto
- **Email**: soporte@erpnube.com
- **Teléfono**: 01-800-ERP-NUBE
- **Chat**: Disponible en el sistema
- **Portal**: https://soporte.erpnube.com

### Recursos Adicionales
- **Videos Tutoriales**: Canal de YouTube
- **Base de Conocimientos**: Wiki completa
- **Foro de Usuarios**: Comunidad activa
- **Webinars**: Entrenamientos regulares
- **Certificaciones**: Programas de capacitación

---

*Este manual se actualiza constantemente. Para la versión más reciente, consulte la ayuda en línea del sistema o visite nuestro portal de soporte.*

**Versión del Manual**: 3.0  
**Fecha de Actualización**: Enero 2024  
**Sistema**: ERP Nube Aluminio/Vidrio v3.0