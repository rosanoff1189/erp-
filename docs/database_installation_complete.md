# Guía Completa de Instalación de Base de Datos
## ERP Nube Aluminio/Vidrio v3.0

## Requisitos del Sistema

### Hardware Mínimo
- **CPU**: 2 cores, 2.4 GHz
- **RAM**: 4 GB (8 GB recomendado)
- **Almacenamiento**: 50 GB libres (SSD recomendado)
- **Red**: Conexión estable a internet

### Software Requerido
- **MySQL**: 8.0+ o MariaDB 10.5+
- **PHP**: 8.0+ (para aplicaciones web)
- **Node.js**: 18+ LTS (para frontend)
- **Apache/Nginx**: Servidor web

## Instalación Paso a Paso

### 1. Preparación del Entorno

#### Ubuntu/Debian
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar MySQL Server
sudo apt install mysql-server -y

# Configurar MySQL
sudo mysql_secure_installation

# Instalar herramientas adicionales
sudo apt install mysql-client -y
```

#### CentOS/RHEL
```bash
# Instalar MySQL
sudo dnf install mysql-server -y
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Configurar seguridad
sudo mysql_secure_installation
```

### 2. Configuración de MySQL

#### Optimización para ERP
Editar `/etc/mysql/mysql.conf.d/mysqld.cnf`:

```ini
[mysqld]
# Configuración básica
bind-address = 127.0.0.1
port = 3306

# Optimización de memoria
innodb_buffer_pool_size = 2G
innodb_log_file_size = 256M
innodb_log_buffer_size = 16M

# Configuración de conexiones
max_connections = 200
max_user_connections = 180

# Configuración de charset
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Configuración de logs
log_error = /var/log/mysql/error.log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# Configuración específica para ERP
query_cache_type = 1
query_cache_size = 256M
tmp_table_size = 256M
max_heap_table_size = 256M
```

Reiniciar MySQL:
```bash
sudo systemctl restart mysql
```

### 3. Creación de Base de Datos

#### Conectar como root
```bash
mysql -u root -p
```

#### Crear base de datos y usuario
```sql
-- Crear base de datos
CREATE DATABASE erp_aluminio_vidrio 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Crear usuario específico para el ERP
CREATE USER 'erp_user'@'localhost' IDENTIFIED BY 'ErP_S3cur3_P@ssw0rd!';

-- Otorgar permisos completos
GRANT ALL PRIVILEGES ON erp_aluminio_vidrio.* TO 'erp_user'@'localhost';

-- Aplicar cambios
FLUSH PRIVILEGES;

-- Verificar creación
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'erp_user';

-- Salir de MySQL
EXIT;
```

### 4. Ejecutar Script de Estructura

#### Opción A: Script Completo Automático
```bash
# Descargar script desde el repositorio
wget https://raw.githubusercontent.com/tu-repo/erp-aluminio-vidrio/main/database/mysql_complete_setup.sql

# Ejecutar script completo
mysql -u erp_user -p erp_aluminio_vidrio < mysql_complete_setup.sql
```

#### Opción B: Ejecución Manual
```sql
-- Conectar a la base de datos
mysql -u erp_user -p erp_aluminio_vidrio

-- Ejecutar el script completo
SOURCE /path/to/mysql_complete_setup.sql;
```

### 5. Verificación de la Instalación

#### Verificar tablas creadas
```sql
-- Conectar a la base de datos
mysql -u erp_user -p erp_aluminio_vidrio

-- Verificar estructura
SHOW TABLES;

-- Verificar datos iniciales
SELECT COUNT(*) as total_tablas 
FROM information_schema.tables 
WHERE table_schema = 'erp_aluminio_vidrio';

-- Verificar datos de ejemplo
SELECT 'Empresas' as tabla, COUNT(*) as registros FROM empresas
UNION ALL
SELECT 'Usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'Productos', COUNT(*) FROM productos
UNION ALL
SELECT 'Clientes', COUNT(*) FROM clientes
UNION ALL
SELECT 'Materiales Corte', COUNT(*) FROM materiales_corte
UNION ALL
SELECT 'Catálogos SAT', COUNT(*) FROM catalogos_sat;
```

#### Resultado Esperado
```
+------------------+-----------+
| tabla            | registros |
+------------------+-----------+
| Empresas         |         1 |
| Usuarios         |         1 |
| Productos        |         8 |
| Clientes         |         5 |
| Materiales Corte |         8 |
| Catálogos SAT    |        25 |
+------------------+-----------+
```

### 6. Configuración de Conexión

#### Archivo de configuración `.env`
```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=erp_aluminio_vidrio
DB_USERNAME=erp_user
DB_PASSWORD=ErP_S3cur3_P@ssw0rd!

