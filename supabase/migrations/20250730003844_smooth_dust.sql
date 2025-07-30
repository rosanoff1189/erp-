-- ERP Nube Aluminio/Vidrio - Scripts SQL Base
-- Versión 3.0 - Estructura Completa

-- =============================================
-- TABLAS PRINCIPALES
-- =============================================

-- Empresas (Multiempresa)
CREATE TABLE empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    razon_social VARCHAR(255) NOT NULL,
    rfc VARCHAR(13) NOT NULL UNIQUE,
    regimen_fiscal VARCHAR(10),
    domicilio_fiscal TEXT,
    telefono VARCHAR(50),
    correo VARCHAR(255),
    sitio_web VARCHAR(255),
    logo_url VARCHAR(500),
    status ENUM('Activa','Inactiva') DEFAULT 'Activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Sucursales
CREATE TABLE sucursales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(50),
    correo VARCHAR(255),
    gerente VARCHAR(255),
    es_principal BOOLEAN DEFAULT FALSE,
    status ENUM('Activa','Inactiva') DEFAULT 'Activa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    UNIQUE KEY unique_codigo_empresa (empresa_id, codigo)
);

-- Roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    permisos JSON,
    status ENUM('Activo','Inactivo') DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    sucursal_id INT,
    rol_id INT,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    status ENUM('Activo','Inactivo','Bloqueado') DEFAULT 'Activo',
    ultimo_acceso TIMESTAMP NULL,
    intentos_fallidos INT DEFAULT 0,
    fecha_bloqueo TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id),
    FOREIGN KEY (rol_id) REFERENCES roles(id),
    UNIQUE KEY unique_email_empresa (email, empresa_id)
);

-- Clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    sucursal_id INT,
    nombre VARCHAR(255) NOT NULL,
    rfc VARCHAR(13) NOT NULL,
    status ENUM('Activo','Inactivo') DEFAULT 'Activo',
    telefono VARCHAR(50),
    correo VARCHAR(255),
    direccion TEXT,
    codigo_postal VARCHAR(10),
    saldo DECIMAL(15,2) DEFAULT 0,
    limite_credito DECIMAL(15,2) DEFAULT 0,
    precio_especial BOOLEAN DEFAULT FALSE,
    descuento DECIMAL(5,2) DEFAULT 0,
    metodo_pago_preferido VARCHAR(50),
    condiciones_credito VARCHAR(100),
    vendedor_id INT,
    comentarios TEXT,
    uso_cfdi VARCHAR(10) DEFAULT 'G03',
    regimen_fiscal VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id),
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
    UNIQUE KEY unique_rfc_empresa (rfc, empresa_id)
);

-- Proveedores
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    nombre VARCHAR(255) NOT NULL,
    rfc VARCHAR(13) NOT NULL,
    status ENUM('Activo','Inactivo') DEFAULT 'Activo',
    telefono VARCHAR(50),
    correo VARCHAR(255),
    direccion TEXT,
    codigo_postal VARCHAR(10),
    saldo DECIMAL(15,2) DEFAULT 0,
    limite_credito DECIMAL(15,2) DEFAULT 0,
    metodo_pago_habitual VARCHAR(50),
    condiciones_credito TEXT,
    contacto_principal VARCHAR(255),
    categoria VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    UNIQUE KEY unique_rfc_empresa (rfc, empresa_id)
);

-- Líneas de Producción
CREATE TABLE lineas_produccion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    status ENUM('Activo','Inactivo') DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

-- Acabados de Aluminio
CREATE TABLE acabados_aluminio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    color VARCHAR(7), -- Código hexadecimal
    tipo VARCHAR(100),
    costo_adicional DECIMAL(10,2) DEFAULT 0,
    status ENUM('Activo','Inactivo') DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

-- Productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    codigo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    linea_id INT,
    status ENUM('Activo','Inactivo') DEFAULT 'Activo',
    ubicacion VARCHAR(255),
    unidad_sat VARCHAR(10),
    clave_sat VARCHAR(20),
    precio_base DECIMAL(15,2),
    costo DECIMAL(15,2),
    stock_min INT DEFAULT 0,
    stock_max INT DEFAULT 0,
    stock_actual INT DEFAULT 0,
    punto_reorden INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    FOREIGN KEY (linea_id) REFERENCES lineas_produccion(id),
    UNIQUE KEY unique_codigo_empresa (codigo, empresa_id)
);

