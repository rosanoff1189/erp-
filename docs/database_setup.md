# Configuración de Base de Datos MySQL - ERP Nube Aluminio/Vidrio

## Requisitos del Sistema

### Software Necesario
- **MySQL Server 8.0** o superior (recomendado)
- **MariaDB 10.5+** (alternativa compatible)
- **PHP 8.0+** con extensiones:
  - mysqli o PDO_MySQL
  - json
  - mbstring
  - openssl
- **Apache 2.4+** o **Nginx 1.18+**
- **Node.js 18+** (para el frontend)

### Especificaciones del Servidor
- **RAM**: Mínimo 4GB, recomendado 8GB+
- **Almacenamiento**: Mínimo 20GB libres
- **CPU**: 2 cores mínimo, 4+ recomendado

## Instalación Paso a Paso

### 1. Preparación del Entorno

#### En Ubuntu/Debian:
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar MySQL Server
sudo apt install mysql-server -y

# Instalar PHP y extensiones
sudo apt install php8.1 php8.1-mysql php8.1-json php8.1-mbstring php8.1-openssl -y

# Instalar Apache
sudo apt install apache2 -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
```

#### En CentOS/RHEL:
```bash
# Instalar MySQL
sudo dnf install mysql-server -y
sudo systemctl start mysqld
sudo systemctl enable mysqld

# Instalar PHP
sudo dnf install php php-mysql php-json php-mbstring -y

# Instalar Apache
sudo dnf install httpd -y
sudo systemctl start httpd
sudo systemctl enable httpd
```

### 2. Configuración de MySQL

#### Configuración Inicial de Seguridad
```bash
# Ejecutar script de seguridad
sudo mysql_secure_installation

# Responder las preguntas:
# - Configurar contraseña de root: SÍ
# - Eliminar usuarios anónimos: SÍ
# - Deshabilitar login remoto de root: SÍ
# - Eliminar base de datos de prueba: SÍ
# - Recargar tablas de privilegios: SÍ
```

#### Optimización de MySQL para ERP
Editar `/etc/mysql/mysql.conf.d/mysqld.cnf` o `/etc/my.cnf`:

```ini
[mysqld]
# Configuración básica
bind-address = 127.0.0.1
port = 3306

# Configuración de memoria
innodb_buffer_pool_size = 2G
innodb_log_file_size = 256M
innodb_log_buffer_size = 16M

# Configuración de conexiones
max_connections = 200
max_user_connections = 180

# Configuración de consultas
query_cache_type = 1
query_cache_size = 256M
query_cache_limit = 2M

# Configuración de tablas temporales
tmp_table_size = 256M
max_heap_table_size = 256M

# Configuración de timeouts
wait_timeout = 28800
interactive_timeout = 28800

# Configuración de charset
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Configuración de logs
log_error = /var/log/mysql/error.log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# Configuración de seguridad
sql_mode = STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO
```

Reiniciar MySQL:
```bash
sudo systemctl restart mysql
```

### 3. Creación de la Base de Datos

#### Conectar a MySQL como root
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

### 4. Ejecutar Scripts de Estructura

#### Opción A: Script Completo Automático
```bash
# Descargar y ejecutar script completo
mysql -u erp_user -p erp_aluminio_vidrio < scripts/erp_estructura_completa.sql
```

#### Opción B: Ejecución Manual por Partes
```sql
-- Conectar a la base de datos
mysql -u erp_user -p erp_aluminio_vidrio

-- Ejecutar scripts en orden:
SOURCE scripts/01_tablas_principales.sql;
SOURCE scripts/02_tablas_auditoria.sql;
SOURCE scripts/03_indices_optimizacion.sql;
SOURCE scripts/04_triggers_auditoria.sql;
SOURCE scripts/05_vistas_reportes.sql;
SOURCE scripts/06_datos_iniciales.sql;
SOURCE scripts/07_catalogos_sat.sql;
SOURCE scripts/08_configuracion_sistema.sql;
```

### 5. Verificación de la Instalación

#### Script de Verificación
```sql
-- Verificar tablas creadas
SELECT COUNT(*) as total_tablas 
FROM information_schema.tables 
WHERE table_schema = 'erp_aluminio_vidrio';

-- Verificar datos iniciales
SELECT 'Empresas' as tabla, COUNT(*) as registros FROM empresas
UNION ALL
SELECT 'Usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'Productos', COUNT(*) FROM productos
UNION ALL
SELECT 'Clientes', COUNT(*) FROM clientes
UNION ALL
SELECT 'Catálogos SAT', COUNT(*) FROM catalogos_sat;

-- Verificar índices
SELECT table_name, index_name, column_name
FROM information_schema.statistics
WHERE table_schema = 'erp_aluminio_vidrio'
ORDER BY table_name, index_name;

-- Verificar triggers
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'erp_aluminio_vidrio';
```

### 6. Configuración de Conexión PHP

#### Archivo de configuración `config/database.php`:
```php
<?php
return [
    'host' => 'localhost',
    'port' => 3306,
    'database' => 'erp_aluminio_vidrio',
    'username' => 'erp_user',
    'password' => 'ErP_S3cur3_P@ssw0rd!',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'options' => [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
    ]
];
```

#### Clase de conexión `classes/Database.php`:
```php
<?php
class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        $config = require_once 'config/database.php';
        
        try {
            $dsn = "mysql:host={$config['host']};port={$config['port']};dbname={$config['database']};charset={$config['charset']}";
            $this->connection = new PDO($dsn, $config['username'], $config['password'], $config['options']);
        } catch (PDOException $e) {
            throw new Exception("Error de conexión a la base de datos: " . $e->getMessage());
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
    
    public function query($sql, $params = []) {
        $stmt = $this->connection->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }
    
    public function fetchAll($sql, $params = []) {
        return $this->query($sql, $params)->fetchAll();
    }
    
    public function fetchOne($sql, $params = []) {
        return $this->query($sql, $params)->fetch();
    }
}
```

### 7. Configuración de Variables de Entorno

#### Archivo `.env`:
```env
# Base de Datos
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

