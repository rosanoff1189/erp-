# Guía de Instalación - Ubuntu Server 24.04.2 LTS
## ERP Nube Aluminio/Vidrio v3.0

## Requisitos del Sistema

### Hardware Mínimo
- **CPU**: 2 cores, 2.4 GHz
- **RAM**: 4 GB (8 GB recomendado)
- **Almacenamiento**: 50 GB libres (SSD recomendado)
- **Red**: Conexión estable a internet

### Software Base
- **Ubuntu Server**: 24.04.2 LTS
- **MySQL**: 8.0+
- **PHP**: 8.3
- **Node.js**: 20 LTS
- **Apache**: 2.4+

## Instalación Automática

### Opción 1: Script Automático (Recomendado)

```bash
# Descargar el proyecto
git clone https://github.com/tu-repo/erp-aluminio-vidrio.git
cd erp-aluminio-vidrio

# Ejecutar instalador automático
chmod +x scripts/install_ubuntu_24.sh
./scripts/install_ubuntu_24.sh
```

### Opción 2: Instalación Manual

#### 1. Actualizar el Sistema
```bash
sudo apt update && sudo apt upgrade -y
```

#### 2. Instalar MySQL 8.0
```bash
# Instalar MySQL Server
sudo apt install mysql-server mysql-client -y

# Configurar seguridad
sudo mysql_secure_installation

# Iniciar y habilitar servicio
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### 3. Instalar Apache y PHP 8.3
```bash
# Instalar Apache
sudo apt install apache2 -y

# Instalar PHP 8.3 y extensiones
sudo apt install php8.3 php8.3-mysql php8.3-json php8.3-mbstring \
    php8.3-xml php8.3-curl php8.3-zip php8.3-gd php8.3-intl \
    php8.3-bcmath php8.3-soap libapache2-mod-php8.3 -y

# Habilitar servicios
sudo systemctl start apache2
sudo systemctl enable apache2
```

#### 4. Instalar Node.js 20 LTS
```bash
# Agregar repositorio NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Instalar Node.js
sudo apt install nodejs -y

# Verificar instalación
node --version
npm --version
```

## Configuración de Base de Datos

### 1. Crear Base de Datos y Usuario

```bash
# Conectar a MySQL como root
sudo mysql -u root -p
```

```sql
-- Crear base de datos
CREATE DATABASE erp_aluminio_vidrio 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Crear usuario específico
CREATE USER 'erp_user'@'localhost' IDENTIFIED BY 'TuContraseñaSegura123!';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON erp_aluminio_vidrio.* TO 'erp_user'@'localhost';
FLUSH PRIVILEGES;

-- Verificar
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'erp_user';
EXIT;
```

### 2. Ejecutar Script de Estructura

```bash
# Ejecutar script completo
mysql -u erp_user -p erp_aluminio_vidrio < database/mysql_erp_complete.sql
```

### 3. Verificar Instalación

```sql
-- Conectar y verificar
mysql -u erp_user -p erp_aluminio_vidrio

-- Verificar tablas
SHOW TABLES;

-- Verificar datos iniciales
SELECT COUNT(*) as total_tablas 
FROM information_schema.tables 
WHERE table_schema = 'erp_aluminio_vidrio';

-- Verificar módulo de corte
SELECT COUNT(*) as materiales_corte FROM materiales_corte;
SELECT COUNT(*) as proyectos_corte FROM proyectos_corte;
```

## Configuración de la Aplicación

### 1. Configurar Apache Virtual Host

```bash
# Crear configuración del sitio
sudo nano /etc/apache2/sites-available/erp-aluminio-vidrio.conf
```

```apache
<VirtualHost *:80>
    ServerName erp.local
    DocumentRoot /var/www/erp-aluminio-vidrio/dist
    
    <Directory /var/www/erp-aluminio-vidrio/dist>
        AllowOverride All
        Require all granted
        Options -Indexes
        
        # Configuración para SPA
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Configuración de seguridad
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    
    ErrorLog ${APACHE_LOG_DIR}/erp_error.log
    CustomLog ${APACHE_LOG_DIR}/erp_access.log combined
</VirtualHost>
```

```bash
# Habilitar sitio y módulos
sudo a2ensite erp-aluminio-vidrio.conf
sudo a2enmod rewrite headers
sudo a2dissite 000-default.conf
sudo systemctl reload apache2
```

### 2. Instalar Dependencias de la Aplicación

```bash
# Ir al directorio de la aplicación
cd /var/www/erp-aluminio-vidrio

# Instalar dependencias Node.js
npm install

# Construir aplicación
npm run build

# Establecer permisos
sudo chown -R www-data:www-data /var/www/erp-aluminio-vidrio
sudo chmod -R 755 /var/www/erp-aluminio-vidrio
```

### 3. Configurar Variables de Entorno

```bash
# Crear archivo .env
sudo nano /var/www/erp-aluminio-vidrio/.env
```

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=erp_aluminio_vidrio
DB_USERNAME=erp_user
DB_PASSWORD=TuContraseñaSegura123!

# Configuración de la Aplicación
APP_NAME="ERP Nube Aluminio/Vidrio"
APP_ENV=production
APP_DEBUG=false
APP_URL=http://erp.local

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

## Configuración de Seguridad

### 1. Configurar Firewall UFW

```bash
# Habilitar UFW
sudo ufw enable

# Permitir SSH
sudo ufw allow ssh

# Permitir Apache
sudo ufw allow 'Apache Full'

# Bloquear MySQL externo
sudo ufw deny 3306

