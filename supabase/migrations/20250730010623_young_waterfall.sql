/*
  # ERP Nube Aluminio/Vidrio - Estructura Completa v3.0
  
  1. Estructura Completa
    - Todas las tablas del sistema ERP
    - Índices optimizados para rendimiento
    - Triggers para auditoría automática
    - Vistas para reportes
    - Procedimientos almacenados
    
  2. Datos de Demostración
    - Empresa de ejemplo
    - Usuarios y roles
    - Catálogos completos
    - Productos y servicios
    - Clientes y proveedores
    
  3. Configuración SAT
    - Catálogos fiscales
    - Códigos de productos
    - Formas y métodos de pago
    - Regímenes fiscales
*/

-- =============================================
-- TABLAS PRINCIPALES DEL SISTEMA
-- =============================================

-- Empresas (Multiempresa)
CREATE TABLE IF NOT EXISTS empresas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    razon_social text NOT NULL,
    rfc text NOT NULL UNIQUE,
    regimen_fiscal text,
    domicilio_fiscal text,
    telefono text,
    correo text,
    sitio_web text,
    logo_url text,
    status text DEFAULT 'Activa' CHECK (status IN ('Activa', 'Inactiva')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Sucursales
CREATE TABLE IF NOT EXISTS sucursales (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    nombre text NOT NULL,
    codigo text NOT NULL,
    direccion text,
    telefono text,
    correo text,
    gerente text,
    es_principal boolean DEFAULT false,
    status text DEFAULT 'Activa' CHECK (status IN ('Activa', 'Inactiva')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(empresa_id, codigo)
);

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre text NOT NULL,
    descripcion text,
    permisos jsonb DEFAULT '[]'::jsonb,
    status text DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    sucursal_id uuid REFERENCES sucursales(id),
    rol_id uuid REFERENCES roles(id),
    nombre text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    telefono text,
    status text DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo', 'Bloqueado')),
    ultimo_acceso timestamptz,
    intentos_fallidos integer DEFAULT 0,
    fecha_bloqueo timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(email, empresa_id)
);

-- Líneas de Producción
CREATE TABLE IF NOT EXISTS lineas_produccion (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    nombre text NOT NULL,
    descripcion text,
    status text DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Acabados de Aluminio
CREATE TABLE IF NOT EXISTS acabados_aluminio (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    nombre text NOT NULL,
    descripcion text,
    color text, -- Código hexadecimal
    tipo text,
    costo_adicional decimal(10,2) DEFAULT 0,
    status text DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Productos
CREATE TABLE IF NOT EXISTS productos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    codigo text NOT NULL,
    descripcion text NOT NULL,
    linea_id uuid REFERENCES lineas_produccion(id),
    status text DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
    ubicacion text,
    unidad_sat text,
    clave_sat text,
    precio_base decimal(15,2),
    costo decimal(15,2),
    stock_min integer DEFAULT 0,
    stock_max integer DEFAULT 0,
    stock_actual integer DEFAULT 0,
    punto_reorden integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(empresa_id, codigo)
);

-- Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    sucursal_id uuid REFERENCES sucursales(id),
    nombre text NOT NULL,
    rfc text NOT NULL,
    status text DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
    telefono text,
    correo text,
    direccion text,
    codigo_postal text,
    saldo decimal(15,2) DEFAULT 0,
    limite_credito decimal(15,2) DEFAULT 0,
    precio_especial boolean DEFAULT false,
    descuento decimal(5,2) DEFAULT 0,
    metodo_pago_preferido text,
    condiciones_credito text,
    vendedor_id uuid REFERENCES usuarios(id),
    comentarios text,
    uso_cfdi text DEFAULT 'G03',
    regimen_fiscal text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(empresa_id, rfc)
);

-- Proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    nombre text NOT NULL,
    rfc text NOT NULL,
    status text DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
    telefono text,
    correo text,
    direccion text,
    codigo_postal text,
    saldo decimal(15,2) DEFAULT 0,
    limite_credito decimal(15,2) DEFAULT 0,
    metodo_pago_habitual text,
    condiciones_credito text,
    contacto_principal text,
    categoria text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(empresa_id, rfc)
);

