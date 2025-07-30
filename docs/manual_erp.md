# Manual ERP Nube Aluminio/Vidrio

## Introducción
ERP Nube Aluminio/Vidrio es un sistema integral de gestión empresarial diseñado específicamente para empresas del sector de aluminio y vidrio. Ofrece funcionalidades completas para la gestión de ventas, compras, inventario, facturación electrónica SAT y administración.

## Características Principales

### Diseño y Usabilidad
- **Tema**: Fondo blanco minimalista con colores secundarios (#0080FF, #2EC4B6, #FFBF00)
- **Interfaz**: Responsive y con animaciones suaves
- **Multiempresa**: Soporte para múltiples empresas
- **Multiusuario**: Sistema robusto de usuarios y permisos
- **Sucursales**: Gestión de múltiples sucursales

### Exportaciones
- Excel (.xlsx)
- PDF
- CSV

### Integración
- MySQL/SQL Server
- APIs de facturación SAT (Facturama, FacturoPorTi, etc.)

## Instalación

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
   - Ejecuta los scripts de creación de tablas
   - Configura usuarios y permisos iniciales

3. **Configurar Conexión**
   - Configura credenciales de base de datos
   - Establece parámetros de conexión

4. **Registrar API SAT**
   - Configura credenciales para facturación electrónica
   - Prueba conexión con el PAC

## Módulos del Sistema

### 1. Dashboard
Panel principal con métricas y KPIs en tiempo real.

### 2. Archivo
- **Catálogos SAT**: Gestión de catálogos fiscales
- **Líneas de Producción**: Configuración de líneas de productos
- **Acabados de Aluminio**: Catálogo de acabados y colores
- **Conceptos CxC y CxP**: Configuración de conceptos contables
- **Choferes**: Gestión de conductores
- **Autotransporte**: Flota vehicular
- **Reparto**: Rutas y zonas de entrega
- **Reportes**: Centro de reportes del módulo

### 3. Catálogos
- **Productos**: Gestión completa de inventario
- **Clientes**: CRM y gestión de cartera
- **Proveedores**: Gestión de cuentas por pagar
- **Vendedores**: Equipo de ventas y comisiones

### 4. Inventario
- **Movimientos**: Historial completo de movimientos
- **Notas de Entrada**: Recepciones de mercancía
- **Notas de Salida**: Entregas y despachos
- **Inventario Físico**: Conteos y ajustes
- **Trazabilidad**: Seguimiento por lotes

### 5. Ventas
- **Facturas**: CFDI 4.0 con timbrado SAT
- **Cotizaciones**: Propuestas comerciales
- **Pedidos**: Órdenes de venta
- **Remisiones**: Notas de entrega
- **Cuentas por Cobrar**: Gestión de cartera
- **Devoluciones**: Notas de crédito

### 6. Compras
- **Órdenes de Compra**: Solicitudes a proveedores
- **Compras**: Registro de recepciones
- **Cotizaciones**: Solicitudes de cotización
- **Cuentas por Pagar**: Gestión de pagos

### 7. Configuración
- **Datos de la Empresa**: Información fiscal
- **Usuarios**: Gestión de cuentas
- **Roles y Permisos**: Control de acceso
- **Sucursales**: Configuración multi-sucursal

### 8. Utilerías
- **Control de Usuarios**: Gestión avanzada, bitácora y auditoría
- **Procesos Especiales**: Operaciones masivas
- **Importar/Exportar**: Herramientas de migración de datos
- **Administrador BD**: Respaldo, restauración y mantenimiento

## Gestión de Clientes

### Vistas Disponibles
1. **Lista Estándar**: Vista tabular tradicional
2. **Tarjetas/Grid**: Vista de tarjetas con información resumida
3. **Ficha Detallada**: Vista completa con histórico

### Filtros Avanzados
- RFC
- Nombre/Razón Social
- Status (Activo/Inactivo)
- Sucursal
- Rango de Saldo
- Fecha de última compra

### Funcionalidades
- **Exportar Excel**: Desde cualquier vista o filtro aplicado
- **Ficha Completa**: Datos generales, políticas comerciales, histórico de ventas, observaciones e información SAT

## Importación de Datos

### Plantillas Disponibles

#### Clientes (clientes.csv)
```csv
nombre,status,telefono,correo,direccion,rfc,saldo,precio_especial,descuento,metodo_pago_preferido,comentarios
"Juan Perez","Activo","5512345678","juan@correo.com","Calle A 123","JPR920101ABC",1500.00,TRUE,10.5,"Efectivo","Cliente preferente"
```

#### Productos (productos.csv)
```csv
descripcion,status,linea,ubicacion,unidad_sat,precio_base,costo,stock_min,stock_max
"Vidrio Laminado","Activo","Vidrio","Almacen Principal","H87",1000.00,650.00,10,100
```

#### Proveedores (proveedores.csv)
```csv
nombre,status,telefono,correo,direccion,rfc,saldo,metodo_pago_habitual,condiciones_credito
"Proveedor ABC","Activo","5512345678","contacto@proveedor.com","Av. Industrial 123","PAB123456789",5000.00,"Transferencia","30 días"
```

### Proceso de Importación
1. Acceder a **Utilerías > Importar/Exportar**
2. Descargar plantilla correspondiente
3. Llenar datos en Excel/CSV
4. Seleccionar archivo y tipo de importación
5. Ejecutar proceso y revisar resultados

## Procesos Especiales

### Actualización Masiva
- **Clientes**: Actualizar datos de múltiples clientes
- **Proveedores**: Modificar información de proveedores
- **Precios**: Actualizar precios por porcentaje o archivo Excel

### Facturación SAT
- **Cancelación Masiva CFDI**: Cancelar múltiples facturas
- **Verificar Sellos**: Validar integridad de sellos digitales
- **Actualizar Leyenda Fiscal**: Modificar leyendas en facturas

### Gestión de Productos
- **Acabados**: Gestionar acabados y colores
- **Catálogo SAT**: Importar productos del SAT
- **Mínimos/Máximos**: Actualizar niveles de inventario

## Administración de Base de Datos

### Operaciones Disponibles
- **Respaldo**: Crear copias de seguridad completas
- **Restauración**: Recuperar desde respaldos
- **Clonado**: Crear copias exactas de la BD
- **Migración**: Actualizar entre versiones
- **Optimización**: Mejorar rendimiento

### Asistente de Creación
Botón especial para crear toda la estructura ERP desde cero:
- Crear todas las tablas
- Poblar con datos de demostración
- Configurar catálogos SAT
- Establecer usuarios y roles por defecto

## Facturación Electrónica SAT

### Configuración de API
El sistema soporta múltiples proveedores de timbrado:
- Facturama
- FacturoPorTi
- Finkok
- Otros PACs certificados

### Ejemplo de Integración
```php
$facturaData = [
  "Serie" => "A",
  "Folio" => "789",
  "Fecha" => "2025-07-29T11:00:00",
  "FormaPago" => "01",
  "MetodoPago" => "PUE",
  "LugarExpedicion" => "12345",
  "Moneda" => "MXN",
  "TipoDeComprobante" => "I",
  "Receptor" => [
    "Rfc" => "XAXX010101000",
    "Nombre" => "Cliente de Ejemplo",
    "UsoCFDI" => "G03"
  ],
  "Conceptos" => [[
    "ClaveProdServ" => "01010101",
    "Cantidad" => 10,
    "Unidad" => "H87",
    "Descripcion" => "Vidrio Laminado",
    "ValorUnitario" => 1000,
    "Importe" => 10000
  ]]
];
```

## Filtros y Consultas

### Filtros Disponibles
- **Por RFC**: Búsqueda exacta o parcial
- **Por Nombre**: Búsqueda en razón social
- **Por Status**: Activo/Inactivo
- **Por Sucursal**: Filtrar por ubicación
- **Por Saldo**: Rangos de saldo

### Exportaciones
- Exportar cualquier lista filtrada a Excel
- Mantener filtros aplicados en la exportación
- Incluir totales y resúmenes

## Roles y Permisos

### Roles Predefinidos
- **Administrador**: Acceso completo
- **Vendedor**: Ventas y clientes
- **Almacenista**: Inventario y movimientos
- **Comprador**: Compras y proveedores
- **Contador**: Facturación y reportes

### Permisos Configurables
- Lectura/Escritura por módulo
- Restricciones por sucursal
- Límites de montos
- Aprobaciones requeridas

## Seguridad y Auditoría

### Bitácora de Accesos
- Registro de inicios de sesión
- Intentos fallidos
- Acciones por usuario
- Direcciones IP

### Auditoría de Cambios
- Registro de modificaciones
- Valores anteriores y nuevos
- Usuario responsable
- Fecha y hora exacta

## Soporte Técnico

### Contacto
- **Email**: soporte@erpnube.com
- **Teléfono**: 01-800-ERP-NUBE
- **Chat**: Disponible en el sistema

### Recursos Adicionales
- Videos tutoriales
- Base de conocimientos
- Foro de usuarios
- Actualizaciones automáticas

## Actualizaciones

### Proceso de Actualización
1. Notificación automática de nuevas versiones
2. Respaldo automático antes de actualizar
3. Migración de datos automática
4. Verificación de integridad post-actualización

### Historial de Versiones
- v2.0: Implementación inicial
- v2.1: Mejoras en facturación SAT
- v2.2: Nuevos reportes y exportaciones
- v3.0: Interfaz renovada y nuevas funcionalidades

---

*Este manual se actualiza constantemente. Para la versión más reciente, consulte la ayuda en línea del sistema.*