# Configuración de la Aplicación
APP_NAME="ERP Nube Aluminio/Vidrio"
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost

# Configuración SAT
SAT_API_URL=https://api.facturama.mx/v1/
SAT_API_KEY=
SAT_CERTIFICADO_PATH=
SAT_KEY_PATH=
SAT_PASSWORD=

# Configuración de Archivos
UPLOAD_MAX_SIZE=10M
BACKUP_PATH=/var/backups/erp/
TEMP_PATH=/tmp/erp/
```

#### Clase de conexión PHP (ejemplo)
```php
<?php
class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        $config = [
            'host' => $_ENV['DB_HOST'],
            'port' => $_ENV['DB_PORT'],
            'database' => $_ENV['DB_DATABASE'],
            'username' => $_ENV['DB_USERNAME'],
            'password' => $_ENV['DB_PASSWORD'],
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci'
        ];
        
        try {
            $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$config['database']};charset={$config['charset']}";
            $this->connection = new PDO($dsn, $config['username'], $config['password'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
            ]);
        } catch (PDOException $e) {
            throw new Exception("Error de conexión: " . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
}
?>
```

## Estructura de la Base de Datos

### Tablas Principales (45 tablas total)

#### 🏢 **Gestión Empresarial**
- `empresas` - Datos de empresas (multiempresa)
- `sucursales` - Sucursales y puntos de venta
- `usuarios` - Usuarios del sistema
- `roles` - Roles y permisos

#### 📦 **Catálogos**
- `productos` - Catálogo de productos
- `clientes` - Catálogo de clientes
- `proveedores` - Catálogo de proveedores
- `lineas_produccion` - Líneas de productos
- `acabados_aluminio` - Acabados y colores

#### 📊 **Inventario**
- `almacenes` - Almacenes y ubicaciones
- `inventario` - Stock por almacén
- `movimientos_inventario` - Historial de movimientos

#### 💰 **Ventas y Compras**
- `cotizaciones` / `cotizacion_items` - Cotizaciones
- `pedidos` / `pedido_items` - Pedidos de venta
- `facturas` / `factura_items` - Facturas electrónicas
- `remisiones` - Notas de entrega
- `ordenes_compra` / `orden_compra_items` - Órdenes de compra
- `devoluciones` - Devoluciones y cambios

#### 🚛 **Logística**
- `choferes` - Conductores
- `vehiculos` - Flota vehicular
- `rutas_reparto` - Rutas de entrega

#### ✂️ **Corte Optimizado**
- `materiales_corte` - Materiales base para corte
- `proyectos_corte` - Proyectos de optimización
- `plantillas_corte` - Plantillas reutilizables

#### 🔍 **Auditoría y Control**
- `bitacora_accesos` - Log de accesos
- `auditoria_cambios` - Auditoría de modificaciones
- `configuracion_sistema` - Configuraciones
- `catalogos_sat` - Catálogos fiscales SAT

### Índices de Optimización

#### Índices Principales
```sql
-- Búsquedas frecuentes
CREATE INDEX idx_clientes_rfc ON clientes(rfc);
CREATE INDEX idx_productos_codigo ON productos(codigo);
CREATE INDEX idx_facturas_folio ON facturas(folio);

-- Consultas de reportes
CREATE INDEX idx_movimientos_fecha ON movimientos_inventario(fecha);
CREATE INDEX idx_proyectos_corte_fecha ON proyectos_corte(fecha_calculo);

-- Relaciones frecuentes
CREATE INDEX idx_clientes_empresa_status ON clientes(empresa_id, status);
CREATE INDEX idx_productos_empresa_linea ON productos(empresa_id, linea_id);
```

### Triggers Automáticos

#### Auditoría Automática
- **Clientes**: Registra cambios en saldos y datos
- **Productos**: Audita cambios de precios y stock
- **Inventario**: Actualiza stock automáticamente
- **Proyectos**: Registra optimizaciones realizadas

#### Validaciones
- **Stock negativo**: Previene stock negativo
- **Límites de crédito**: Valida límites de clientes
- **Tolerancias**: Valida tolerancias de corte

## Datos de Demostración

### Empresa de Ejemplo
- **Razón Social**: Aluminios y Vidrios del Norte S.A. de C.V.
- **RFC**: AVN123456789
- **Sucursal Principal**: Matriz (MTZ)

### Usuarios Iniciales
- **Administrador**: admin@empresa.com / admin123
- **Roles**: Administrador, Vendedor, Almacenista, Comprador, Operador Corte

### Catálogos Poblados
- **8 productos** de ejemplo (vidrios, aluminios, herrajes)
- **5 clientes** con diferentes perfiles
- **4 proveedores** especializados
- **8 materiales** para corte optimizado
- **25+ códigos SAT** básicos

### Proyectos de Corte de Ejemplo
- **Ventanas Residencial ABC**: 87.5% aprovechamiento
- **Fachada Comercial XYZ**: 92.3% aprovechamiento
- **Puertas Oficina DEF**: 78.9% aprovechamiento

## Mantenimiento y Respaldos

### Respaldos Automáticos

#### Script de respaldo
```bash
#!/bin/bash
# /usr/local/bin/backup-erp.sh

DB_NAME="erp_aluminio_vidrio"
DB_USER="erp_user"
DB_PASS="ErP_S3cur3_P@ssw0rd!"
BACKUP_DIR="/var/backups/erp"
DATE=$(date +%Y%m%d_%H%M%S)

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Respaldo completo
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Limpiar respaldos antiguos (más de 30 días)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "$(date): Respaldo completado - backup_$DATE.sql.gz" >> /var/log/erp-backup.log
```

#### Configurar cron
```bash
# Editar crontab
sudo crontab -e

# Agregar respaldo diario a las 2:00 AM
0 2 * * * /usr/local/bin/backup-erp.sh
```

### Optimización Periódica

#### Script de optimización
```sql
-- Optimizar tablas principales
OPTIMIZE TABLE productos, clientes, facturas, movimientos_inventario, proyectos_corte;

-- Analizar estadísticas
ANALYZE TABLE productos, clientes, facturas;

-- Verificar integridad
CHECK TABLE productos, clientes, facturas;

-- Limpiar logs antiguos (más de 90 días)
DELETE FROM bitacora_accesos WHERE fecha < DATE_SUB(NOW(), INTERVAL 90 DAY);
DELETE FROM auditoria_cambios WHERE fecha < DATE_SUB(NOW(), INTERVAL 90 DAY);
```

### Monitoreo del Sistema

#### Verificar estado de la base de datos
```sql
-- Tamaño de la base de datos
SELECT 
    table_schema as 'Base de Datos',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as 'Tamaño (MB)'
FROM information_schema.tables 
WHERE table_schema = 'erp_aluminio_vidrio'
GROUP BY table_schema;

-- Tablas más grandes
SELECT 
    table_name as 'Tabla',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) as 'Tamaño (MB)',
    table_rows as 'Registros'