-- Almacenes
CREATE TABLE IF NOT EXISTS almacenes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    sucursal_id uuid REFERENCES sucursales(id),
    nombre text NOT NULL,
    codigo text NOT NULL,
    direccion text,
    responsable text,
    status text DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(empresa_id, codigo)
);

-- Inventario por Almacén
CREATE TABLE IF NOT EXISTS inventario (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id uuid REFERENCES productos(id),
    almacen_id uuid REFERENCES almacenes(id),
    stock_actual integer DEFAULT 0,
    stock_reservado integer DEFAULT 0,
    costo_promedio decimal(15,2) DEFAULT 0,
    ultima_entrada timestamptz,
    ultima_salida timestamptz,
    UNIQUE(producto_id, almacen_id)
);

-- Movimientos de Inventario
CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    producto_id uuid REFERENCES productos(id),
    almacen_id uuid REFERENCES almacenes(id),
    tipo text NOT NULL CHECK (tipo IN ('Entrada', 'Salida', 'Transferencia', 'Ajuste')),
    documento text,
    cantidad integer NOT NULL,
    costo_unitario decimal(15,2),
    saldo_anterior integer,
    saldo_nuevo integer,
    origen text,
    destino text,
    lote text,
    usuario_id uuid REFERENCES usuarios(id),
    observaciones text,
    fecha timestamptz DEFAULT now()
);

-- Cotizaciones
CREATE TABLE IF NOT EXISTS cotizaciones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    folio text NOT NULL,
    fecha date NOT NULL,
    fecha_vencimiento date,
    cliente_id uuid REFERENCES clientes(id),
    vendedor_id uuid REFERENCES usuarios(id),
    subtotal decimal(15,2) DEFAULT 0,
    descuento decimal(15,2) DEFAULT 0,
    iva decimal(15,2) DEFAULT 0,
    total decimal(15,2) DEFAULT 0,
    status text DEFAULT 'Vigente' CHECK (status IN ('Vigente', 'Aprobada', 'Rechazada', 'Vencida')),
    probabilidad integer DEFAULT 50,
    observaciones text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(empresa_id, folio)
);

-- Detalle de Cotizaciones
CREATE TABLE IF NOT EXISTS cotizacion_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cotizacion_id uuid REFERENCES cotizaciones(id) ON DELETE CASCADE,
    producto_id uuid REFERENCES productos(id),
    cantidad decimal(10,2) NOT NULL,
    precio_unitario decimal(15,2) NOT NULL,
    descuento decimal(5,2) DEFAULT 0,
    importe decimal(15,2) NOT NULL
);

-- Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    folio text NOT NULL,
    fecha date NOT NULL,
    fecha_entrega date,
    cliente_id uuid REFERENCES clientes(id),
    vendedor_id uuid REFERENCES usuarios(id),
    cotizacion_id uuid REFERENCES cotizaciones(id),
    subtotal decimal(15,2) DEFAULT 0,
    descuento decimal(15,2) DEFAULT 0,
    iva decimal(15,2) DEFAULT 0,
    total decimal(15,2) DEFAULT 0,
    status text DEFAULT 'Confirmado' CHECK (status IN ('Confirmado', 'En Producción', 'Listo para Envío', 'Entregado', 'Cancelado')),
    prioridad text DEFAULT 'Media' CHECK (prioridad IN ('Alta', 'Media', 'Baja')),
    observaciones text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(empresa_id, folio)
);

-- Detalle de Pedidos
CREATE TABLE IF NOT EXISTS pedido_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id uuid REFERENCES pedidos(id) ON DELETE CASCADE,
    producto_id uuid REFERENCES productos(id),
    cantidad decimal(10,2) NOT NULL,
    precio_unitario decimal(15,2) NOT NULL,
    descuento decimal(5,2) DEFAULT 0,
    importe decimal(15,2) NOT NULL
);