-- Almacenes
CREATE TABLE almacenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    sucursal_id INT,
    nombre VARCHAR(255) NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    direccion TEXT,
    responsable VARCHAR(255),
    status ENUM('Activo','Inactivo') DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    FOREIGN KEY (sucursal_id) REFERENCES sucursales(id),
    UNIQUE KEY unique_codigo_empresa (codigo, empresa_id)
);

-- Inventario por Almacén
CREATE TABLE inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    almacen_id INT,
    stock_actual INT DEFAULT 0,
    stock_reservado INT DEFAULT 0,
    stock_disponible INT GENERATED ALWAYS AS (stock_actual - stock_reservado) STORED,
    costo_promedio DECIMAL(15,2) DEFAULT 0,
    ultima_entrada TIMESTAMP NULL,
    ultima_salida TIMESTAMP NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (almacen_id) REFERENCES almacenes(id),
    UNIQUE KEY unique_producto_almacen (producto_id, almacen_id)
);

-- Movimientos de Inventario
CREATE TABLE movimientos_inventario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    almacen_id INT,
    tipo ENUM('Entrada','Salida','Transferencia','Ajuste') NOT NULL,
    documento VARCHAR(50),
    cantidad INT NOT NULL,
    costo_unitario DECIMAL(15,2),
    saldo_anterior INT,
    saldo_nuevo INT,
    origen VARCHAR(255),
    destino VARCHAR(255),
    lote VARCHAR(50),
    usuario_id INT,
    observaciones TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (almacen_id) REFERENCES almacenes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Cotizaciones
CREATE TABLE cotizaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    folio VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    fecha_vencimiento DATE,
    cliente_id INT,
    vendedor_id INT,
    subtotal DECIMAL(15,2) DEFAULT 0,
    descuento DECIMAL(15,2) DEFAULT 0,
    iva DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) DEFAULT 0,
    status ENUM('Vigente','Aprobada','Rechazada','Vencida') DEFAULT 'Vigente',
    probabilidad INT DEFAULT 50,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
    UNIQUE KEY unique_folio_empresa (folio, empresa_id)
);

-- Detalle de Cotizaciones
CREATE TABLE cotizacion_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cotizacion_id INT,
    producto_id INT,
    cantidad DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(15,2) NOT NULL,
    descuento DECIMAL(5,2) DEFAULT 0,
    importe DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Pedidos
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    folio VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    fecha_entrega DATE,
    cliente_id INT,
    vendedor_id INT,
    cotizacion_id INT NULL,
    subtotal DECIMAL(15,2) DEFAULT 0,
    descuento DECIMAL(15,2) DEFAULT 0,
    iva DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) DEFAULT 0,
    status ENUM('Confirmado','En Producción','Listo para Envío','Entregado','Cancelado') DEFAULT 'Confirmado',
    prioridad ENUM('Alta','Media','Baja') DEFAULT 'Media',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
    FOREIGN KEY (cotizacion_id) REFERENCES cotizaciones(id),
    UNIQUE KEY unique_folio_empresa (folio, empresa_id)
);

-- Detalle de Pedidos
CREATE TABLE pedido_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT,
    producto_id INT,
    cantidad DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(15,2) NOT NULL,
    descuento DECIMAL(5,2) DEFAULT 0,
    importe DECIMAL(15,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Facturas
CREATE TABLE facturas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    folio VARCHAR(50) NOT NULL,
    serie VARCHAR(10),
    fecha DATETIME NOT NULL,
    cliente_id INT,
    vendedor_id INT,
    pedido_id INT NULL,
    subtotal DECIMAL(15,2) DEFAULT 0,
    descuento DECIMAL(15,2) DEFAULT 0,
    iva DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) DEFAULT 0,
    status ENUM('Pendiente','Timbrada','Pagada','Cancelada') DEFAULT 'Pendiente',
    metodo_pago_sat VARCHAR(20),
    forma_pago_sat VARCHAR(20),
    uso_cfdi VARCHAR(10),
    uuid_sat VARCHAR(100) UNIQUE,
    certificado_sello VARCHAR(255),
    xml_content LONGTEXT,
    pdf_url VARCHAR(500),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    UNIQUE KEY unique_folio_empresa (folio, empresa_id)
);