FROM information_schema.tables 
WHERE table_schema = 'erp_aluminio_vidrio'
ORDER BY (data_length + index_length) DESC
LIMIT 10;

-- Conexiones activas
SHOW PROCESSLIST;

-- Estado de InnoDB
SHOW ENGINE INNODB STATUS;
```

## Migración y Actualización

### Migración desde Versión Anterior

#### Respaldo antes de migrar
```bash
# Crear respaldo completo antes de migración
mysqldump -u erp_user -p erp_aluminio_vidrio > backup_pre_migration.sql
```

#### Script de migración
```sql
-- Verificar versión actual
SELECT valor FROM configuracion_sistema WHERE clave = 'version_sistema';

-- Ejecutar migraciones según versión
-- (Los scripts específicos se proporcionan por separado)

-- Actualizar versión
UPDATE configuracion_sistema 
SET valor = '3.0' 
WHERE clave = 'version_sistema';
```

### Actualización de Catálogos SAT

#### Importar nuevos catálogos
```sql
-- Respaldar catálogos actuales
CREATE TABLE catalogos_sat_backup AS SELECT * FROM catalogos_sat;

-- Importar nuevos catálogos (desde archivo CSV)
LOAD DATA INFILE '/path/to/catalogos_sat_nuevos.csv'
INTO TABLE catalogos_sat
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- Verificar importación
SELECT tipo, COUNT(*) as total FROM catalogos_sat GROUP BY tipo;
```

## Solución de Problemas

### Problemas Comunes

#### Error de conexión
```bash
# Verificar estado del servicio
sudo systemctl status mysql

# Verificar logs de error
sudo tail -f /var/log/mysql/error.log

