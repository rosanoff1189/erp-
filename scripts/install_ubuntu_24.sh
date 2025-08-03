#!/bin/bash

# =============================================
# Script de Instalación para Ubuntu Server 24.04.2 LTS
# ERP Nube Aluminio/Vidrio v3.0
# =============================================

set -e  # Salir si hay algún error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Verificar si se ejecuta como root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        print_error "Este script no debe ejecutarse como root"
        exit 1
    fi
}

# Verificar Ubuntu 24.04.2 LTS
check_ubuntu_version() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        if [[ "$ID" != "ubuntu" ]] || [[ "$VERSION_ID" != "24.04" ]]; then
            print_warning "Este script está optimizado para Ubuntu 24.04.2 LTS"
            print_warning "Sistema detectado: $PRETTY_NAME"
            read -p "¿Desea continuar? (y/N): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                exit 1
            fi
        else
            print_message "Ubuntu 24.04.2 LTS detectado ✓"
        fi
    fi
}

# Verificar requisitos del sistema
check_requirements() {
    print_header "Verificando Requisitos del Sistema"
    
    # Verificar memoria RAM
    RAM_GB=$(free -g | awk 'NR==2{printf "%.0f", $2}')
    if [[ $RAM_GB -lt 4 ]]; then
        print_warning "RAM insuficiente: ${RAM_GB}GB (mínimo 4GB recomendado)"
    else
        print_message "RAM disponible: ${RAM_GB}GB ✓"
    fi
    
    # Verificar espacio en disco
    DISK_GB=$(df -BG / | awk 'NR==2{print $4}' | sed 's/G//')
    if [[ $DISK_GB -lt 20 ]]; then
        print_error "Espacio en disco insuficiente: ${DISK_GB}GB (mínimo 20GB)"
        exit 1
    else
        print_message "Espacio en disco: ${DISK_GB}GB ✓"
    fi
    
    # Verificar conexión a internet
    if ping -c 1 google.com &> /dev/null; then
        print_message "Conexión a internet: ✓"
    else
        print_error "Sin conexión a internet"
        exit 1
    fi
}

# Instalar dependencias para Ubuntu 24.04.2 LTS
install_dependencies() {
    print_header "Instalando Dependencias del Sistema"
    
    print_message "Actualizando repositorios..."
    sudo apt update -y
    
    print_message "Instalando paquetes base..."
    sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
    
    print_message "Instalando MySQL Server 8.0..."
    sudo apt install -y mysql-server mysql-client
    sudo systemctl enable mysql
    sudo systemctl start mysql
    
    print_message "Instalando Apache2..."
    sudo apt install -y apache2
    sudo systemctl enable apache2
    sudo systemctl start apache2
    
    print_message "Instalando PHP 8.3 y extensiones..."
    sudo apt install -y php8.3 php8.3-mysql php8.3-json php8.3-mbstring \
        php8.3-xml php8.3-curl php8.3-zip php8.3-gd php8.3-intl \
        php8.3-bcmath php8.3-soap libapache2-mod-php8.3
    
    print_message "Instalando Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    
    print_message "Instalando Composer..."
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
    
    print_message "Verificando instalaciones..."
    php --version
    mysql --version
    node --version
    npm --version
}

# Configurar MySQL para Ubuntu 24.04.2 LTS
configure_mysql() {
    print_header "Configurando MySQL"
    
    print_message "Ejecutando configuración segura de MySQL..."
    print_warning "Responda SÍ a todas las preguntas de seguridad"
    
    # Configurar MySQL con configuración segura
    sudo mysql_secure_installation
    
    # Configurar optimizaciones de MySQL para Ubuntu 24.04.2
    print_message "Aplicando optimizaciones de MySQL..."
    sudo tee /etc/mysql/mysql.conf.d/erp-optimizations.cnf > /dev/null << EOF
[mysqld]
# Configuración ERP Aluminio/Vidrio para Ubuntu 24.04.2 LTS
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_log_buffer_size = 16M
max_connections = 200
query_cache_type = 1
query_cache_size = 128M
tmp_table_size = 128M
max_heap_table_size = 128M
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

# Configuración específica para Ubuntu 24.04.2
bind-address = 127.0.0.1
mysqlx-bind-address = 127.0.0.1
log_error = /var/log/mysql/error.log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
EOF
    
    sudo systemctl restart mysql
    print_message "MySQL configurado y reiniciado ✓"
}