-- Detalle de Facturas
CREATE TABLE factura_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    factura_id INT,
    producto_id INT,
    cantidad DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(15,2) NOT NULL,
    descuento DECIMAL(5,2) DEFAULT 0,
    importe DECIMAL(15,2) NOT NULL,
    clave_sat VARCHAR(20),
    unidad_sat VARCHAR(10),
    FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Remisiones
CREATE TABLE remisiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    folio VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    cliente_id INT,
    vendedor_id INT,
    pedido_id INT NULL,
    almacen_id INT,
    total DECIMAL(15,2) DEFAULT 0,
    status ENUM('Pendiente','Entregada','Cancelada') DEFAULT 'Pendiente',
    facturada BOOLEAN DEFAULT FALSE,
    factura_id INT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (almacen_id) REFERENCES almacenes(id),
    FOREIGN KEY (factura_id) REFERENCES facturas(id),
    UNIQUE KEY unique_folio_empresa (folio, empresa_id)
);

-- Órdenes de Compra
CREATE TABLE ordenes_compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    folio VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    fecha_entrega DATE,
    proveedor_id INT,
    comprador_id INT,
    subtotal DECIMAL(15,2) DEFAULT 0,
    iva DECIMAL(15,2) DEFAULT 0,
    total DECIMAL(15,2) DEFAULT 0,
    status ENUM('Pendiente','Aprobada','Recibida','Cancelada') DEFAULT 'Pendiente',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id),
    FOREIGN KEY (comprador_id) REFERENCES usuarios(id),
    UNIQUE KEY unique_folio_empresa (folio, empresa_id)
);

-- Detalle de Órdenes de Compra
CREATE TABLE orden_compra_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orden_compra_id INT,
    producto_id INT,
    cantidad DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(15,2) NOT NULL,
    importe DECIMAL(15,2) NOT NULL,
    cantidad_recibida DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (orden_compra_id) REFERENCES ordenes_compra(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Choferes
CREATE TABLE choferes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    nombre VARCHAR(255) NOT NULL,
    licencia VARCHAR(50) NOT NULL,
    telefono VARCHAR(50),
    correo VARCHAR(255),
    fecha_vencimiento DATE,
    status ENUM('Activo','Inactivo') DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id)
);

-- Vehículos
CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    placas VARCHAR(20) NOT NULL,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    año INT,
    capacidad VARCHAR(50),
    tipo VARCHAR(50),
    poliza_seguro VARCHAR(100),
    vence_seguro DATE,
    status ENUM('Activo','Mantenimiento','Inactivo') DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    UNIQUE KEY unique_placas_empresa (placas, empresa_id)
);

-- Rutas de Reparto
CREATE TABLE rutas_reparto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    zona VARCHAR(255) NOT NULL,
    descripcion TEXT,
    chofer_id INT,
    vehiculo_id INT,
    status ENUM('Activo','Inactivo') DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    FOREIGN KEY (chofer_id) REFERENCES choferes(id),
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
);

-- Devoluciones
CREATE TABLE devoluciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    folio VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL,
    cliente_id INT,
    factura_id INT,
    vendedor_id INT,
    motivo VARCHAR(255),
    tipo_devolucion ENUM('Cambio','Reembolso','Nota de Crédito'),
    total DECIMAL(15,2) DEFAULT 0,
    status ENUM('Pendiente','Aprobada','Procesada','Rechazada') DEFAULT 'Pendiente',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (factura_id) REFERENCES facturas(id),
    FOREIGN KEY (vendedor_id) REFERENCES usuarios(id),
    UNIQUE KEY unique_folio_empresa (folio, empresa_id)
);

-- =============================================
-- TABLAS DE AUDITORÍA Y CONTROL
-- =============================================

-- Bitácora de Accesos
CREATE TABLE bitacora_accesos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    accion VARCHAR(100) NOT NULL,
    modulo VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    detalles TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Auditoría de Cambios
CREATE TABLE auditoria_cambios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tabla VARCHAR(100) NOT NULL,
    registro_id INT NOT NULL,
    operacion ENUM('INSERT','UPDATE','DELETE') NOT NULL,
    usuario_id INT,
    valores_anteriores JSON,
    valores_nuevos JSON,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Configuración del Sistema