# Reiniciar servicio si es necesario
sudo systemctl restart mysql
```

#### Error de permisos
```sql
-- Verificar permisos del usuario
SHOW GRANTS FOR 'erp_user'@'localhost';

-- Otorgar permisos faltantes
GRANT ALL PRIVILEGES ON erp_aluminio_vidrio.* TO 'erp_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Error de charset
```sql
-- Verificar charset de la base de datos
SELECT default_character_set_name, default_collation_name
FROM information_schema.schemata
WHERE schema_name = 'erp_aluminio_vidrio';

-- Cambiar charset si es necesario
ALTER DATABASE erp_aluminio_vidrio 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

#### Problemas de rendimiento
```sql
-- Identificar consultas lentas
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;

-- Verificar uso de índices
EXPLAIN SELECT * FROM productos WHERE codigo = 'VT-6MM-001';

-- Optimizar tablas fragmentadas
SELECT table_name, 
       ROUND(data_free / 1024 / 1024, 2) as 'Fragmentación (MB)'
FROM information_schema.tables
WHERE table_schema = 'erp_aluminio_vidrio'
AND data_free > 0
ORDER BY data_free DESC;
```

## Configuración de Producción

### Seguridad Avanzada

#### Crear usuarios específicos
```sql
-- Usuario de solo lectura para reportes
CREATE USER 'erp_readonly'@'localhost' IDENTIFIED BY 'ReadOnly_P@ss!';
GRANT SELECT ON erp_aluminio_vidrio.* TO 'erp_readonly'@'localhost';

-- Usuario para respaldos
CREATE USER 'erp_backup'@'localhost' IDENTIFIED BY 'Backup_P@ss!';
GRANT SELECT, LOCK TABLES ON erp_aluminio_vidrio.* TO 'erp_backup'@'localhost';

FLUSH PRIVILEGES;
```

#### Configuración de firewall
```bash
# Permitir solo conexiones locales a MySQL
sudo ufw allow from 127.0.0.1 to any port 3306

# Bloquear acceso externo
sudo ufw deny 3306
```

### SSL/TLS para Conexiones

#### Habilitar SSL en MySQL
```sql
-- Verificar soporte SSL
SHOW VARIABLES LIKE 'have_ssl';

-- Configurar SSL (en my.cnf)
[mysqld]
ssl-ca=/path/to/ca-cert.pem
ssl-cert=/path/to/server-cert.pem
ssl-key=/path/to/server-key.pem
```

## Prueb as y Validación

### Test de Funcionalidad

#### Verificar módulos principales
```sql
-- Test de inserción de cliente
INSERT INTO clientes (empresa_id, sucursal_id, nombre, rfc) 
VALUES (1, 1, 'Cliente Test', 'TEST123456789');

-- Test de producto
INSERT INTO productos (empresa_id, codigo, descripcion, precio_base, costo) 
VALUES (1, 'TEST-001', 'Producto Test', 100.00, 60.00);

-- Test de proyecto de corte
INSERT INTO proyectos_corte (empresa_id, usuario_id, nombre_proyecto, material_id, cortes_data) 
VALUES (1, 1, 'Test Corte', 1, '{"cortes":[{"ancho":500,"alto":300,"cantidad":1}]}');

-- Limpiar datos de test
DELETE FROM clientes WHERE rfc = 'TEST123456789';
DELETE FROM productos WHERE codigo = 'TEST-001';
DELETE FROM proyectos_corte WHERE nombre_proyecto = 'Test Corte';
```

#### Test de rendimiento
```sql
-- Medir tiempo de consultas principales
SET profiling = 1;

SELECT * FROM v_inventario_consolidado LIMIT 100;
SELECT * FROM v_cartera_clientes LIMIT 100;
SELECT * FROM proyectos_corte ORDER BY fecha_calculo DESC LIMIT 50;

SHOW PROFILES;
SET profiling = 0;
```

## Contacto y Soporte

### Información de Contacto
- **Soporte Técnico**: soporte@erpnube.com
- **Documentación**: https://docs.erpnube.com
- **Wiki**: https://wiki.erpnube.com/database
- **Foro**: https://community.erpnube.com

### Recursos Adicionales
- **Videos tutoriales**: Canal de YouTube
- **Webinars**: Entrenamientos en vivo
- **Certificación**: Programa de certificación técnica

---

**Versión del Manual**: 3.0  
**Fecha de Actualización**: Enero 2025  
**Compatibilidad**: MySQL 8.0+, MariaDB 10.5+