# Verificar estado
sudo ufw status
```

### 2. Configurar Respaldos Automáticos

```bash
# Crear script de respaldo
sudo nano /usr/local/bin/backup-erp.sh
```

```bash
#!/bin/bash
DB_NAME="erp_aluminio_vidrio"
DB_USER="erp_user"
DB_PASS="TuContraseñaSegura123!"
BACKUP_DIR="/var/backups/erp"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
echo "$(date): Respaldo completado - backup_$DATE.sql.gz" >> /var/log/erp-backup.log
```

```bash
# Hacer ejecutable
sudo chmod +x /usr/local/bin/backup-erp.sh

# Configurar cron para respaldos diarios
sudo crontab -e
# Agregar línea:
0 2 * * * /usr/local/bin/backup-erp.sh
```

## Optimización para Producción

### 1. Optimizar MySQL para Ubuntu 24.04.2

```bash
# Editar configuración MySQL
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

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

```bash
# Reiniciar MySQL
sudo systemctl restart mysql
```

### 2. Optimizar Apache

```bash
# Editar configuración Apache
sudo nano /etc/apache2/apache2.conf
```

Agregar al final:
```apache
# Configuración para ERP
ServerTokens Prod
ServerSignature Off

# Compresión
LoadModule deflate_module modules/mod_deflate.so
<Location />
    SetOutputFilter DEFLATE
    SetEnvIfNoCase Request_URI \
        \.(?:gif|jpe?g|png)$ no-gzip dont-vary
    SetEnvIfNoCase Request_URI \
        \.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
</Location>

# Cache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
</IfModule>
```

## Verificación Final

### 1. Verificar Servicios

```bash
# Verificar estado de servicios
sudo systemctl status mysql
sudo systemctl status apache2

# Verificar puertos
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :3306
```

### 2. Probar Conexión

```bash
# Probar servidor web
curl -I http://localhost

# Probar base de datos
mysql -u erp_user -p -e "SELECT 'Conexión exitosa' as resultado;" erp_aluminio_vidrio
```

### 3. Verificar Módulos del ERP

```sql
-- Conectar a la base de datos
mysql -u erp_user -p erp_aluminio_vidrio

-- Verificar estructura completa
SELECT 
    'Empresas' as modulo, COUNT(*) as registros FROM empresas
UNION ALL
SELECT 'Usuarios', COUNT(*) FROM usuarios
UNION ALL
SELECT 'Productos', COUNT(*) FROM productos
UNION ALL
SELECT 'Clientes', COUNT(*) FROM clientes
UNION ALL
SELECT 'Materiales Corte', COUNT(*) FROM materiales_corte
UNION ALL
SELECT 'Proyectos Corte', COUNT(*) FROM proyectos_corte
UNION ALL
SELECT 'Catálogos SAT', COUNT(*) FROM catalogos_sat;
```

## Acceso al Sistema

### Información de Acceso
- **URL**: http://erp.local (o http://IP-del-servidor)
- **Usuario**: admin@empresa.com
- **Contraseña**: admin123

### Módulos Disponibles
1. **Dashboard** - Panel principal con KPIs
2. **Archivo** - Catálogos SAT y configuraciones
3. **Catálogos** - Productos, clientes, proveedores
4. **Inventario** - Control de existencias
5. **Ventas** - Facturas, cotizaciones, pedidos
6. **Compras** - Órdenes de compra y proveedores
7. **Corte Optimizado** - ✨ Optimización avanzada de cortes
8. **Configuración** - Usuarios, roles, empresa
9. **Utilerías** - Herramientas administrativas

### Características del Módulo de Corte Optimizado
- **Visualización en tiempo real** del patrón de corte
- **Múltiples vistas**: Gráfica, Lista, Miniaturas
- **Simulación paso a paso** del proceso de corte
- **Algoritmos avanzados** de optimización
- **Exportación** a Excel, PDF e imagen
- **Materiales preconfigurados** para vidrio, aluminio y acero
- **Cálculo de costos** y análisis de desperdicio
- **Recomendaciones inteligentes** para mejora

## Solución de Problemas

### Problemas Comunes

#### Error de conexión a MySQL
```bash
# Verificar estado
sudo systemctl status mysql

# Reiniciar si es necesario
sudo systemctl restart mysql

# Verificar logs
sudo tail -f /var/log/mysql/error.log
```

#### Error 500 en Apache
```bash
# Verificar logs de Apache
sudo tail -f /var/log/apache2/error.log

# Verificar permisos
sudo chown -R www-data:www-data /var/www/erp-aluminio-vidrio
sudo chmod -R 755 /var/www/erp-aluminio-vidrio
```

#### Problemas de rendimiento
```sql
-- Optimizar tablas
OPTIMIZE TABLE productos, clientes, facturas, proyectos_corte;

-- Verificar consultas lentas
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;
```

## Mantenimiento

### Respaldos
- **Automático**: Diario a las 2:00 AM
- **Manual**: `/usr/local/bin/backup-erp.sh`
- **Ubicación**: `/var/backups/erp/`

### Logs del Sistema
- **Apache**: `/var/log/apache2/`
- **MySQL**: `/var/log/mysql/`
- **ERP**: `/var/log/erp-backup.log`

### Actualizaciones
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Reiniciar servicios si es necesario
sudo systemctl restart mysql apache2
```

## Soporte

### Contacto
- **Email**: soporte@erpnube.com
- **Documentación**: https://docs.erpnube.com
- **Wiki**: https://wiki.erpnube.com

### Recursos
- **Manual completo**: `docs/manual_completo_erp.md`
- **Manual de corte**: `docs/manual_corte_optimizado.md`
- **Scripts de instalación**: `scripts/`

---

**Versión**: 3.0  
**Fecha**: Enero 2025  
**Compatibilidad**: Ubuntu Server 24.04.2 LTS