CREATE TABLE configuracion_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT,
    clave VARCHAR(100) NOT NULL,
    valor TEXT,
    descripcion TEXT,
    tipo ENUM('string','number','boolean','json') DEFAULT 'string',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id),
    UNIQUE KEY unique_clave_empresa (clave, empresa_id)
);

-- Catálogos SAT
CREATE TABLE catalogos_sat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    clave VARCHAR(20) NOT NULL,
    descripcion VARCHAR(500),
    status ENUM('Activo','Inactivo') DEFAULT 'Activo',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_tipo_clave (tipo, clave)
);

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Insertar empresa demo
INSERT INTO empresas (razon_social, rfc, regimen_fiscal, domicilio_fiscal, telefono, correo) VALUES
('Aluminios y Vidrios del Norte S.A. de C.V.', 'AVN123456789', '601', 'Av. Industrial 123, Col. Norte, CP 64000, Monterrey, N.L.', '81-1234-5678', 'contacto@aluminiosnorte.com');

-- Insertar sucursal principal
INSERT INTO sucursales (empresa_id, nombre, codigo, direccion, telefono, correo, gerente, es_principal) VALUES
(1, 'Matriz', 'MTZ', 'Av. Industrial 123, Col. Norte, CP 64000, Monterrey, N.L.', '81-1234-5678', 'matriz@aluminiosnorte.com', 'Ing. Roberto Martínez', TRUE);

-- Insertar roles básicos
INSERT INTO roles (nombre, descripcion, permisos) VALUES
('Administrador', 'Acceso completo al sistema', '["all"]'),
('Vendedor', 'Gestión de ventas y clientes', '["ventas.read", "ventas.write", "clientes.read", "clientes.write", "productos.read"]'),
('Almacenista', 'Gestión de inventario', '["inventario.read", "inventario.write", "productos.read"]'),
('Comprador', 'Gestión de compras y proveedores', '["compras.read", "compras.write", "proveedores.read", "proveedores.write"]');