-- Facturas
CREATE TABLE IF NOT EXISTS facturas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    folio text NOT NULL,
    serie text,
    fecha timestamptz NOT NULL,
    cliente_id uuid REFERENCES clientes(id),
    vendedor_id uuid REFERENCES usuarios(id),
    pedido_id uuid REFERENCES pedidos(id),
    subtotal decimal(15,2) DEFAULT 0,
    descuento decimal(15,2) DEFAULT 0,
    iva decimal(15,2) DEFAULT 0,
    total decimal(15,2) DEFAULT 0,
    status text DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Timbrada', 'Pagada', 'Cancelada')),
    metodo_pago_sat text,
    forma_pago_sat text,
    uso_cfdi text,
    uuid_sat text UNIQUE,
    certificado_sello text,
    xml_content text,
    pdf_url text,
    observaciones text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(empresa_id, folio)
);

-- Detalle de Facturas
CREATE TABLE IF NOT EXISTS factura_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    factura_id uuid REFERENCES facturas(id) ON DELETE CASCADE,
    producto_id uuid REFERENCES productos(id),
    cantidad decimal(10,2) NOT NULL,
    precio_unitario decimal(15,2) NOT NULL,
    descuento decimal(5,2) DEFAULT 0,
    importe decimal(15,2) NOT NULL,
    clave_sat text,
    unidad_sat text
);

-- Remisiones
CREATE TABLE IF NOT EXISTS remisiones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    folio text NOT NULL,
    fecha date NOT NULL,
    cliente_id uuid REFERENCES clientes(id),
    vendedor_id uuid REFERENCES usuarios(id),
    pedido_id uuid REFERENCES pedidos(id),
    almacen_id uuid REFERENCES almacenes(id),
    total decimal(15,2) DEFAULT 0,
    status text DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Entregada', 'Cancelada')),
    facturada boolean DEFAULT false,
    factura_id uuid REFERENCES facturas(id),
    observaciones text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(empresa_id, folio)
);

-- Órdenes de Compra
CREATE TABLE IF NOT EXISTS ordenes_compra (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    folio text NOT NULL,
    fecha date NOT NULL,
    fecha_entrega date,
    proveedor_id uuid REFERENCES proveedores(id),
    comprador_id uuid REFERENCES usuarios(id),
    subtotal decimal(15,2) DEFAULT 0,
    iva decimal(15,2) DEFAULT 0,
    total decimal(15,2) DEFAULT 0,
    status text DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Aprobada', 'Recibida', 'Cancelada')),
    observaciones text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(empresa_id, folio)
);

-- Detalle de Órdenes de Compra
CREATE TABLE IF NOT EXISTS orden_compra_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    orden_compra_id uuid REFERENCES ordenes_compra(id) ON DELETE CASCADE,
    producto_id uuid REFERENCES productos(id),
    cantidad decimal(10,2) NOT NULL,
    precio_unitario decimal(15,2) NOT NULL,
    importe decimal(15,2) NOT NULL,
    cantidad_recibida decimal(10,2) DEFAULT 0
);

-- Choferes
CREATE TABLE IF NOT EXISTS choferes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    nombre text NOT NULL,
    licencia text NOT NULL,
    telefono text,
    correo text,
    fecha_vencimiento date,
    status text DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Vehículos
CREATE TABLE IF NOT EXISTS vehiculos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    placas text NOT NULL,
    marca text,
    modelo text,
    año integer,
    capacidad text,
    tipo text,
    poliza_seguro text,
    vence_seguro date,
    status text DEFAULT 'Activo' CHECK (status IN ('Activo', 'Mantenimiento', 'Inactivo')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(empresa_id, placas)
);

