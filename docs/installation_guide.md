# Guía de Instalación Completa - ERP Nube Aluminio/Vidrio v3.0

## Índice
1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Instalación del Servidor](#instalación-del-servidor)
3. [Configuración de Base de Datos](#configuración-de-base-de-datos)
4. [Instalación de la Aplicación](#instalación-de-la-aplicación)
5. [Configuración Inicial](#configuración-inicial)
6. [Integración SAT](#integración-sat)
7. [Configuración de Producción](#configuración-de-producción)
8. [Verificación y Pruebas](#verificación-y-pruebas)

## Requisitos del Sistema

### Hardware Mínimo
- **CPU**: 2 cores, 2.4 GHz
- **RAM**: 4 GB (8 GB recomendado)
- **Almacenamiento**: 50 GB libres (SSD recomendado)
- **Red**: Conexión estable a internet

### Hardware Recomendado (Producción)
- **CPU**: 4+ cores, 3.0 GHz
- **RAM**: 16 GB o más
- **Almacenamiento**: 200 GB+ SSD
- **Red**: Conexión dedicada 100 Mbps+

### Software Base
- **Sistema Operativo**: 
  - Ubuntu 20.04+ LTS
  - CentOS 8+ / RHEL 8+
  - Windows Server 2019+
- **Servidor Web**: Apache 2.4+ o Nginx 1.18+
- **Base de Datos**: MySQL 8.0+ o MariaDB 10.5+
- **PHP**: 8.0+ con extensiones requeridas
- **Node.js**: 18+ LTS

## Instalación del Servidor

### Ubuntu/Debian

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar paquetes base
sudo apt install -y curl wget git unzip software-properties-common

# Instalar Apache
sudo apt install -y apache2
sudo systemctl enable apache2
sudo systemctl start apache2

# Instalar MySQL
sudo apt install -y mysql-server
sudo systemctl enable mysql
sudo systemctl start mysql

# Instalar PHP 8.1 y extensiones
sudo apt install -y php8.1 php8.1-mysql php8.1-json php8.1-mbstring \
    php8.1-xml php8.1-curl php8.1-zip php8.1-gd php8.1-intl \
    php8.1-bcmath php8.1-soap libapache2-mod-php8.1

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar Composer (para dependencias PHP)
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Verificar instalaciones
php --version
mysql --version
node --version
npm --version
```

### CentOS/RHEL

```bash
# Actualizar sistema
sudo dnf update -y

# Instalar repositorios adicionales
sudo dnf install -y epel-release
sudo dnf module enable php:8.1

# Instalar Apache
sudo dnf install -y httpd
sudo systemctl enable httpd
sudo systemctl start httpd

# Instalar MySQL
sudo dnf install -y mysql-server
sudo systemctl enable mysqld
sudo systemctl start mysqld

# Instalar PHP y extensiones
sudo dnf install -y php php-mysql php-json php-mbstring \
    php-xml php-curl php-zip php-gd php-intl \
    php-bcmath php-soap

# Instalar Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# Configurar firewall
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Configuración de Base de Datos

### 1. Configuración Inicial de MySQL

```bash
# Ejecutar configuración segura
sudo mysql_secure_installation

# Responder:
# - Configurar contraseña de root: SÍ
# - Eliminar usuarios anónimos: SÍ
# - Deshabilitar login remoto de root: SÍ
# - Eliminar base de datos de prueba: SÍ
# - Recargar tablas de privilegios: SÍ
```

### 2. Crear Base de Datos y Usuario

```sql
-- Conectar como root
mysql -u root -p

-- Crear base de datos
CREATE DATABASE erp_aluminio_vidrio 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Crear usuario del sistema
CREATE USER 'erp_user'@'localhost' IDENTIFIED BY 'TuContraseñaSegura123!';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON erp_aluminio_vidrio.* TO 'erp_user'@'localhost';
FLUSH PRIVILEGES;

-- Verificar
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'erp_user';
EXIT;
```

### 3. Optimización de MySQL

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
```

Reiniciar MySQL:
```bash
sudo systemctl restart mysql
```

## Instalación de la Aplicación

### 1. Descargar Código Fuente

```bash
# Crear directorio de la aplicación
sudo mkdir -p /var/www/erp-aluminio-vidrio
cd /var/www/erp-aluminio-vidrio

# Clonar repositorio (o descomprimir archivo)
git clone https://github.com/tu-repo/erp-aluminio-vidrio.git .

# O descomprimir archivo
# unzip erp-aluminio-vidrio-v3.0.zip
# mv erp-aluminio-vidrio-v3.0/* .

# Establecer permisos
sudo chown -R www-data:www-data /var/www/erp-aluminio-vidrio
sudo chmod -R 755 /var/www/erp-aluminio-vidrio
```

### 2. Instalar Dependencias

```bash
# Dependencias PHP (si aplica)
composer install --no-dev --optimize-autoloader

# Dependencias Node.js
npm install

# Construir aplicación frontend
npm run build
```

### 3. Configurar Apache Virtual Host

Crear `/etc/apache2/sites-available/erp-aluminio-vidrio.conf`:

```apache
<VirtualHost *:80>
    ServerName erp.tudominio.com
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
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/erp_error.log
    CustomLog ${APACHE_LOG_DIR}/erp_access.log combined
</VirtualHost>
```

Habilitar sitio:
```bash
sudo a2ensite erp-aluminio-vidrio.conf
sudo a2enmod rewrite headers
sudo systemctl reload apache2
```

### 4. Configurar Variables de Entorno

Crear archivo `.env`:

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
APP_URL=http://erp.tudominio.com

# Configuración SAT (completar después)
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

## Configuración Inicial

### 1. Ejecutar Scripts de Base de Datos

```bash
# Ejecutar script principal de estructura
mysql -u erp_user -p erp_aluminio_vidrio < database/erp_estructura_completa.sql

# Verificar instalación
mysql -u erp_user -p erp_aluminio_vidrio -e "
SELECT 'Tablas creadas' as status, COUNT(*) as total 
FROM information_schema.tables 
WHERE table_schema = 'erp_aluminio_vidrio';
"
```

### 2. Configurar Directorios de Trabajo

```bash
# Crear directorios necesarios
sudo mkdir -p /var/backups/erp
sudo mkdir -p /tmp/erp
sudo mkdir -p /var/www/erp-aluminio-vidrio/storage/uploads
sudo mkdir -p /var/www/erp-aluminio-vidrio/storage/exports
sudo mkdir -p /var/www/erp-aluminio-vidrio/storage/logs

# Establecer permisos
sudo chown -R www-data:www-data /var/backups/erp
sudo chown -R www-data:www-data /tmp/erp
sudo chown -R www-data:www-data /var/www/erp-aluminio-vidrio/storage

sudo chmod -R 755 /var/backups/erp
sudo chmod -R 755 /tmp/erp
sudo chmod -R 755 /var/www/erp-aluminio-vidrio/storage
```

### 3. Configurar Logs del Sistema

```bash
# Crear archivo de log personalizado
sudo touch /var/log/erp-aluminio-vidrio.log
sudo chown www-data:www-data /var/log/erp-aluminio-vidrio.log

# Configurar logrotate
sudo tee /etc/logrotate.d/erp-aluminio-vidrio << EOF
/var/log/erp-aluminio-vidrio.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
EOF
```

## Integración SAT

### 1. Obtener Credenciales del PAC

#### Para Facturama:
1. Registrarse en https://www.facturama.mx/
2. Obtener API Key desde el panel de desarrollador
3. Configurar webhook para notificaciones

#### Para FacturoPorTi:
1. Registrarse en https://www.facturapoti.com/
2. Obtener credenciales de API
3. Configurar certificados digitales

### 2. Configurar Certificados SAT

```bash
# Crear directorio para certificados
sudo mkdir -p /var/www/erp-aluminio-vidrio/storage/certificates
sudo chown www-data:www-data /var/www/erp-aluminio-vidrio/storage/certificates
sudo chmod 700 /var/www/erp-aluminio-vidrio/storage/certificates

# Copiar certificados (proporcionados por el SAT)
sudo cp certificado.cer /var/www/erp-aluminio-vidrio/storage/certificates/
sudo cp llave_privada.key /var/www/erp-aluminio-vidrio/storage/certificates/

# Establecer permisos restrictivos
sudo chmod 600 /var/www/erp-aluminio-vidrio/storage/certificates/*
```

### 3. Actualizar Configuración

Actualizar `.env`:
```env
SAT_API_KEY=tu_api_key_aqui
SAT_CERTIFICADO_PATH=/var/www/erp-aluminio-vidrio/storage/certificates/certificado.cer
SAT_KEY_PATH=/var/www/erp-aluminio-vidrio/storage/certificates/llave_privada.key
SAT_PASSWORD=contraseña_llave_privada
```

### 4. Probar Integración SAT

```bash
# Ejecutar script de prueba
php scripts/test_sat_integration.php

# Verificar en logs
tail -f /var/log/erp-aluminio-vidrio.log
```

## Configuración de Producción

### 1. Configurar HTTPS

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-apache

# Obtener certificado SSL
sudo certbot --apache -d erp.tudominio.com

# Verificar renovación automática
sudo certbot renew --dry-run
```

### 2. Configurar Firewall

```bash
# Configurar UFW (Ubuntu)
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 'Apache Full'
sudo ufw deny 3306  # Bloquear acceso directo a MySQL

# Verificar estado
sudo ufw status
```

### 3. Configurar Respaldos Automáticos

Crear script `/usr/local/bin/backup-erp.sh`:

```bash
#!/bin/bash

# Configuración
DB_NAME="erp_aluminio_vidrio"
DB_USER="erp_user"
DB_PASS="TuContraseñaSegura123!"
BACKUP_DIR="/var/backups/erp"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Respaldo de base de datos
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Respaldo de archivos de aplicación
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz \
    /var/www/erp-aluminio-vidrio/storage \
    /var/www/erp-aluminio-vidrio/.env

# Limpiar respaldos antiguos
find $BACKUP_DIR -name "*.gz" -mtime +$RETENTION_DAYS -delete

# Log del respaldo
echo "$(date): Respaldo completado - db_backup_$DATE.sql.gz" >> /var/log/erp-backup.log
```

Configurar cron:
```bash
sudo chmod +x /usr/local/bin/backup-erp.sh
sudo crontab -e

# Agregar línea para respaldo diario a las 2:00 AM
0 2 * * * /usr/local/bin/backup-erp.sh
```

### 4. Configurar Monitoreo

Crear script `/usr/local/bin/monitor-erp.sh`:

```bash
#!/bin/bash

# Verificar servicios
services=("apache2" "mysql")
for service in "${services[@]}"; do
    if ! systemctl is-active --quiet $service; then
        echo "$(date): ALERTA - $service no está ejecutándose" >> /var/log/erp-monitor.log
        systemctl start $service
    fi
done

# Verificar espacio en disco
disk_usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $disk_usage -gt 85 ]; then
    echo "$(date): ALERTA - Uso de disco alto: $disk_usage%" >> /var/log/erp-monitor.log
fi

# Verificar conexión a base de datos
if ! mysql -u erp_user -p$DB_PASS -e "SELECT 1" erp_aluminio_vidrio > /dev/null 2>&1; then
    echo "$(date): ALERTA - Error de conexión a base de datos" >> /var/log/erp-monitor.log
fi
```

Configurar cron para monitoreo cada 5 minutos:
```bash
sudo chmod +x /usr/local/bin/monitor-erp.sh
sudo crontab -e

# Agregar línea
*/5 * * * * /usr/local/bin/monitor-erp.sh
```

## Verificación y Pruebas

### 1. Verificar Instalación Web

```bash
# Verificar que Apache esté sirviendo la aplicación
curl -I http://localhost

# Verificar logs de Apache
sudo tail -f /var/log/apache2/erp_access.log
sudo tail -f /var/log/apache2/erp_error.log
```

### 2. Verificar Base de Datos

```sql
-- Conectar y verificar
mysql -u erp_user -p erp_aluminio_vidrio

-- Verificar estructura
SHOW TABLES;

-- Verificar datos iniciales
SELECT COUNT(*) FROM empresas;
SELECT COUNT(*) FROM usuarios;
SELECT COUNT(*) FROM productos;

-- Verificar configuración
SELECT * FROM configuracion_sistema LIMIT 5;
```

### 3. Verificar Funcionalidades

#### Acceso al Sistema:
1. Abrir navegador en `http://erp.tudominio.com`
2. Iniciar sesión con: `admin@empresa.com` / `admin123`
3. Verificar que todos los módulos cargan correctamente

#### Pruebas Básicas:
1. **Dashboard**: Verificar que se muestren las métricas
2. **Catálogos**: Crear un cliente de prueba
3. **Productos**: Agregar un producto
4. **Inventario**: Registrar un movimiento
5. **Corte Optimizado**: Probar el optimizador
6. **Utilerías**: Verificar funciones de administración

### 4. Pruebas de Rendimiento

```bash
# Instalar herramientas de prueba
sudo apt install apache2-utils

# Prueba de carga básica
ab -n 100 -c 10 http://erp.tudominio.com/

# Monitorear recursos durante la prueba
htop
```

## Configuración Avanzada

### 1. Configurar Redis (Opcional)

```bash
# Instalar Redis
sudo apt install redis-server

# Configurar Redis para sesiones
sudo nano /etc/redis/redis.conf

# Cambiar:
# maxmemory 256mb
# maxmemory-policy allkeys-lru

sudo systemctl restart redis-server
```

### 2. Configurar Elasticsearch (Opcional)

```bash
# Para búsquedas avanzadas en catálogos grandes
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
sudo apt update && sudo apt install elasticsearch

sudo systemctl enable elasticsearch
sudo systemctl start elasticsearch
```

### 3. Configurar Load Balancer (Para múltiples servidores)

Configuración Nginx como load balancer:

```nginx
upstream erp_backend {
    server 192.168.1.10:80;
    server 192.168.1.11:80;
    server 192.168.1.12:80;
}

server {
    listen 80;
    server_name erp.tudominio.com;
    
    location / {
        proxy_pass http://erp_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Solución de Problemas

### Problemas Comunes

#### 1. Error 500 - Internal Server Error
```bash
# Verificar logs de Apache
sudo tail -f /var/log/apache2/error.log

# Verificar permisos
sudo chown -R www-data:www-data /var/www/erp-aluminio-vidrio
sudo chmod -R 755 /var/www/erp-aluminio-vidrio
```

#### 2. Error de Conexión a Base de Datos
```bash
# Verificar estado de MySQL
sudo systemctl status mysql

# Verificar configuración
mysql -u erp_user -p -e "SELECT 1"

# Verificar archivo .env
cat /var/www/erp-aluminio-vidrio/.env | grep DB_
```

#### 3. Problemas de Rendimiento
```sql
-- Verificar consultas lentas
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;

-- Optimizar tablas
OPTIMIZE TABLE productos, clientes, facturas, movimientos_inventario;
```

### Contactos de Soporte

- **Soporte Técnico**: soporte@erpnube.com
- **Documentación**: https://docs.erpnube.com
- **Comunidad**: https://community.erpnube.com
- **Emergencias**: +52-800-ERP-NUBE

---

**Versión del Manual**: 3.0  
**Fecha de Actualización**: Enero 2024  
**Compatibilidad**: ERP Nube Aluminio/Vidrio v3.0+