# Configuración de Correo
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls

# Configuración de Archivos
UPLOAD_MAX_SIZE=10M
BACKUP_PATH=/var/backups/erp/
TEMP_PATH=/tmp/erp/
```

### 8. Respaldos Automáticos

#### Script de respaldo `scripts/backup.sh`:
```bash
#!/bin/bash

# Configuración
DB_NAME="erp_aluminio_vidrio"
DB_USER="erp_user"
DB_PASS="ErP_S3cur3_P@ssw0rd!"
BACKUP_DIR="/var/backups/erp"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Crear respaldo
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_FILE

# Comprimir respaldo
gzip $BACKUP_FILE

# Eliminar respaldos antiguos (más de 30 días)
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Respaldo creado: $BACKUP_FILE.gz"
```

#### Configurar cron para respaldos automáticos:
```bash
# Editar crontab
sudo crontab -e

# Agregar línea para respaldo diario a las 2:00 AM
0 2 * * * /path/to/scripts/backup.sh >> /var/log/erp_backup.log 2>&1
```

### 9. Monitoreo y Mantenimiento

#### Script de monitoreo `scripts/monitor.sh`:
```bash
#!/bin/bash

# Verificar estado de MySQL
systemctl is-active mysql > /dev/null
if [ $? -eq 0 ]; then
    echo "✓ MySQL está ejecutándose"
else
    echo "✗ MySQL no está ejecutándose"
    sudo systemctl start mysql
fi

# Verificar conexión a la base de datos
mysql -u erp_user -p$DB_PASS -e "SELECT 1" erp_aluminio_vidrio > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Conexión a base de datos exitosa"
else
    echo "✗ Error de conexión a base de datos"
fi

# Verificar espacio en disco
DISK_USAGE=$(df /var/lib/mysql | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠ Advertencia: Uso de disco alto ($DISK_USAGE%)"
fi

# Verificar tamaño de la base de datos
DB_SIZE=$(mysql -u erp_user -p$DB_PASS -e "
SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'DB Size in MB'
FROM information_schema.tables
WHERE table_schema='erp_aluminio_vidrio';" | tail -1)

echo "Tamaño de base de datos: $DB_SIZE MB"
```

### 10. Optimización de Rendimiento

#### Análisis de consultas lentas:
```sql
-- Habilitar log de consultas lentas
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- Analizar consultas lentas
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;
```

#### Optimización de tablas:
```sql
-- Optimizar todas las tablas
OPTIMIZE TABLE empresas, usuarios, productos, clientes, facturas, movimientos_inventario;

-- Analizar estadísticas de tablas
ANALYZE TABLE empresas, usuarios, productos, clientes, facturas;

-- Verificar fragmentación
SELECT table_name, 
       ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)',
       ROUND((data_free / 1024 / 1024), 2) AS 'Free (MB)'
FROM information_schema.tables
WHERE table_schema = 'erp_aluminio_vidrio'
ORDER BY (data_length + index_length) DESC;
```

### 11. Solución de Problemas Comunes

#### Error de conexión:
```bash
# Verificar estado del servicio
sudo systemctl status mysql

# Verificar logs de error
sudo tail -f /var/log/mysql/error.log

# Reiniciar servicio si es necesario
sudo systemctl restart mysql
```

#### Error de permisos:
```sql
-- Verificar permisos del usuario
SHOW GRANTS FOR 'erp_user'@'localhost';

-- Otorgar permisos faltantes
GRANT ALL PRIVILEGES ON erp_aluminio_vidrio.* TO 'erp_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Error de charset:
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

### 12. Migración y Actualización

#### Proceso de migración:
```bash
# 1. Crear respaldo de la versión actual
mysqldump -u erp_user -p erp_aluminio_vidrio > backup_pre_migration.sql

# 2. Ejecutar scripts de migración
mysql -u erp_user -p erp_aluminio_vidrio < migration_scripts/migrate_to_v3.sql

# 3. Verificar integridad
mysql -u erp_user -p erp_aluminio_vidrio < scripts/verify_migration.sql
```

### 13. Configuración de Producción

#### Configuración de seguridad adicional:
```sql
-- Crear usuario de solo lectura para reportes
CREATE USER 'erp_readonly'@'localhost' IDENTIFIED BY 'ReadOnly_P@ss!';
GRANT SELECT ON erp_aluminio_vidrio.* TO 'erp_readonly'@'localhost';

-- Crear usuario para respaldos
CREATE USER 'erp_backup'@'localhost' IDENTIFIED BY 'Backup_P@ss!';
GRANT SELECT, LOCK TABLES ON erp_aluminio_vidrio.* TO 'erp_backup'@'localhost';

FLUSH PRIVILEGES;
```

#### Configuración de firewall:
```bash
# Permitir solo conexiones locales a MySQL
sudo ufw allow from 127.0.0.1 to any port 3306

# Bloquear acceso externo
sudo ufw deny 3306
```

## Contacto y Soporte

Para soporte técnico con la configuración de la base de datos:
- **Email**: soporte@erpnube.com
- **Documentación**: https://docs.erpnube.com
- **Wiki**: https://wiki.erpnube.com/database-setup

---

**Nota**: Este manual asume un entorno Linux. Para Windows Server, consulte la documentación específica de Windows en el portal de soporte.