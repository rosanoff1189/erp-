#!/bin/bash

# =============================================
# Script de Instalación Automática
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

# Detectar sistema operativo
detect_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        print_error "No se puede detectar el sistema operativo"
        exit 1
    fi
    
    print_message "Sistema detectado: $OS $VER"
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

# Instalar dependencias según el SO
install_dependencies() {
    print_header "Instalando Dependencias del Sistema"
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        install_ubuntu_dependencies
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        install_centos_dependencies
    else
        print_error "Sistema operativo no soportado: $OS"
        exit 1
    fi
}

install_ubuntu_dependencies() {
    print_message "Actualizando repositorios..."
    sudo apt update -y
    
    print_message "Instalando paquetes base..."
    sudo apt install -y curl wget git unzip software-properties-common
    
    print_message "Instalando Apache..."
    sudo apt install -y apache2
    sudo systemctl enable apache2
    sudo systemctl start apache2
    
    print_message "Instalando MySQL..."
    sudo apt install -y mysql-server
    sudo systemctl enable mysql
    sudo systemctl start mysql
    
    print_message "Instalando PHP 8.1 y extensiones..."
    sudo apt install -y php8.1 php8.1-mysql php8.1-json php8.1-mbstring \
        php8.1-xml php8.1-curl php8.1-zip php8.1-gd php8.1-intl \
        php8.1-bcmath php8.1-soap libapache2-mod-php8.1
    
    print_message "Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    
    print_message "Instalando Composer..."
    curl -sS https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer
}

install_centos_dependencies() {
    print_message "Actualizando sistema..."
    sudo dnf update -y
    
    print_message "Instalando repositorios adicionales..."
    sudo dnf install -y epel-release
    sudo dnf module enable php:8.1
    
    print_message "Instalando Apache..."
    sudo dnf install -y httpd
    sudo systemctl enable httpd
    sudo systemctl start httpd
    
    print_message "Instalando MySQL..."
    sudo dnf install -y mysql-server
    sudo systemctl enable mysqld
    sudo systemctl start mysqld
    
    print_message "Instalando PHP y extensiones..."
    sudo dnf install -y php php-mysql php-json php-mbstring \
        php-xml php-curl php-zip php-gd php-intl \
        php-bcmath php-soap
    
    print_message "Instalando Node.js..."
    curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
    sudo dnf install -y nodejs
    
    print_message "Configurando firewall..."
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --reload
}

# Configurar MySQL
configure_mysql() {
    print_header "Configurando MySQL"
    
    print_message "Ejecutando configuración segura de MySQL..."
    print_warning "Responda SÍ a todas las preguntas de seguridad"
    
    # Generar contraseña aleatoria para root si no está configurada
    if sudo mysql -e "SELECT 1" 2>/dev/null; then
        MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
        sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$MYSQL_ROOT_PASSWORD';"
        echo "MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD" > ~/.mysql_credentials
        print_message "Contraseña de root MySQL generada y guardada en ~/.mysql_credentials"
    fi
    
    # Configurar optimizaciones de MySQL
    print_message "Aplicando optimizaciones de MySQL..."
    sudo tee /etc/mysql/mysql.conf.d/erp-optimizations.cnf > /dev/null << EOF
[mysqld]
# Configuración ERP Aluminio/Vidrio
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
        echo "ERP_DB_PASSWORD=$ERP_DB_PASSWORD" >> ~/.mysql_credentials
        print_message "Credenciales guardadas en ~/.mysql_credentials"
    else
        print_error "Error al crear la base de datos"
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

# Configurar Apache
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
    
    # Configuración de seguridad
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    
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
EOF
    
    sudo chown www-data:www-data /var/www/erp-aluminio-vidrio/.env
    sudo chmod 600 /var/www/erp-aluminio-vidrio/.env
    
    print_message "Variables de entorno configuradas ✓"
}