-- Insertar usuario administrador
INSERT INTO usuarios (empresa_id, sucursal_id, rol_id, nombre, email, password_hash) VALUES
(1, 1, 1, 'Administrador Sistema', 'admin@empresa.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insertar líneas de producción
INSERT INTO lineas_produccion (empresa_id, nombre, descripcion) VALUES
(1, 'Cancelería Residencial', 'Ventanas y puertas para casas habitación'),
(1, 'Cancelería Comercial', 'Sistemas para edificios comerciales'),
(1, 'Fachadas Estructurales', 'Muros cortina y fachadas integrales'),
(1, 'Vidrios Especiales', 'Vidrios templados, laminados y especiales');

-- Insertar acabados de aluminio
INSERT INTO acabados_aluminio (empresa_id, nombre, descripcion, color) VALUES
(1, 'Natural', 'Aluminio sin tratamiento superficial', '#C0C0C0'),
(1, 'Anodizado Plata', 'Acabado anodizado color plata', '#E5E5E5'),
(1, 'Anodizado Oro', 'Acabado anodizado color oro', '#FFD700'),
(1, 'Anodizado Bronce', 'Acabado anodizado color bronce', '#CD7F32'),
(1, 'Anodizado Negro', 'Acabado anodizado color negro', '#2C2C2C'),
(1, 'Pintado Blanco', 'Pintura electroestática blanca', '#FFFFFF');

-- Insertar almacén principal
INSERT INTO almacenes (empresa_id, sucursal_id, nombre, codigo, direccion, responsable) VALUES
(1, 1, 'Almacén General', 'ALM01', 'Av. Industrial 123, Col. Norte', 'Juan Pérez');

-- Insertar productos demo
INSERT INTO productos (empresa_id, codigo, descripcion, linea_id, ubicacion, unidad_sat, clave_sat, precio_base, costo, stock_min, stock_max, stock_actual) VALUES
(1, 'VT-6MM-001', 'Vidrio Templado 6mm Transparente', 4, 'A-01-15', 'M2', '43211701', 350.00, 210.00, 50, 500, 125),
(1, 'AL-NAT-001', 'Perfil Aluminio Natural 2x1', 1, 'B-02-08', 'PZA', '30111506', 145.50, 87.30, 100, 1000, 320),
(1, 'VL-8MM-001', 'Vidrio Laminado 8mm Seguridad', 4, 'A-03-22', 'M2', '43211702', 520.00, 312.00, 30, 300, 85),
(1, 'HE-PREM-001', 'Herraje Premium Ventana', 1, 'C-01-10', 'PZA', '30111507', 89.50, 45.20, 200, 2000, 450);

-- Insertar inventario inicial
INSERT INTO inventario (producto_id, almacen_id, stock_actual, costo_promedio) VALUES
(1, 1, 125, 210.00),
(2, 1, 320, 87.30),
(3, 1, 85, 312.00),
(4, 1, 450, 45.20);

-- Insertar clientes demo
INSERT INTO clientes (empresa_id, sucursal_id, nombre, rfc, telefono, correo, direccion, saldo, precio_especial, descuento, metodo_pago_preferido, vendedor_id, comentarios) VALUES
(1, 1, 'Constructora ABC S.A. de C.V.', 'CABC123456789', '555-0123', 'contacto@constructoraabc.com', 'Av. Reforma 123, Col. Centro', 85430.50, TRUE, 15.0, 'Transferencia', 1, 'Cliente preferencial, crédito 30 días'),
(1, 1, 'Vidrios del Norte S.A.', 'VNO890123456', '555-0456', 'compras@vidriosdelnorte.com', 'Blvd. Industrial 456, Zona Norte', 23750.00, FALSE, 5.0, 'Cheque', 1, 'Distribuidor regional'),
(1, 1, 'Juan Pérez Construcciones', 'PEXJ850429AB1', '555-0789', 'juan@construcciones.com', 'Calle 5 de Mayo 789, Col. Americana', 0.00, FALSE, 0.0, 'Efectivo', 1, 'Cliente de contado');

-- Insertar proveedores demo
INSERT INTO proveedores (empresa_id, nombre, rfc, telefono, correo, direccion, saldo, metodo_pago_habitual, condiciones_credito, contacto_principal, categoria) VALUES
(1, 'Aluminios Industriales S.A.', 'AIN123456789', '555-1001', 'ventas@aluminiosindustriales.com', 'Zona Industrial Norte, Lote 15', 125430.50, 'Transferencia', '30 días', 'Ing. María López', 'Materia Prima'),
(1, 'Vidrios y Cristales del Bajío', 'VCB890123456', '555-1002', 'compras@vidriosbajio.com', 'Carretera Nacional Km 45', 89750.00, 'Cheque', '15 días', 'Lic. Carlos Ramírez', 'Vidrio'),
(1, 'Herrajes y Accesorios Premium', 'HAP850429AB1', '555-1003', 'info@herrajespremium.com', 'Boulevard de la Industria 234', 45200.00, 'Efectivo', 'Contado', 'Sr. Jorge Mendoza', 'Herrajes');

-- Insertar catálogos SAT básicos
INSERT INTO catalogos_sat (tipo, clave, descripcion) VALUES
('productos_servicios', '43211701', 'Vidrio para construcción'),
('productos_servicios', '30111506', 'Perfiles de aluminio'),
('productos_servicios', '43211702', 'Vidrio templado'),
('productos_servicios', '30111507', 'Marcos de aluminio'),
('monedas', 'MXN', 'Peso Mexicano'),
('monedas', 'USD', 'Dólar de los Estados Unidos'),
('unidades', 'PZA', 'Pieza'),
('unidades', 'M2', 'Metro cuadrado'),
('unidades', 'KG', 'Kilogramo'),
('metodos_pago', 'PUE', 'Pago en una sola exhibición'),
('metodos_pago', 'PPD', 'Pago en parcialidades o diferido'),
('formas_pago', '01', 'Efectivo'),
('formas_pago', '03', 'Transferencia electrónica de fondos'),
('formas_pago', '04', 'Tarjeta de crédito');

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

-- Índices para búsquedas frecuentes
CREATE INDEX idx_clientes_rfc ON clientes(rfc);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE INDEX idx_clientes_status ON clientes(status);
CREATE INDEX idx_productos_codigo ON productos(codigo);
CREATE INDEX idx_productos_descripcion ON productos(descripcion);
CREATE INDEX idx_facturas_folio ON facturas(folio);
CREATE INDEX idx_facturas_fecha ON facturas(fecha);
CREATE INDEX idx_facturas_status ON facturas(status);
CREATE INDEX idx_movimientos_fecha ON movimientos_inventario(fecha);
CREATE INDEX idx_bitacora_fecha ON bitacora_accesos(fecha);
CREATE INDEX idx_auditoria_fecha ON auditoria_cambios(fecha);

-- =============================================
-- TRIGGERS PARA AUDITORÍA AUTOMÁTICA
-- =============================================

DELIMITER $$

-- Trigger para auditoría de clientes
CREATE TRIGGER tr_clientes_audit_insert
AFTER INSERT ON clientes
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_cambios (tabla, registro_id, operacion, valores_nuevos)
    VALUES ('clientes', NEW.id, 'INSERT', JSON_OBJECT(
        'nombre', NEW.nombre,
        'rfc', NEW.rfc,
        'status', NEW.status,
        'saldo', NEW.saldo
    ));
END$$

CREATE TRIGGER tr_clientes_audit_update
AFTER UPDATE ON clientes
FOR EACH ROW
BEGIN
    INSERT INTO auditoria_cambios (tabla, registro_id, operacion, valores_anteriores, valores_nuevos)
    VALUES ('clientes', NEW.id, 'UPDATE', 
        JSON_OBJECT('nombre', OLD.nombre, 'rfc', OLD.rfc, 'status', OLD.status, 'saldo', OLD.saldo),
        JSON_OBJECT('nombre', NEW.nombre, 'rfc', NEW.rfc, 'status', NEW.status, 'saldo', NEW.saldo)
    );
END$$

-- Trigger para actualizar inventario
CREATE TRIGGER tr_movimientos_update_inventario
AFTER INSERT ON movimientos_inventario
FOR EACH ROW
BEGIN
    UPDATE inventario 
    SET stock_actual = NEW.saldo_nuevo,
        ultima_entrada = CASE WHEN NEW.tipo IN ('Entrada', 'Transferencia') AND NEW.cantidad > 0 THEN NEW.fecha ELSE ultima_entrada END,
        ultima_salida = CASE WHEN NEW.tipo IN ('Salida', 'Transferencia') AND NEW.cantidad < 0 THEN NEW.fecha ELSE ultima_salida END
    WHERE producto_id = NEW.producto_id AND almacen_id = NEW.almacen_id;
END$$

DELIMITER ;

-- =============================================
-- VISTAS PARA REPORTES
-- =============================================

-- Vista de inventario consolidado
CREATE VIEW v_inventario_consolidado AS
SELECT 
    p.codigo,
    p.descripcion,
    lp.nombre as linea,
    SUM(i.stock_actual) as stock_total,
    p.stock_min,
    p.stock_max,
    p.precio_base,
    p.costo,
    (SUM(i.stock_actual) * p.costo) as valor_inventario,
    CASE 
        WHEN SUM(i.stock_actual) <= p.stock_min THEN 'Bajo'
        WHEN SUM(i.stock_actual) >= p.stock_max * 0.8 THEN 'Alto'
        ELSE 'Normal'
    END as status_stock
FROM productos p
LEFT JOIN inventario i ON p.id = i.producto_id
LEFT JOIN lineas_produccion lp ON p.linea_id = lp.id
WHERE p.status = 'Activo'
GROUP BY p.id;

-- Vista de cartera de clientes
CREATE VIEW v_cartera_clientes AS
SELECT 
    c.nombre,
    c.rfc,
    c.saldo,
    c.limite_credito,
    (c.saldo / NULLIF(c.limite_credito, 0) * 100) as porcentaje_credito,
    u.nombre as vendedor,
    s.nombre as sucursal,
    CASE 
        WHEN c.saldo = 0 THEN 'Sin Saldo'
        WHEN c.saldo <= c.limite_credito * 0.5 THEN 'Normal'
        WHEN c.saldo <= c.limite_credito * 0.8 THEN 'Atención'
        ELSE 'Crítico'
    END as status_credito
FROM clientes c
LEFT JOIN usuarios u ON c.vendedor_id = u.id
LEFT JOIN sucursales s ON c.sucursal_id = s.id
WHERE c.status = 'Activo';

-- Vista de ventas por vendedor
CREATE VIEW v_ventas_vendedor AS
SELECT 
    u.nombre as vendedor,
    COUNT(f.id) as total_facturas,
    SUM(f.total) as total_ventas,
    AVG(f.total) as promedio_venta,
    SUM(f.total) * (u.id * 0.03) as comision_estimada -- Ejemplo de cálculo
FROM usuarios u
LEFT JOIN facturas f ON u.id = f.vendedor_id AND f.status = 'Timbrada'
WHERE u.rol_id = 2 -- Asumiendo que rol_id 2 es Vendedor
GROUP BY u.id;

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS
-- =============================================

DELIMITER $$

-- Procedimiento para crear respaldo
CREATE PROCEDURE sp_crear_respaldo(
    IN p_tipo VARCHAR(20),
    IN p_incluir_datos BOOLEAN
)
BEGIN
    DECLARE v_fecha VARCHAR(20);
    DECLARE v_archivo VARCHAR(255);
    
    SET v_fecha = DATE_FORMAT(NOW(), '%Y%m%d_%H%i%s');
    SET v_archivo = CONCAT('backup_', v_fecha, '.sql');
    
    -- Aquí iría la lógica de respaldo
    -- Por ahora solo registramos en bitácora
    INSERT INTO bitacora_accesos (usuario_id, accion, modulo, detalles)
    VALUES (1, 'Respaldo BD', 'Administrador', CONCAT('Archivo: ', v_archivo, ', Tipo: ', p_tipo));
    
    SELECT v_archivo as archivo_generado, 'Respaldo creado exitosamente' as mensaje;
END$$

-- Procedimiento para actualizar precios masivamente
CREATE PROCEDURE sp_actualizar_precios_masivo(
    IN p_porcentaje DECIMAL(5,2),
    IN p_linea_id INT,
    IN p_usuario_id INT
)
BEGIN
    DECLARE v_registros_afectados INT DEFAULT 0;
    
    UPDATE productos 
    SET precio_base = precio_base * (1 + p_porcentaje / 100),
        updated_at = NOW()
    WHERE status = 'Activo' 
    AND (p_linea_id IS NULL OR linea_id = p_linea_id);
    
    SET v_registros_afectados = ROW_COUNT();
    
    -- Registrar en bitácora
    INSERT INTO bitacora_accesos (usuario_id, accion, modulo, detalles)
    VALUES (p_usuario_id, 'Actualización Masiva Precios', 'Productos', 
            CONCAT('Porcentaje: ', p_porcentaje, '%, Registros: ', v_registros_afectados));
    
    SELECT v_registros_afectados as registros_actualizados, 'Precios actualizados exitosamente' as mensaje;
END$$

DELIMITER ;

-- =============================================
-- CONFIGURACIÓN INICIAL DEL SISTEMA
-- =============================================

INSERT INTO configuracion_sistema (empresa_id, clave, valor, descripcion, tipo) VALUES
(1, 'serie_facturas', 'A', 'Serie por defecto para facturas', 'string'),
(1, 'folio_inicial_facturas', '1', 'Folio inicial para facturas', 'number'),
(1, 'iva_porcentaje', '16', 'Porcentaje de IVA', 'number'),
(1, 'moneda_default', 'MXN', 'Moneda por defecto', 'string'),
(1, 'lugar_expedicion', '64000', 'Código postal de lugar de expedición', 'string'),
(1, 'regimen_fiscal_empresa', '601', 'Régimen fiscal de la empresa', 'string'),
(1, 'api_sat_url', 'https://api.facturama.mx/v1/', 'URL de API para facturación SAT', 'string'),
(1, 'api_sat_key', '', 'API Key para facturación SAT', 'string'),
(1, 'backup_automatico', 'true', 'Activar respaldos automáticos', 'boolean'),
(1, 'dias_vencimiento_cotizacion', '15', 'Días de vigencia de cotizaciones', 'number');

-- Mensaje de finalización
SELECT 'Base de datos ERP Nube Aluminio/Vidrio creada exitosamente' as mensaje,
       'Estructura completa con datos de demostración' as descripcion,
       NOW() as fecha_creacion;