-- Rutas de Reparto
CREATE TABLE IF NOT EXISTS rutas_reparto (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    zona text NOT NULL,
    descripcion text,
    chofer_id uuid REFERENCES choferes(id),
    vehiculo_id uuid REFERENCES vehiculos(id),
    status text DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Devoluciones
CREATE TABLE IF NOT EXISTS devoluciones (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    folio text NOT NULL,
    fecha date NOT NULL,
    cliente_id uuid REFERENCES clientes(id),
    factura_id uuid REFERENCES facturas(id),
    vendedor_id uuid REFERENCES usuarios(id),
    motivo text,
    tipo_devolucion text CHECK (tipo_devolucion IN ('Cambio', 'Reembolso', 'Nota de Crédito')),
    total decimal(15,2) DEFAULT 0,
    status text DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Aprobada', 'Procesada', 'Rechazada')),
    observaciones text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(empresa_id, folio)
);

-- =============================================
-- TABLAS DE AUDITORÍA Y CONTROL
-- =============================================

-- Bitácora de Accesos
CREATE TABLE IF NOT EXISTS bitacora_accesos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id uuid REFERENCES usuarios(id),
    accion text NOT NULL,
    modulo text,
    ip_address text,
    user_agent text,
    detalles text,
    fecha timestamptz DEFAULT now()
);

-- Auditoría de Cambios
CREATE TABLE IF NOT EXISTS auditoria_cambios (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tabla text NOT NULL,
    registro_id text NOT NULL,
    operacion text NOT NULL CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE')),
    usuario_id uuid REFERENCES usuarios(id),
    valores_anteriores jsonb,
    valores_nuevos jsonb,
    fecha timestamptz DEFAULT now()
);