# Crear base de datos
create_database() {
    print_header "Creando Base de Datos"
    
    # Solicitar credenciales
    read -p "Ingrese la contraseña de root de MySQL: " -s MYSQL_ROOT_PASSWORD
    echo
    
    # Generar contraseña para usuario ERP
    ERP_DB_PASSWORD=$(openssl rand -base64 16)
    
    print_message "Creando base de datos y usuario..."
    
    mysql -u root -p$MYSQL_ROOT_PASSWORD << EOF
CREATE DATABASE IF NOT EXISTS erp_aluminio_vidrio 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'erp_user'@'localhost' IDENTIFIED BY '$ERP_DB_PASSWORD';
GRANT ALL PRIVILEGES ON erp_aluminio_vidrio.* TO 'erp_user'@'localhost';
FLUSH PRIVILEGES;
EOF
    
    if [[ $? -eq 0 ]]; then
        print_message "Base de datos creada exitosamente ✓"
        echo "ERP_DB_PASSWORD=$ERP_DB_PASSWORD" > ~/.mysql_credentials
        print_message "Credenciales guardadas en ~/.mysql_credentials"
    else
        print_error "Error al crear la base de datos"
        exit 1
    fi
}

# Ejecutar script de estructura
setup_database_structure() {
    print_header "Configurando Estructura de Base de Datos"
    
    source ~/.mysql_credentials
    
    print_message "Ejecutando script de estructura completa..."
    mysql -u erp_user -p$ERP_DB_PASSWORD erp_aluminio_vidrio < database/mysql_erp_complete.sql
    
    if [[ $? -eq 0 ]]; then
        print_message "Estructura de base de datos creada ✓"
        
        # Verificar instalación
        TABLES_COUNT=$(mysql -u erp_user -p$ERP_DB_PASSWORD erp_aluminio_vidrio -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'erp_aluminio_vidrio';" | tail -1)
        print_message "Tablas creadas: $TABLES_COUNT"
        
        USERS_COUNT=$(mysql -u erp_user -p$ERP_DB_PASSWORD erp_aluminio_vidrio -e "SELECT COUNT(*) FROM usuarios;" | tail -1)
        print_message "Usuarios iniciales: $USERS_COUNT"
        
        MATERIALS_COUNT=$(mysql -u erp_user -p$ERP_DB_PASSWORD erp_aluminio_vidrio -e "SELECT COUNT(*) FROM materiales_corte;" | tail -1)
        print_message "Materiales de corte: $MATERIALS_COUNT"
    else
        print_error "Error al crear la estructura de base de datos"
        exit 1
    fi
}

# Instalar aplicación
install_application() {
    print_header "Instalando Aplicación ERP"
    
    # Crear directorio de la aplicación
    APP_DIR="/var/www/erp-aluminio-vidrio"
    sudo mkdir -p $APP_DIR
    
    # Copiar archivos (asumiendo que están en el directorio actual)
    print_message "Copiando archivos de la aplicación..."
    sudo cp -r . $APP_DIR/
    
    # Establecer permisos
    sudo chown -R www-data:www-data $APP_DIR
    sudo chmod -R 755 $APP_DIR
    
    # Instalar dependencias Node.js
    print_message "Instalando dependencias Node.js..."
    cd $APP_DIR
    sudo -u www-data npm install
    
    # Construir aplicación
    print_message "Construyendo aplicación..."
    sudo -u www-data npm run build
    
    print_message "Aplicación instalada en $APP_DIR ✓"
}

# Configurar Apache para Ubuntu 24.04.2 LTS
configure_apache() {
    print_header "Configurando Apache"
    
    # Crear virtual host
    sudo tee /etc/apache2/sites-available/erp-aluminio-vidrio.conf > /dev/null << EOF
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
    
    # Configuración de seguridad para Ubuntu 24.04.2
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Logs
    ErrorLog \${APACHE_LOG_DIR}/erp_error.log
    CustomLog \${APACHE_LOG_DIR}/erp_access.log combined
</VirtualHost>
EOF
    
    # Habilitar módulos y sitio
    sudo a2enmod rewrite headers
    sudo a2ensite erp-aluminio-vidrio.conf
    sudo a2dissite 000-default.conf
    
    # Reiniciar Apache
    sudo systemctl restart apache2
    
    print_message "Apache configurado ✓"
}

# Configurar variables de entorno
configure_environment() {
    print_header "Configurando Variables de Entorno"
    
    # Leer credenciales guardadas
    source ~/.mysql_credentials
    
    # Crear archivo .env
    sudo tee /var/www/erp-aluminio-vidrio/.env > /dev/null << EOF
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=erp_aluminio_vidrio
DB_USERNAME=erp_user
DB_PASSWORD=$ERP_DB_PASSWORD

# Configuración de la Aplicación
APP_NAME="ERP Nube Aluminio/Vidrio"
APP_ENV=production
APP_DEBUG=false
APP_URL=http://erp.local

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

# Configuración específica Ubuntu 24.04.2 LTS
SYSTEM_VERSION=ubuntu-24.04.2-lts
PHP_VERSION=8.3
MYSQL_VERSION=8.0
NODE_VERSION=20
EOF
    
    sudo chown www-data:www-data /var/www/erp-aluminio-vidrio/.env
    sudo chmod 600 /var/www/erp-aluminio-vidrio/.env
    
    print_message "Variables de entorno configuradas ✓"
}

# Configurar directorios de trabajo
setup_directories() {
    print_header "Configurando Directorios de Trabajo"
    
    # Crear directorios necesarios
    sudo mkdir -p /var/backups/erp
    sudo mkdir -p /tmp/erp
    sudo mkdir -p /var/www/erp-aluminio-vidrio/storage/{uploads,exports,logs,certificates,cutting_projects}
    
    # Establecer permisos
    sudo chown -R www-data:www-data /var/backups/erp
    sudo chown -R www-data:www-data /tmp/erp
    sudo chown -R www-data:www-data /var/www/erp-aluminio-vidrio/storage
    
    sudo chmod -R 755 /var/backups/erp
    sudo chmod -R 755 /tmp/erp
    sudo chmod -R 755 /var/www/erp-aluminio-vidrio/storage
    sudo chmod 700 /var/www/erp-aluminio-vidrio/storage/certificates
    
    print_message "Directorios configurados ✓"
}

# Configurar respaldos automáticos
setup_backups() {
    print_header "Configurando Respaldos Automáticos"
    
    source ~/.mysql_credentials
    
    # Crear script de respaldo
    sudo tee /usr/local/bin/backup-erp.sh > /dev/null << EOF
#!/bin/bash

# Configuración
DB_NAME="erp_aluminio_vidrio"
DB_USER="erp_user"
DB_PASS="$ERP_DB_PASSWORD"
BACKUP_DIR="/var/backups/erp"
DATE=\$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Crear directorio si no existe
mkdir -p \$BACKUP_DIR

# Respaldo de base de datos
mysqldump -u \$DB_USER -p\$DB_PASS \$DB_NAME | gzip > \$BACKUP_DIR/db_backup_\$DATE.sql.gz

# Respaldo de archivos de aplicación
tar -czf \$BACKUP_DIR/files_backup_\$DATE.tar.gz \\
    /var/www/erp-aluminio-vidrio/storage \\
    /var/www/erp-aluminio-vidrio/.env

# Limpiar respaldos antiguos
find \$BACKUP_DIR -name "*.gz" -mtime +\$RETENTION_DAYS -delete

# Log del respaldo
echo "\$(date): Respaldo completado - db_backup_\$DATE.sql.gz" >> /var/log/erp-backup.log
EOF
    
    sudo chmod +x /usr/local/bin/backup-erp.sh
    
    # Configurar cron para respaldos diarios
    (sudo crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-erp.sh") | sudo crontab -
    
    print_message "Respaldos automáticos configurados (diario a las 2:00 AM) ✓"
}

# Configurar firewall UFW para Ubuntu 24.04.2
configure_firewall() {
    print_header "Configurando Firewall UFW"
    
    # Habilitar UFW
    sudo ufw --force enable
    
    # Permitir SSH
    sudo ufw allow ssh
    
    # Permitir Apache
    sudo ufw allow 'Apache Full'
    
    # Bloquear acceso directo a MySQL
    sudo ufw deny 3306
    
    # Mostrar estado
    sudo ufw status
    
    print_message "Firewall configurado ✓"
}

# Verificar instalación
verify_installation() {
    print_header "Verificando Instalación"
    
    # Verificar servicios
    if systemctl is-active --quiet apache2; then
        print_message "Apache: ✓ Ejecutándose"
    else
        print_error "Apache: ✗ No está ejecutándose"
    fi
    
    if systemctl is-active --quiet mysql; then
        print_message "MySQL: ✓ Ejecutándose"
    else
        print_error "MySQL: ✗ No está ejecutándose"
    fi
    
    # Verificar conexión web
    if curl -s http://localhost > /dev/null; then
        print_message "Servidor web: ✓ Respondiendo"
    else
        print_warning "Servidor web: ⚠ No responde en localhost"
    fi
    
    # Verificar base de datos
    source ~/.mysql_credentials
    if mysql -u erp_user -p$ERP_DB_PASSWORD -e "SELECT 1" erp_aluminio_vidrio > /dev/null 2>&1; then
        print_message "Base de datos: ✓ Conexión exitosa"
    else
        print_error "Base de datos: ✗ Error de conexión"
    fi
    
    # Verificar estructura de corte optimizado
    CUTTING_TABLES=$(mysql -u erp_user -p$ERP_DB_PASSWORD erp_aluminio_vidrio -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'erp_aluminio_vidrio' AND table_name LIKE '%corte%';" | tail -1)
    print_message "Tablas de corte optimizado: $CUTTING_TABLES"
    
    # Mostrar información de acceso
    print_header "Información de Acceso"
    echo -e "${GREEN}URL del sistema:${NC} http://erp.local"
    echo -e "${GREEN}Usuario inicial:${NC} admin@empresa.com"
    echo -e "${GREEN}Contraseña inicial:${NC} admin123"
    echo -e "${GREEN}Credenciales MySQL:${NC} ~/.mysql_credentials"
    echo -e "${GREEN}Sistema:${NC} Ubuntu 24.04.2 LTS"
    echo -e "${GREEN}Módulos incluidos:${NC} Corte Optimizado, Facturación SAT, Inventario, Ventas, Compras"
    echo
    print_warning "IMPORTANTE: Cambie las contraseñas por defecto después del primer acceso"
}

# Función principal
main() {
    print_header "Instalador ERP Nube Aluminio/Vidrio v3.0"
    print_message "Optimizado para Ubuntu Server 24.04.2 LTS"
    
    check_root
    check_ubuntu_version
    check_requirements
    
    print_message "¿Desea continuar con la instalación? (y/N)"
    read -r CONFIRM
    if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
        print_message "Instalación cancelada"
        exit 0
    fi
    
    install_dependencies
    configure_mysql
    create_database
    setup_database_structure
    install_application
    configure_apache
    configure_environment
    setup_directories
    setup_backups
    configure_firewall
    verify_installation
    
    print_header "Instalación Completada"
    print_message "El sistema ERP Nube Aluminio/Vidrio ha sido instalado exitosamente"
    print_message "Puede acceder al sistema en: http://erp.local"
    print_message "Módulo de Corte Optimizado disponible en el menú principal"
    print_warning "Recuerde configurar la integración SAT en el módulo de configuración"
}

# Ejecutar función principal
main "$@"