# Ejecutar scripts de base de datos
setup_database() {
    print_header "Configurando Estructura de Base de Datos"
    
    source ~/.mysql_credentials
    
    print_message "Ejecutando script de estructura completa..."
    mysql -u erp_user -p$ERP_DB_PASSWORD erp_aluminio_vidrio < database/erp_estructura_completa.sql
    
    if [[ $? -eq 0 ]]; then
        print_message "Estructura de base de datos creada ✓"
        
        # Verificar instalación
        TABLES_COUNT=$(mysql -u erp_user -p$ERP_DB_PASSWORD erp_aluminio_vidrio -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'erp_aluminio_vidrio';" | tail -1)
        print_message "Tablas creadas: $TABLES_COUNT"
        
        USERS_COUNT=$(mysql -u erp_user -p$ERP_DB_PASSWORD erp_aluminio_vidrio -e "SELECT COUNT(*) FROM usuarios;" | tail -1)
        print_message "Usuarios iniciales: $USERS_COUNT"
    else
        print_error "Error al crear la estructura de base de datos"
        exit 1
    fi
}

# Configurar directorios de trabajo
setup_directories() {
    print_header "Configurando Directorios de Trabajo"
    
    # Crear directorios necesarios
    sudo mkdir -p /var/backups/erp
    sudo mkdir -p /tmp/erp
    sudo mkdir -p /var/www/erp-aluminio-vidrio/storage/{uploads,exports,logs,certificates}
    
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

# Configurar monitoreo
setup_monitoring() {
    print_header "Configurando Monitoreo del Sistema"
    
    source ~/.mysql_credentials
    
    # Crear script de monitoreo
    sudo tee /usr/local/bin/monitor-erp.sh > /dev/null << EOF
#!/bin/bash

# Verificar servicios
services=("apache2" "mysql")
for service in "\${services[@]}"; do
    if ! systemctl is-active --quiet \$service; then
        echo "\$(date): ALERTA - \$service no está ejecutándose" >> /var/log/erp-monitor.log
        systemctl start \$service
    fi
done

# Verificar espacio en disco
disk_usage=\$(df / | awk 'NR==2 {print \$5}' | sed 's/%//')
if [ \$disk_usage -gt 85 ]; then
    echo "\$(date): ALERTA - Uso de disco alto: \$disk_usage%" >> /var/log/erp-monitor.log
fi

# Verificar conexión a base de datos
if ! mysql -u erp_user -p$ERP_DB_PASSWORD -e "SELECT 1" erp_aluminio_vidrio > /dev/null 2>&1; then
    echo "\$(date): ALERTA - Error de conexión a base de datos" >> /var/log/erp-monitor.log
fi
EOF
    
    sudo chmod +x /usr/local/bin/monitor-erp.sh
    
    # Configurar cron para monitoreo cada 5 minutos
    (sudo crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/monitor-erp.sh") | sudo crontab -
    
    print_message "Monitoreo configurado (cada 5 minutos) ✓"
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
    
    # Mostrar información de acceso
    print_header "Información de Acceso"
    echo -e "${GREEN}URL del sistema:${NC} http://erp.local"
    echo -e "${GREEN}Usuario inicial:${NC} admin@empresa.com"
    echo -e "${GREEN}Contraseña inicial:${NC} admin123"
    echo -e "${GREEN}Credenciales MySQL:${NC} ~/.mysql_credentials"
    echo
    print_warning "IMPORTANTE: Cambie las contraseñas por defecto después del primer acceso"
}

# Función principal
main() {
    print_header "Instalador ERP Nube Aluminio/Vidrio v3.0"
    
    check_root
    detect_os
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
    install_application
    configure_apache
    configure_environment
    setup_database
    setup_directories
    setup_backups
    setup_monitoring
    verify_installation
    
    print_header "Instalación Completada"
    print_message "El sistema ERP Nube Aluminio/Vidrio ha sido instalado exitosamente"
    print_message "Puede acceder al sistema en: http://erp.local"
    print_warning "Recuerde configurar la integración SAT en el módulo de configuración"
}

# Ejecutar función principal
main "$@"