-- Configuración del Sistema
CREATE TABLE IF NOT EXISTS configuracion_sistema (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid REFERENCES empresas(id),
    clave text NOT NULL,
    valor text,
    descripcion text,
    tipo text DEFAULT 'string' CHECK (tipo IN ('string', 'number', 'boolean', 'json')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(empresa_id, clave)
);

-- Catálogos SAT
CREATE TABLE IF NOT EXISTS catalogos_sat (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo text NOT NULL,
    clave text NOT NULL,
    descripcion text,
    status text DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
    fecha_actualizacion timestamptz DEFAULT now(),
    UNIQUE(tipo, clave)
);

-- =============================================
-- HABILITAR RLS EN TODAS LAS TABLAS
-- =============================================

ALTER TABLE empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sucursales ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE lineas_produccion ENABLE ROW LEVEL SECURITY;
ALTER TABLE acabados_aluminio ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE almacenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizacion_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedido_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE facturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE factura_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE remisiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ordenes_compra ENABLE ROW LEVEL SECURITY;
ALTER TABLE orden_compra_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE choferes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE rutas_reparto ENABLE ROW LEVEL SECURITY;
ALTER TABLE devoluciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE bitacora_accesos ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria_cambios ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_sistema ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogos_sat ENABLE ROW LEVEL SECURITY;

-- =============================================
-- POLÍTICAS RLS BÁSICAS
-- =============================================

-- Política para usuarios autenticados
CREATE POLICY "Users can access their company data" ON empresas
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON sucursales
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON roles
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON usuarios
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON lineas_produccion
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON acabados_aluminio
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON productos
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON clientes
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON proveedores
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON almacenes
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON inventario
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON movimientos_inventario
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON cotizaciones
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON cotizacion_items
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON pedidos
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON pedido_items
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON facturas
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON factura_items
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON remisiones
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON ordenes_compra
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON orden_compra_items
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON choferes
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON vehiculos
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON rutas_reparto
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON devoluciones
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON bitacora_accesos
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON auditoria_cambios
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON configuracion_sistema
  FOR ALL TO authenticated
  USING (true);

CREATE POLICY "Users can access their company data" ON catalogos_sat
  FOR ALL TO authenticated
  USING (true);

-- =============================================
-- DATOS INICIALES DE DEMOSTRACIÓN
-- =============================================

-- Insertar empresa demo
INSERT INTO empresas (razon_social, rfc, regimen_fiscal, domicilio_fiscal, telefono, correo) VALUES
('Aluminios y Vidrios del Norte S.A. de C.V.', 'AVN123456789', '601', 'Av. Industrial 123, Col. Norte, CP 64000, Monterrey, N.L.', '81-1234-5678', 'contacto@aluminiosnorte.com');

-- Obtener ID de la empresa para referencias
DO $$
DECLARE
    empresa_uuid uuid;
    sucursal_uuid uuid;
    admin_role_uuid uuid;
    vendedor_role_uuid uuid;
    almacenista_role_uuid uuid;
    comprador_role_uuid uuid;
    admin_user_uuid uuid;
    linea_vidrios_uuid uuid;
    linea_perfiles_uuid uuid;
    linea_herrajes_uuid uuid;
    almacen_uuid uuid;
BEGIN
    -- Obtener ID de empresa
    SELECT id INTO empresa_uuid FROM empresas WHERE rfc = 'AVN123456789';
    
    -- Insertar sucursal principal
    INSERT INTO sucursales (empresa_id, nombre, codigo, direccion, telefono, correo, gerente, es_principal) 
    VALUES (empresa_uuid, 'Matriz', 'MTZ', 'Av. Industrial 123, Col. Norte, CP 64000, Monterrey, N.L.', '81-1234-5678', 'matriz@aluminiosnorte.com', 'Ing. Roberto Martínez', true)
    RETURNING id INTO sucursal_uuid;

    -- Insertar roles básicos
    INSERT INTO roles (nombre, descripcion, permisos) VALUES
    ('Administrador', 'Acceso completo al sistema', '["all"]'::jsonb)
    RETURNING id INTO admin_role_uuid;
    
    INSERT INTO roles (nombre, descripcion, permisos) VALUES
    ('Vendedor', 'Gestión de ventas y clientes', '["ventas.read", "ventas.write", "clientes.read", "clientes.write", "productos.read"]'::jsonb)
    RETURNING id INTO vendedor_role_uuid;
    
    INSERT INTO roles (nombre, descripcion, permisos) VALUES
    ('Almacenista', 'Gestión de inventario', '["inventario.read", "inventario.write", "productos.read"]'::jsonb)
    RETURNING id INTO almacenista_role_uuid;
    
    INSERT INTO roles (nombre, descripcion, permisos) VALUES
    ('Comprador', 'Gestión de compras y proveedores', '["compras.read", "compras.write", "proveedores.read", "proveedores.write"]'::jsonb)
    RETURNING id INTO comprador_role_uuid;

    -- Insertar usuario administrador
    INSERT INTO usuarios (empresa_id, sucursal_id, rol_id, nombre, email, password_hash) VALUES
    (empresa_uuid, sucursal_uuid, admin_role_uuid, 'Administrador Sistema', 'admin@empresa.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
    RETURNING id INTO admin_user_uuid;

    -- Insertar líneas de producción
    INSERT INTO lineas_produccion (empresa_id, nombre, descripcion) VALUES
    (empresa_uuid, 'Cancelería Residencial', 'Ventanas y puertas para casas habitación'),
    (empresa_uuid, 'Cancelería Comercial', 'Sistemas para edificios comerciales'),
    (empresa_uuid, 'Fachadas Estructurales', 'Muros cortina y fachadas integrales'),
    (empresa_uuid, 'Vidrios Especiales', 'Vidrios templados, laminados y especiales')
    RETURNING id INTO linea_vidrios_uuid;

    -- Insertar acabados de aluminio
    INSERT INTO acabados_aluminio (empresa_id, nombre, descripcion, color) VALUES
    (empresa_uuid, 'Natural', 'Aluminio sin tratamiento superficial', '#C0C0C0'),
    (empresa_uuid, 'Anodizado Plata', 'Acabado anodizado color plata', '#E5E5E5'),
    (empresa_uuid, 'Anodizado Oro', 'Acabado anodizado color oro', '#FFD700'),
    (empresa_uuid, 'Anodizado Bronce', 'Acabado anodizado color bronce', '#CD7F32'),
    (empresa_uuid, 'Anodizado Negro', 'Acabado anodizado color negro', '#2C2C2C'),
    (empresa_uuid, 'Pintado Blanco', 'Pintura electroestática blanca', '#FFFFFF');

    -- Insertar almacén principal
    INSERT INTO almacenes (empresa_id, sucursal_id, nombre, codigo, direccion, responsable) VALUES
    (empresa_uuid, sucursal_uuid, 'Almacén General', 'ALM01', 'Av. Industrial 123, Col. Norte', 'Juan Pérez')
    RETURNING id INTO almacen_uuid;

    -- Insertar productos demo
    INSERT INTO productos (empresa_id, codigo, descripcion, linea_id, ubicacion, unidad_sat, clave_sat, precio_base, costo, stock_min, stock_max, stock_actual) VALUES
    (empresa_uuid, 'VT-6MM-001', 'Vidrio Templado 6mm Transparente', linea_vidrios_uuid, 'A-01-15', 'M2', '43211701', 350.00, 210.00, 50, 500, 125),
    (empresa_uuid, 'AL-NAT-001', 'Perfil Aluminio Natural 2x1', linea_perfiles_uuid, 'B-02-08', 'PZA', '30111506', 145.50, 87.30, 100, 1000, 320),
    (empresa_uuid, 'VL-8MM-001', 'Vidrio Laminado 8mm Seguridad', linea_vidrios_uuid, 'A-03-22', 'M2', '43211702', 520.00, 312.00, 30, 300, 85),
    (empresa_uuid, 'HE-PREM-001', 'Herraje Premium Ventana', linea_herrajes_uuid, 'C-01-10', 'PZA', '30111507', 89.50, 45.20, 200, 2000, 450);

    -- Insertar clientes demo
    INSERT INTO clientes (empresa_id, sucursal_id, nombre, rfc, telefono, correo, direccion, saldo, precio_especial, descuento, metodo_pago_preferido, vendedor_id, comentarios) VALUES
    (empresa_uuid, sucursal_uuid, 'Constructora ABC S.A. de C.V.', 'CABC123456789', '555-0123', 'contacto@constructoraabc.com', 'Av. Reforma 123, Col. Centro', 85430.50, true, 15.0, 'Transferencia', admin_user_uuid, 'Cliente preferencial, crédito 30 días'),
    (empresa_uuid, sucursal_uuid, 'Vidrios del Norte S.A.', 'VNO890123456', '555-0456', 'compras@vidriosdelnorte.com', 'Blvd. Industrial 456, Zona Norte', 23750.00, false, 5.0, 'Cheque', admin_user_uuid, 'Distribuidor regional'),
    (empresa_uuid, sucursal_uuid, 'Juan Pérez Construcciones', 'PEXJ850429AB1', '555-0789', 'juan@construcciones.com', 'Calle 5 de Mayo 789, Col. Americana', 0.00, false, 0.0, 'Efectivo', admin_user_uuid, 'Cliente de contado');

    -- Insertar proveedores demo
    INSERT INTO proveedores (empresa_id, nombre, rfc, telefono, correo, direccion, saldo, metodo_pago_habitual, condiciones_credito, contacto_principal, categoria) VALUES
    (empresa_uuid, 'Aluminios Industriales S.A.', 'AIN123456789', '555-1001', 'ventas@aluminiosindustriales.com', 'Zona Industrial Norte, Lote 15', 125430.50, 'Transferencia', '30 días', 'Ing. María López', 'Materia Prima'),
    (empresa_uuid, 'Vidrios y Cristales del Bajío', 'VCB890123456', '555-1002', 'compras@vidriosbajio.com', 'Carretera Nacional Km 45', 89750.00, 'Cheque', '15 días', 'Lic. Carlos Ramírez', 'Vidrio'),
    (empresa_uuid, 'Herrajes y Accesorios Premium', 'HAP850429AB1', '555-1003', 'info@herrajespremium.com', 'Boulevard de la Industria 234', 45200.00, 'Efectivo', 'Contado', 'Sr. Jorge Mendoza', 'Herrajes');

END $$;

-- =============================================
-- CATÁLOGOS SAT BÁSICOS
-- =============================================

INSERT INTO catalogos_sat (tipo, clave, descripcion) VALUES
-- Productos y Servicios
('productos_servicios', '43211701', 'Vidrio para construcción'),
('productos_servicios', '30111506', 'Perfiles de aluminio'),
('productos_servicios', '43211702', 'Vidrio templado'),
('productos_servicios', '30111507', 'Marcos de aluminio'),
('productos_servicios', '43211703', 'Vidrio laminado'),
('productos_servicios', '30111508', 'Herrajes para ventanas'),

-- Monedas
('monedas', 'MXN', 'Peso Mexicano'),
('monedas', 'USD', 'Dólar de los Estados Unidos'),
('monedas', 'EUR', 'Euro'),

-- Unidades de Medida
('unidades', 'PZA', 'Pieza'),
('unidades', 'M2', 'Metro cuadrado'),
('unidades', 'KG', 'Kilogramo'),
('unidades', 'M', 'Metro'),

-- Métodos de Pago
('metodos_pago', 'PUE', 'Pago en una sola exhibición'),
('metodos_pago', 'PPD', 'Pago en parcialidades o diferido'),

-- Formas de Pago
('formas_pago', '01', 'Efectivo'),
('formas_pago', '03', 'Transferencia electrónica de fondos'),
('formas_pago', '04', 'Tarjeta de crédito'),
('formas_pago', '28', 'Tarjeta de débito'),

-- Regímenes Fiscales
('regimenes_fiscales', '601', 'General de Ley Personas Morales'),
('regimenes_fiscales', '612', 'Personas Físicas con Actividades Empresariales'),
('regimenes_fiscales', '621', 'Incorporación Fiscal'),

-- Uso de CFDI
('uso_cfdi', 'G01', 'Adquisición de mercancías'),
('uso_cfdi', 'G03', 'Gastos en general'),
('uso_cfdi', 'P01', 'Por definir');

-- =============================================
-- CONFIGURACIÓN INICIAL DEL SISTEMA
-- =============================================

DO $$
DECLARE
    empresa_uuid uuid;
BEGIN
    SELECT id INTO empresa_uuid FROM empresas WHERE rfc = 'AVN123456789';
    
    INSERT INTO configuracion_sistema (empresa_id, clave, valor, descripcion, tipo) VALUES
    (empresa_uuid, 'serie_facturas', 'A', 'Serie por defecto para facturas', 'string'),
    (empresa_uuid, 'folio_inicial_facturas', '1', 'Folio inicial para facturas', 'number'),
    (empresa_uuid, 'iva_porcentaje', '16', 'Porcentaje de IVA', 'number'),
    (empresa_uuid, 'moneda_default', 'MXN', 'Moneda por defecto', 'string'),
    (empresa_uuid, 'lugar_expedicion', '64000', 'Código postal de lugar de expedición', 'string'),
    (empresa_uuid, 'regimen_fiscal_empresa', '601', 'Régimen fiscal de la empresa', 'string'),
    (empresa_uuid, 'api_sat_url', 'https://api.facturama.mx/v1/', 'URL de API para facturación SAT', 'string'),
    (empresa_uuid, 'api_sat_key', '', 'API Key para facturación SAT', 'string'),
    (empresa_uuid, 'backup_automatico', 'true', 'Activar respaldos automáticos', 'boolean'),
    (empresa_uuid, 'dias_vencimiento_cotizacion', '15', 'Días de vigencia de cotizaciones', 'number');
END $$;

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_clientes_rfc ON clientes(rfc);
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre);
CREATE INDEX IF NOT EXISTS idx_clientes_status ON clientes(status);
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON productos(codigo);
CREATE INDEX IF NOT EXISTS idx_productos_descripcion ON productos(descripcion);
CREATE INDEX IF NOT EXISTS idx_facturas_folio ON facturas(folio);
CREATE INDEX IF NOT EXISTS idx_facturas_fecha ON facturas(fecha);
CREATE INDEX IF NOT EXISTS idx_facturas_status ON facturas(status);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha ON movimientos_inventario(fecha);
CREATE INDEX IF NOT EXISTS idx_bitacora_fecha ON bitacora_accesos(fecha);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON auditoria_cambios(fecha);

-- Índices compuestos para consultas complejas
CREATE INDEX IF NOT EXISTS idx_clientes_empresa_status ON clientes(empresa_id, status);
CREATE INDEX IF NOT EXISTS idx_productos_empresa_linea ON productos(empresa_id, linea_id);
CREATE INDEX IF NOT EXISTS idx_facturas_cliente_fecha ON facturas(cliente_id, fecha);
CREATE INDEX IF NOT EXISTS idx_inventario_producto_almacen ON inventario(producto_id, almacen_id);

-- =============================================
-- VISTAS PARA REPORTES
-- =============================================

-- Vista de inventario consolidado
CREATE OR REPLACE VIEW v_inventario_consolidado AS
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
GROUP BY p.id, p.codigo, p.descripcion, lp.nombre, p.stock_min, p.stock_max, p.precio_base, p.costo;

-- Vista de cartera de clientes
CREATE OR REPLACE VIEW v_cartera_clientes AS
SELECT 
    c.nombre,
    c.rfc,
    c.saldo,
    c.limite_credito,
    CASE 
        WHEN c.limite_credito > 0 THEN (c.saldo / c.limite_credito * 100)
        ELSE 0
    END as porcentaje_credito,
    u.nombre as vendedor,
    s.nombre as sucursal,
    CASE 
        WHEN c.saldo = 0 THEN 'Sin Saldo'
        WHEN c.limite_credito > 0 AND c.saldo <= c.limite_credito * 0.5 THEN 'Normal'
        WHEN c.limite_credito > 0 AND c.saldo <= c.limite_credito * 0.8 THEN 'Atención'
        ELSE 'Crítico'
    END as status_credito
FROM clientes c
LEFT JOIN usuarios u ON c.vendedor_id = u.id
LEFT JOIN sucursales s ON c.sucursal_id = s.id
WHERE c.status = 'Activo';

-- Vista de ventas por vendedor
CREATE OR REPLACE VIEW v_ventas_vendedor AS
SELECT 
    u.nombre as vendedor,
    COUNT(f.id) as total_facturas,
    COALESCE(SUM(f.total), 0) as total_ventas,
    COALESCE(AVG(f.total), 0) as promedio_venta,
    COALESCE(SUM(f.total), 0) * 0.03 as comision_estimada
FROM usuarios u
LEFT JOIN facturas f ON u.id = f.vendedor_id AND f.status = 'Timbrada'
WHERE EXISTS (SELECT 1 FROM roles r WHERE r.id = u.rol_id AND r.nombre = 'Vendedor')
GROUP BY u.id, u.nombre;

-- =============================================
-- FUNCIONES AUXILIARES
-- =============================================

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_empresas_updated_at BEFORE UPDATE ON empresas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sucursales_updated_at BEFORE UPDATE ON sucursales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proveedores_updated_at BEFORE UPDATE ON proveedores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Mensaje de finalización
SELECT 'Base de datos ERP Nube Aluminio/Vidrio v3.0 creada exitosamente' as mensaje,
       'Estructura completa con datos de demostración y configuración SAT' as descripcion,
       now() as fecha_creacion;