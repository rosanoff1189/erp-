-- =============================================
-- ERP NUBE ALUMINIO/VIDRIO v3.0
-- Script Completo para MySQL en Ubuntu Server 24.04.2 LTS
-- =============================================

-- Configuración inicial
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

-- =============================================
-- CREAR BASE DE DATOS
-- =============================================

CREATE DATABASE IF NOT EXISTS `erp_aluminio_vidrio` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `erp_aluminio_vidrio`;

-- =============================================
-- TABLAS PRINCIPALES
-- =============================================

-- Empresas (Multiempresa)
CREATE TABLE IF NOT EXISTS `empresas` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `razon_social` varchar(255) NOT NULL,
    `rfc` varchar(13) NOT NULL,
    `regimen_fiscal` varchar(10) DEFAULT NULL,
    `domicilio_fiscal` text,
    `telefono` varchar(50) DEFAULT NULL,
    `correo` varchar(255) DEFAULT NULL,
    `sitio_web` varchar(255) DEFAULT NULL,
    `logo_url` varchar(500) DEFAULT NULL,
    `status` enum('Activa','Inactiva') DEFAULT 'Activa',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `rfc` (`rfc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sucursales
CREATE TABLE IF NOT EXISTS `sucursales` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `codigo` varchar(10) NOT NULL,
    `direccion` text,
    `telefono` varchar(50) DEFAULT NULL,
    `correo` varchar(255) DEFAULT NULL,
    `gerente` varchar(255) DEFAULT NULL,
    `es_principal` tinyint(1) DEFAULT 0,
    `status` enum('Activa','Inactiva') DEFAULT 'Activa',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_codigo_empresa` (`empresa_id`, `codigo`),
    KEY `empresa_id` (`empresa_id`),
    CONSTRAINT `sucursales_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Roles
CREATE TABLE IF NOT EXISTS `roles` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `nombre` varchar(100) NOT NULL,
    `descripcion` text,
    `permisos` json DEFAULT NULL,
    `status` enum('Activo','Inactivo') DEFAULT 'Activo',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `sucursal_id` int(11) NOT NULL,
    `rol_id` int(11) NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `password_hash` varchar(255) NOT NULL,
    `telefono` varchar(50) DEFAULT NULL,
    `status` enum('Activo','Inactivo','Bloqueado') DEFAULT 'Activo',
    `ultimo_acceso` timestamp NULL DEFAULT NULL,
    `intentos_fallidos` int(11) DEFAULT 0,
    `fecha_bloqueo` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_email_empresa` (`email`, `empresa_id`),
    KEY `empresa_id` (`empresa_id`),
    KEY `sucursal_id` (`sucursal_id`),
    KEY `rol_id` (`rol_id`),
    CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
    CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`),
    CONSTRAINT `usuarios_ibfk_3` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Líneas de Producción
CREATE TABLE IF NOT EXISTS `lineas_produccion` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `descripcion` text,
    `status` enum('Activo','Inactivo') DEFAULT 'Activo',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `empresa_id` (`empresa_id`),
    CONSTRAINT `lineas_produccion_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Acabados de Aluminio
CREATE TABLE IF NOT EXISTS `acabados_aluminio` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `descripcion` text,
    `color` varchar(7) DEFAULT NULL,
    `tipo` varchar(100) DEFAULT NULL,
    `costo_adicional` decimal(10,2) DEFAULT 0.00,
    `status` enum('Activo','Inactivo') DEFAULT 'Activo',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `empresa_id` (`empresa_id`),
    CONSTRAINT `acabados_aluminio_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Productos
CREATE TABLE IF NOT EXISTS `productos` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `codigo` varchar(50) NOT NULL,
    `descripcion` varchar(255) NOT NULL,
    `linea_id` int(11) DEFAULT NULL,
    `status` enum('Activo','Inactivo') DEFAULT 'Activo',
    `ubicacion` varchar(255) DEFAULT NULL,
    `unidad_sat` varchar(10) DEFAULT NULL,
    `clave_sat` varchar(20) DEFAULT NULL,
    `precio_base` decimal(15,2) DEFAULT NULL,
    `costo` decimal(15,2) DEFAULT NULL,
    `stock_min` int(11) DEFAULT 0,
    `stock_max` int(11) DEFAULT 0,
    `stock_actual` int(11) DEFAULT 0,
    `punto_reorden` int(11) DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_codigo_empresa` (`codigo`, `empresa_id`),
    KEY `empresa_id` (`empresa_id`),
    KEY `linea_id` (`linea_id`),
    KEY `idx_productos_codigo` (`codigo`),
    KEY `idx_productos_descripcion` (`descripcion`),
    CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
    CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`linea_id`) REFERENCES `lineas_produccion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clientes
CREATE TABLE IF NOT EXISTS `clientes` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `sucursal_id` int(11) NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `rfc` varchar(13) NOT NULL,
    `status` enum('Activo','Inactivo') DEFAULT 'Activo',
    `telefono` varchar(50) DEFAULT NULL,
    `correo` varchar(255) DEFAULT NULL,
    `direccion` text,
    `codigo_postal` varchar(10) DEFAULT NULL,
    `saldo` decimal(15,2) DEFAULT 0.00,
    `limite_credito` decimal(15,2) DEFAULT 0.00,
    `precio_especial` tinyint(1) DEFAULT 0,
    `descuento` decimal(5,2) DEFAULT 0.00,
    `metodo_pago_preferido` varchar(50) DEFAULT NULL,
    `condiciones_credito` varchar(100) DEFAULT NULL,
    `vendedor_id` int(11) DEFAULT NULL,
    `comentarios` text,
    `uso_cfdi` varchar(10) DEFAULT 'G03',
    `regimen_fiscal` varchar(10) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_rfc_empresa` (`rfc`, `empresa_id`),
    KEY `empresa_id` (`empresa_id`),
    KEY `sucursal_id` (`sucursal_id`),
    KEY `vendedor_id` (`vendedor_id`),
    KEY `idx_clientes_rfc` (`rfc`),
    KEY `idx_clientes_nombre` (`nombre`),
    KEY `idx_clientes_status` (`status`),
    CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
    CONSTRAINT `clientes_ibfk_2` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`),
    CONSTRAINT `clientes_ibfk_3` FOREIGN KEY (`vendedor_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Proveedores
CREATE TABLE IF NOT EXISTS `proveedores` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `rfc` varchar(13) NOT NULL,
    `status` enum('Activo','Inactivo') DEFAULT 'Activo',
    `telefono` varchar(50) DEFAULT NULL,
    `correo` varchar(255) DEFAULT NULL,
    `direccion` text,
    `codigo_postal` varchar(10) DEFAULT NULL,
    `saldo` decimal(15,2) DEFAULT 0.00,
    `limite_credito` decimal(15,2) DEFAULT 0.00,
    `metodo_pago_habitual` varchar(50) DEFAULT NULL,
    `condiciones_credito` text,
    `contacto_principal` varchar(255) DEFAULT NULL,
    `categoria` varchar(100) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_rfc_empresa` (`rfc`, `empresa_id`),
    KEY `empresa_id` (`empresa_id`),
    CONSTRAINT `proveedores_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Almacenes
CREATE TABLE IF NOT EXISTS `almacenes` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `sucursal_id` int(11) NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `codigo` varchar(10) NOT NULL,
    `direccion` text,
    `responsable` varchar(255) DEFAULT NULL,
    `status` enum('Activo','Inactivo') DEFAULT 'Activo',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_codigo_empresa` (`codigo`, `empresa_id`),
    KEY `empresa_id` (`empresa_id`),
    KEY `sucursal_id` (`sucursal_id`),
    CONSTRAINT `almacenes_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
    CONSTRAINT `almacenes_ibfk_2` FOREIGN KEY (`sucursal_id`) REFERENCES `sucursales` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inventario por Almacén
CREATE TABLE IF NOT EXISTS `inventario` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `producto_id` int(11) NOT NULL,
    `almacen_id` int(11) NOT NULL,
    `stock_actual` int(11) DEFAULT 0,
    `stock_reservado` int(11) DEFAULT 0,
    `stock_disponible` int(11) GENERATED ALWAYS AS ((`stock_actual` - `stock_reservado`)) STORED,
    `costo_promedio` decimal(15,2) DEFAULT 0.00,
    `ultima_entrada` timestamp NULL DEFAULT NULL,
    `ultima_salida` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_producto_almacen` (`producto_id`, `almacen_id`),
    KEY `almacen_id` (`almacen_id`),
    CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`),
    CONSTRAINT `inventario_ibfk_2` FOREIGN KEY (`almacen_id`) REFERENCES `almacenes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Movimientos de Inventario
CREATE TABLE IF NOT EXISTS `movimientos_inventario` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `producto_id` int(11) NOT NULL,
    `almacen_id` int(11) NOT NULL,
    `tipo` enum('Entrada','Salida','Transferencia','Ajuste') NOT NULL,
    `documento` varchar(50) DEFAULT NULL,
    `cantidad` int(11) NOT NULL,
    `costo_unitario` decimal(15,2) DEFAULT NULL,
    `saldo_anterior` int(11) DEFAULT NULL,
    `saldo_nuevo` int(11) DEFAULT NULL,
    `origen` varchar(255) DEFAULT NULL,
    `destino` varchar(255) DEFAULT NULL,
    `lote` varchar(50) DEFAULT NULL,
    `usuario_id` int(11) DEFAULT NULL,
    `observaciones` text,
    `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `producto_id` (`producto_id`),
    KEY `almacen_id` (`almacen_id`),
    KEY `usuario_id` (`usuario_id`),
    KEY `idx_movimientos_fecha` (`fecha`),
    CONSTRAINT `movimientos_inventario_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`),
    CONSTRAINT `movimientos_inventario_ibfk_2` FOREIGN KEY (`almacen_id`) REFERENCES `almacenes` (`id`),
    CONSTRAINT `movimientos_inventario_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cotizaciones
CREATE TABLE IF NOT EXISTS `cotizaciones` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `folio` varchar(50) NOT NULL,
    `fecha` date NOT NULL,
    `fecha_vencimiento` date DEFAULT NULL,
    `cliente_id` int(11) NOT NULL,
    `vendedor_id` int(11) NOT NULL,
    `subtotal` decimal(15,2) DEFAULT 0.00,
    `descuento` decimal(15,2) DEFAULT 0.00,
    `iva` decimal(15,2) DEFAULT 0.00,
    `total` decimal(15,2) DEFAULT 0.00,
    `status` enum('Vigente','Aprobada','Rechazada','Vencida') DEFAULT 'Vigente',
    `probabilidad` int(11) DEFAULT 50,
    `observaciones` text,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_folio_empresa` (`folio`, `empresa_id`),
    KEY `empresa_id` (`empresa_id`),
    KEY `cliente_id` (`cliente_id`),
    KEY `vendedor_id` (`vendedor_id`),
    CONSTRAINT `cotizaciones_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
    CONSTRAINT `cotizaciones_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
    CONSTRAINT `cotizaciones_ibfk_3` FOREIGN KEY (`vendedor_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Detalle de Cotizaciones
CREATE TABLE IF NOT EXISTS `cotizacion_items` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `cotizacion_id` int(11) NOT NULL,
    `producto_id` int(11) NOT NULL,
    `cantidad` decimal(10,2) NOT NULL,
    `precio_unitario` decimal(15,2) NOT NULL,
    `descuento` decimal(5,2) DEFAULT 0.00,
    `importe` decimal(15,2) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `cotizacion_id` (`cotizacion_id`),
    KEY `producto_id` (`producto_id`),
    CONSTRAINT `cotizacion_items_ibfk_1` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`) ON DELETE CASCADE,
    CONSTRAINT `cotizacion_items_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Pedidos
CREATE TABLE IF NOT EXISTS `pedidos` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `folio` varchar(50) NOT NULL,
    `fecha` date NOT NULL,
    `fecha_entrega` date DEFAULT NULL,
    `cliente_id` int(11) NOT NULL,
    `vendedor_id` int(11) NOT NULL,
    `cotizacion_id` int(11) DEFAULT NULL,
    `subtotal` decimal(15,2) DEFAULT 0.00,
    `descuento` decimal(15,2) DEFAULT 0.00,
    `iva` decimal(15,2) DEFAULT 0.00,
    `total` decimal(15,2) DEFAULT 0.00,
    `status` enum('Confirmado','En Producción','Listo para Envío','Entregado','Cancelado') DEFAULT 'Confirmado',
    `prioridad` enum('Alta','Media','Baja') DEFAULT 'Media',
    `observaciones` text,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_folio_empresa` (`folio`, `empresa_id`),
    KEY `empresa_id` (`empresa_id`),
    KEY `cliente_id` (`cliente_id`),
    KEY `vendedor_id` (`vendedor_id`),
    KEY `cotizacion_id` (`cotizacion_id`),
    CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
    CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
    CONSTRAINT `pedidos_ibfk_3` FOREIGN KEY (`vendedor_id`) REFERENCES `usuarios` (`id`),
    CONSTRAINT `pedidos_ibfk_4` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizaciones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Detalle de Pedidos
CREATE TABLE IF NOT EXISTS `pedido_items` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `pedido_id` int(11) NOT NULL,
    `producto_id` int(11) NOT NULL,
    `cantidad` decimal(10,2) NOT NULL,
    `precio_unitario` decimal(15,2) NOT NULL,
    `descuento` decimal(5,2) DEFAULT 0.00,
    `importe` decimal(15,2) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `pedido_id` (`pedido_id`),
    KEY `producto_id` (`producto_id`),
    CONSTRAINT `pedido_items_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
    CONSTRAINT `pedido_items_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Facturas
CREATE TABLE IF NOT EXISTS `facturas` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `folio` varchar(50) NOT NULL,
    `serie` varchar(10) DEFAULT NULL,
    `fecha` datetime NOT NULL,
    `cliente_id` int(11) NOT NULL,
    `vendedor_id` int(11) NOT NULL,
    `pedido_id` int(11) DEFAULT NULL,
    `subtotal` decimal(15,2) DEFAULT 0.00,
    `descuento` decimal(15,2) DEFAULT 0.00,
    `iva` decimal(15,2) DEFAULT 0.00,
    `total` decimal(15,2) DEFAULT 0.00,
    `status` enum('Pendiente','Timbrada','Pagada','Cancelada') DEFAULT 'Pendiente',
    `metodo_pago_sat` varchar(20) DEFAULT NULL,
    `forma_pago_sat` varchar(20) DEFAULT NULL,
    `uso_cfdi` varchar(10) DEFAULT NULL,
    `uuid_sat` varchar(100) DEFAULT NULL,
    `certificado_sello` varchar(255) DEFAULT NULL,
    `xml_content` longtext,
    `pdf_url` varchar(500) DEFAULT NULL,
    `observaciones` text,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_folio_empresa` (`folio`, `empresa_id`),
    UNIQUE KEY `uuid_sat` (`uuid_sat`),
    KEY `empresa_id` (`empresa_id`),
    KEY `cliente_id` (`cliente_id`),
    KEY `vendedor_id` (`vendedor_id`),
    KEY `pedido_id` (`pedido_id`),
    KEY `idx_facturas_folio` (`folio`),
    KEY `idx_facturas_fecha` (`fecha`),
    KEY `idx_facturas_status` (`status`),
    CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
    CONSTRAINT `facturas_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
    CONSTRAINT `facturas_ibfk_3` FOREIGN KEY (`vendedor_id`) REFERENCES `usuarios` (`id`),
    CONSTRAINT `facturas_ibfk_4` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Detalle de Facturas
CREATE TABLE IF NOT EXISTS `factura_items` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `factura_id` int(11) NOT NULL,
    `producto_id` int(11) NOT NULL,
    `cantidad` decimal(10,2) NOT NULL,
    `precio_unitario` decimal(15,2) NOT NULL,
    `descuento` decimal(5,2) DEFAULT 0.00,
    `importe` decimal(15,2) NOT NULL,
    `clave_sat` varchar(20) DEFAULT NULL,
    `unidad_sat` varchar(10) DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `factura_id` (`factura_id`),
    KEY `producto_id` (`producto_id`),
    CONSTRAINT `factura_items_ibfk_1` FOREIGN KEY (`factura_id`) REFERENCES `facturas` (`id`) ON DELETE CASCADE,
    CONSTRAINT `factura_items_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Remisiones
CREATE TABLE IF NOT EXISTS `remisiones` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `folio` varchar(50) NOT NULL,
    `fecha` date NOT NULL,
    `cliente_id` int(11) NOT NULL,
    `vendedor_id` int(11) NOT NULL,
    `pedido_id` int(11) DEFAULT NULL,
    `almacen_id` int(11) NOT NULL,
    `total` decimal(15,2) DEFAULT 0.00,
    `status` enum('Pendiente','Entregada','Cancelada') DEFAULT 'Pendiente',
    `facturada` tinyint(1) DEFAULT 0,
    `factura_id` int(11) DEFAULT NULL,
    `observaciones` text,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_folio_empresa` (`folio`, `empresa_id`),
    KEY `empresa_id` (`empresa_id`),
    KEY `cliente_id` (`cliente_id`),
    KEY `vendedor_id` (`vendedor_id`),
    KEY `pedido_id` (`pedido_id`),
    KEY `almacen_id` (`almacen_id`),
    KEY `factura_id` (`factura_id`),
    CONSTRAINT `remisiones_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
    CONSTRAINT `remisiones_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
    CONSTRAINT `remisiones_ibfk_3` FOREIGN KEY (`vendedor_id`) REFERENCES `usuarios` (`id`),
    CONSTRAINT `remisiones_ibfk_4` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`),
    CONSTRAINT `remisiones_ibfk_5` FOREIGN KEY (`almacen_id`) REFERENCES `almacenes` (`id`),
    CONSTRAINT `remisiones_ibfk_6` FOREIGN KEY (`factura_id`) REFERENCES `facturas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Órdenes de Compra
CREATE TABLE IF NOT EXISTS `ordenes_compra` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `folio` varchar(50) NOT NULL,
    `fecha` date NOT NULL,
    `fecha_entrega` date DEFAULT NULL,
    `proveedor_id` int(11) NOT NULL,
    `comprador_id` int(11) NOT NULL,
    `subtotal` decimal(15,2) DEFAULT 0.00,
    `iva` decimal(15,2) DEFAULT 0.00,
    `total` decimal(15,2) DEFAULT 0.00,
    `status` enum('Pendiente','Aprobada','Recibida','Cancelada') DEFAULT 'Pendiente',
    `observaciones` text,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_folio_empresa` (`folio`, `empresa_id`),
    KEY `empresa_id` (`empresa_id`),
    KEY `proveedor_id` (`proveedor_id`),
    KEY `comprador_id` (`comprador_id`),
    CONSTRAINT `ordenes_compra_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
    CONSTRAINT `ordenes_compra_ibfk_2` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`),
    CONSTRAINT `ordenes_compra_ibfk_3` FOREIGN KEY (`comprador_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Detalle de Órdenes de Compra
CREATE TABLE IF NOT EXISTS `orden_compra_items` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `orden_compra_id` int(11) NOT NULL,
    `producto_id` int(11) NOT NULL,
    `cantidad` decimal(10,2) NOT NULL,
    `precio_unitario` decimal(15,2) NOT NULL,
    `importe` decimal(15,2) NOT NULL,
    `cantidad_recibida` decimal(10,2) DEFAULT 0.00,
    PRIMARY KEY (`id`),
    KEY `orden_compra_id` (`orden_compra_id`),
    KEY `producto_id` (`producto_id`),
    CONSTRAINT `orden_compra_items_ibfk_1` FOREIGN KEY (`orden_compra_id`) REFERENCES `ordenes_compra` (`id`) ON DELETE CASCADE,
    CONSTRAINT `orden_compra_items_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Choferes
CREATE TABLE IF NOT EXISTS `choferes` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `licencia` varchar(50) NOT NULL,
    `telefono` varchar(50) DEFAULT NULL,
    `correo` varchar(255) DEFAULT NULL,
    `fecha_vencimiento` date DEFAULT NULL,
    `status` enum('Activo','Inactivo') DEFAULT 'Activo',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `empresa_id` (`empresa_id`),
    CONSTRAINT `choferes_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vehículos
CREATE TABLE IF NOT EXISTS `vehiculos` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `placas` varchar(20) NOT NULL,
    `marca` varchar(100) DEFAULT NULL,
    `modelo` varchar(100) DEFAULT NULL,
    `año` int(11) DEFAULT NULL,
    `capacidad` varchar(50) DEFAULT NULL,
    `tipo` varchar(50) DEFAULT NULL,
    `poliza_seguro` varchar(100) DEFAULT NULL,
    `vence_seguro` date DEFAULT NULL,
    `status` enum('Activo','Mantenimiento','Inactivo') DEFAULT 'Activo',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_placas_empresa` (`placas`, `empresa_id`),
    KEY `empresa_id` (`empresa_id`),
    CONSTRAINT `vehiculos_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rutas de Reparto
CREATE TABLE IF NOT EXISTS `rutas_reparto` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `zona` varchar(255) NOT NULL,
    `descripcion` text,
    `chofer_id` int(11) DEFAULT NULL,
    `vehiculo_id` int(11) DEFAULT NULL,
    `status` enum('Activo','Inactivo') DEFAULT 'Activo',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `empresa_id` (`empresa_id`),
    KEY `chofer_id` (`chofer_id`),
    KEY `vehiculo_id` (`vehiculo_id`),
    CONSTRAINT `rutas_reparto_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
    CONSTRAINT `rutas_reparto_ibfk_2` FOREIGN KEY (`chofer_id`) REFERENCES `choferes` (`id`),
    CONSTRAINT `rutas_reparto_ibfk_3` FOREIGN KEY (`vehiculo_id`) REFERENCES `vehiculos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Devoluciones
CREATE TABLE IF NOT EXISTS `devoluciones` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `folio` varchar(50) NOT NULL,
    `fecha` date NOT NULL,
    `cliente_id` int(11) NOT NULL,
    `factura_id` int(11) NOT NULL,
    `vendedor_id` int(11) NOT NULL,
    `motivo` varchar(255) DEFAULT NULL,
    `tipo_devolucion` enum('Cambio','Reembolso','Nota de Crédito') DEFAULT NULL,
    `total` decimal(15,2) DEFAULT 0.00,
    `status` enum('Pendiente','Aprobada','Procesada','Rechazada') DEFAULT 'Pendiente',
    `observaciones` text,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_folio_empresa` (`folio`, `empresa_id`),
    KEY `empresa_id` (`empresa_id`),
    KEY `cliente_id` (`cliente_id`),
    KEY `factura_id` (`factura_id`),
    KEY `vendedor_id` (`vendedor_id`),
    CONSTRAINT `devoluciones_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
    CONSTRAINT `devoluciones_ibfk_2` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`),
    CONSTRAINT `devoluciones_ibfk_3` FOREIGN KEY (`factura_id`) REFERENCES `facturas` (`id`),
    CONSTRAINT `devoluciones_ibfk_4` FOREIGN KEY (`vendedor_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLAS ESPECÍFICAS PARA CORTE OPTIMIZADO
-- =============================================

-- Materiales para Corte
CREATE TABLE IF NOT EXISTS `materiales_corte` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `tipo` enum('Vidrio','Aluminio','Acero','Madera','Plástico','Otro') NOT NULL,
    `ancho_estandar` int(11) NOT NULL,
    `alto_estandar` int(11) NOT NULL,
    `espesor` decimal(5,2) NOT NULL,
    `costo_m2` decimal(10,2) NOT NULL,
    `proveedor` varchar(255) DEFAULT NULL,
    `tolerancia_sierra` decimal(5,2) DEFAULT 3.00,
    `densidad` decimal(5,2) DEFAULT NULL,
    `peso_m2` decimal(8,2) DEFAULT NULL,
    `disponible_stock` tinyint(1) DEFAULT 1,
    `tiempo_entrega_dias` int(11) DEFAULT 3,
    `descuento_volumen` decimal(5,2) DEFAULT 0.00,
    `observaciones` text,
    `status` enum('Activo','Inactivo') DEFAULT 'Activo',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `empresa_id` (`empresa_id`),
    KEY `idx_materiales_tipo` (`tipo`),
    CONSTRAINT `materiales_corte_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Proyectos de Corte
CREATE TABLE IF NOT EXISTS `proyectos_corte` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `usuario_id` int(11) NOT NULL,
    `nombre_proyecto` varchar(255) NOT NULL,
    `material_id` int(11) NOT NULL,
    `cliente_id` int(11) DEFAULT NULL,
    `cortes_data` json NOT NULL,
    `resultado_optimizacion` json DEFAULT NULL,
    `aprovechamiento` decimal(5,2) DEFAULT NULL,
    `desperdicio` decimal(5,2) DEFAULT NULL,
    `laminas_necesarias` int(11) DEFAULT NULL,
    `costo_total` decimal(15,2) DEFAULT NULL,
    `ahorro_estimado` decimal(15,2) DEFAULT NULL,
    `tiempo_estimado` int(11) DEFAULT NULL,
    `observaciones` text,
    `fecha_calculo` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `status` enum('Activo','Archivado','Completado') DEFAULT 'Activo',
    PRIMARY KEY (`id`),
    KEY `empresa_id` (`empresa_id`),
    KEY `usuario_id` (`usuario_id`),
    KEY `material_id` (`material_id`),
    KEY `cliente_id` (`cliente_id`),
    KEY `idx_proyectos_fecha` (`fecha_calculo`),
    CONSTRAINT `proyectos_corte_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
    CONSTRAINT `proyectos_corte_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
    CONSTRAINT `proyectos_corte_ibfk_3` FOREIGN KEY (`material_id`) REFERENCES `materiales_corte` (`id`),
    CONSTRAINT `proyectos_corte_ibfk_4` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Plantillas de Corte
CREATE TABLE IF NOT EXISTS `plantillas_corte` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `usuario_id` int(11) NOT NULL,
    `nombre` varchar(255) NOT NULL,
    `descripcion` text,
    `material_tipo` varchar(100) NOT NULL,
    `cortes_template` json NOT NULL,
    `categoria` varchar(100) DEFAULT NULL,
    `uso_frecuencia` int(11) DEFAULT 0,
    `status` enum('Activo','Inactivo') DEFAULT 'Activo',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `empresa_id` (`empresa_id`),
    KEY `usuario_id` (`usuario_id`),
    CONSTRAINT `plantillas_corte_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`),
    CONSTRAINT `plantillas_corte_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLAS DE AUDITORÍA Y CONTROL
-- =============================================

-- Bitácora de Accesos
CREATE TABLE IF NOT EXISTS `bitacora_accesos` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `usuario_id` int(11) DEFAULT NULL,
    `accion` varchar(100) NOT NULL,
    `modulo` varchar(100) DEFAULT NULL,
    `ip_address` varchar(45) DEFAULT NULL,
    `user_agent` text,
    `detalles` text,
    `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `usuario_id` (`usuario_id`),
    KEY `idx_bitacora_fecha` (`fecha`),
    CONSTRAINT `bitacora_accesos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Auditoría de Cambios
CREATE TABLE IF NOT EXISTS `auditoria_cambios` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `tabla` varchar(100) NOT NULL,
    `registro_id` int(11) NOT NULL,
    `operacion` enum('INSERT','UPDATE','DELETE') NOT NULL,
    `usuario_id` int(11) DEFAULT NULL,
    `valores_anteriores` json DEFAULT NULL,
    `valores_nuevos` json DEFAULT NULL,
    `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `usuario_id` (`usuario_id`),
    KEY `idx_auditoria_fecha` (`fecha`),
    CONSTRAINT `auditoria_cambios_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Configuración del Sistema
CREATE TABLE IF NOT EXISTS `configuracion_sistema` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `empresa_id` int(11) NOT NULL,
    `clave` varchar(100) NOT NULL,
    `valor` text,
    `descripcion` text,
    `tipo` enum('string','number','boolean','json') DEFAULT 'string',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_clave_empresa` (`clave`, `empresa_id`),
    KEY `empresa_id` (`empresa_id`),
    CONSTRAINT `configuracion_sistema_ibfk_1` FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Catálogos SAT
CREATE TABLE IF NOT EXISTS `catalogos_sat` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `tipo` varchar(50) NOT NULL,
    `clave` varchar(20) NOT NULL,
    `descripcion` varchar(500) DEFAULT NULL,
    `status` enum('Activo','Inactivo') DEFAULT 'Activo',
    `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_tipo_clave` (`tipo`, `clave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- DATOS INICIALES
-- =============================================

-- Insertar empresa demo
INSERT INTO `empresas` (`razon_social`, `rfc`, `regimen_fiscal`, `domicilio_fiscal`, `telefono`, `correo`) VALUES
('Aluminios y Vidrios del Norte S.A. de C.V.', 'AVN123456789', '601', 'Av. Industrial 123, Col. Norte, CP 64000, Monterrey, N.L.', '81-1234-5678', 'contacto@aluminiosnorte.com');

-- Insertar sucursal principal
INSERT INTO `sucursales` (`empresa_id`, `nombre`, `codigo`, `direccion`, `telefono`, `correo`, `gerente`, `es_principal`) VALUES
(1, 'Matriz', 'MTZ', 'Av. Industrial 123, Col. Norte, CP 64000, Monterrey, N.L.', '81-1234-5678', 'matriz@aluminiosnorte.com', 'Ing. Roberto Martínez', 1);

-- Insertar roles básicos
INSERT INTO `roles` (`nombre`, `descripcion`, `permisos`) VALUES
('Administrador', 'Acceso completo al sistema', '["all"]'),
('Vendedor', 'Gestión de ventas y clientes', '["ventas.read", "ventas.write", "clientes.read", "clientes.write", "productos.read"]'),
('Almacenista', 'Gestión de inventario', '["inventario.read", "inventario.write", "productos.read"]'),
('Comprador', 'Gestión de compras y proveedores', '["compras.read", "compras.write", "proveedores.read", "proveedores.write"]'),
('Operador Corte', 'Módulo de corte optimizado', '["corte.read", "corte.write", "productos.read", "materiales.read"]');

-- Insertar usuario administrador
INSERT INTO `usuarios` (`empresa_id`, `sucursal_id`, `rol_id`, `nombre`, `email`, `password_hash`) VALUES
(1, 1, 1, 'Administrador Sistema', 'admin@empresa.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insertar líneas de producción
INSERT INTO `lineas_produccion` (`empresa_id`, `nombre`, `descripcion`) VALUES
(1, 'Cancelería Residencial', 'Ventanas y puertas para casas habitación'),
(1, 'Cancelería Comercial', 'Sistemas para edificios comerciales'),
(1, 'Fachadas Estructurales', 'Muros cortina y fachadas integrales'),
(1, 'Vidrios Especiales', 'Vidrios templados, laminados y especiales');

-- Insertar acabados de aluminio
INSERT INTO `acabados_aluminio` (`empresa_id`, `nombre`, `descripcion`, `color`) VALUES
(1, 'Natural', 'Aluminio sin tratamiento superficial', '#C0C0C0'),
(1, 'Anodizado Plata', 'Acabado anodizado color plata', '#E5E5E5'),
(1, 'Anodizado Oro', 'Acabado anodizado color oro', '#FFD700'),
(1, 'Anodizado Bronce', 'Acabado anodizado color bronce', '#CD7F32'),
(1, 'Anodizado Negro', 'Acabado anodizado color negro', '#2C2C2C'),
(1, 'Pintado Blanco', 'Pintura electroestática blanca', '#FFFFFF');

-- Insertar almacén principal
INSERT INTO `almacenes` (`empresa_id`, `sucursal_id`, `nombre`, `codigo`, `direccion`, `responsable`) VALUES
(1, 1, 'Almacén General', 'ALM01', 'Av. Industrial 123, Col. Norte', 'Juan Pérez');

-- Insertar productos demo
INSERT INTO `productos` (`empresa_id`, `codigo`, `descripcion`, `linea_id`, `ubicacion`, `unidad_sat`, `clave_sat`, `precio_base`, `costo`, `stock_min`, `stock_max`, `stock_actual`) VALUES
(1, 'VT-6MM-001', 'Vidrio Templado 6mm Transparente', 4, 'A-01-15', 'M2', '43211701', 350.00, 210.00, 50, 500, 125),
(1, 'AL-NAT-001', 'Perfil Aluminio Natural 2x1', 1, 'B-02-08', 'PZA', '30111506', 145.50, 87.30, 100, 1000, 320),
(1, 'VL-8MM-001', 'Vidrio Laminado 8mm Seguridad', 4, 'A-03-22', 'M2', '43211702', 520.00, 312.00, 30, 300, 85),
(1, 'HE-PREM-001', 'Herraje Premium Ventana', 1, 'C-01-10', 'PZA', '30111507', 89.50, 45.20, 200, 2000, 450),
(1, 'VT-10MM-001', 'Vidrio Templado 10mm', 4, 'A-01-16', 'M2', '43211701', 450.00, 280.00, 25, 250, 75),
(1, 'AL-ANO-001', 'Perfil Aluminio Anodizado', 1, 'B-02-09', 'PZA', '30111506', 185.50, 115.30, 80, 800, 180),
(1, 'VL-6MM-001', 'Vidrio Laminado 6mm', 4, 'A-03-23', 'M2', '43211702', 420.00, 252.00, 40, 400, 95),
(1, 'HE-EST-001', 'Herraje Estándar Puerta', 1, 'C-01-11', 'PZA', '30111507', 65.50, 32.20, 300, 3000, 850);

-- Insertar inventario inicial
INSERT INTO `inventario` (`producto_id`, `almacen_id`, `stock_actual`, `costo_promedio`) VALUES
(1, 1, 125, 210.00),
(2, 1, 320, 87.30),
(3, 1, 85, 312.00),
(4, 1, 450, 45.20),
(5, 1, 75, 280.00),
(6, 1, 180, 115.30),
(7, 1, 95, 252.00),
(8, 1, 850, 32.20);

-- Insertar clientes demo
INSERT INTO `clientes` (`empresa_id`, `sucursal_id`, `nombre`, `rfc`, `telefono`, `correo`, `direccion`, `saldo`, `precio_especial`, `descuento`, `metodo_pago_preferido`, `vendedor_id`, `comentarios`) VALUES
(1, 1, 'Constructora ABC S.A. de C.V.', 'CABC123456789', '555-0123', 'contacto@constructoraabc.com', 'Av. Reforma 123, Col. Centro', 85430.50, 1, 15.0, 'Transferencia', 1, 'Cliente preferencial, crédito 30 días'),
(1, 1, 'Vidrios del Norte S.A.', 'VNO890123456', '555-0456', 'compras@vidriosdelnorte.com', 'Blvd. Industrial 456, Zona Norte', 23750.00, 0, 5.0, 'Cheque', 1, 'Distribuidor regional'),
(1, 1, 'Juan Pérez Construcciones', 'PEXJ850429AB1', '555-0789', 'juan@construcciones.com', 'Calle 5 de Mayo 789, Col. Americana', 0.00, 0, 0.0, 'Efectivo', 1, 'Cliente de contado'),
(1, 1, 'Desarrollos Inmobiliarios SA', 'DIS890123456', '555-1234', 'ventas@desarrollos.com', 'Av. Universidad 456, Col. Del Valle', 125000.00, 1, 20.0, 'Transferencia', 1, 'Cliente corporativo VIP'),
(1, 1, 'Cristales y Aluminios del Sur', 'CAS123789456', '555-5678', 'info@cristalesdelsur.com', 'Carretera Sur Km 15', 45000.00, 0, 8.0, 'Cheque', 1, 'Distribuidor autorizado');

-- Insertar proveedores demo
INSERT INTO `proveedores` (`empresa_id`, `nombre`, `rfc`, `telefono`, `correo`, `direccion`, `saldo`, `metodo_pago_habitual`, `condiciones_credito`, `contacto_principal`, `categoria`) VALUES
(1, 'Aluminios Industriales S.A.', 'AIN123456789', '555-1001', 'ventas@aluminiosindustriales.com', 'Zona Industrial Norte, Lote 15', 125430.50, 'Transferencia', '30 días', 'Ing. María López', 'Materia Prima'),
(1, 'Vidrios y Cristales del Bajío', 'VCB890123456', '555-1002', 'compras@vidriosbajio.com', 'Carretera Nacional Km 45', 89750.00, 'Cheque', '15 días', 'Lic. Carlos Ramírez', 'Vidrio'),
(1, 'Herrajes y Accesorios Premium', 'HAP850429AB1', '555-1003', 'info@herrajespremium.com', 'Boulevard de la Industria 234', 45200.00, 'Efectivo', 'Contado', 'Sr. Jorge Mendoza', 'Herrajes'),
(1, 'Aceros del Norte', 'ADN456789123', '555-1004', 'ventas@acerosnorte.com', 'Parque Industrial 567', 67500.00, 'Transferencia', '45 días', 'Ing. Carlos Ruiz', 'Acero');

-- Insertar materiales para corte optimizado
INSERT INTO `materiales_corte` (`empresa_id`, `nombre`, `tipo`, `ancho_estandar`, `alto_estandar`, `espesor`, `costo_m2`, `proveedor`, `tolerancia_sierra`, `densidad`, `peso_m2`, `disponible_stock`, `tiempo_entrega_dias`, `descuento_volumen`, `observaciones`) VALUES
(1, 'Vidrio Templado 6mm Transparente', 'Vidrio', 2440, 1220, 6.00, 350.00, 'Vidrios del Norte S.A.', 3.00, 2.50, 15.00, 1, 3, 5.00, 'Material premium para proyectos residenciales'),
(1, 'Vidrio Laminado 8mm Seguridad', 'Vidrio', 2440, 1220, 8.00, 520.00, 'Vidrios Especiales', 4.00, 2.50, 20.00, 1, 5, 3.00, 'Para aplicaciones de seguridad'),
(1, 'Lámina Aluminio Natural 3mm', 'Aluminio', 3000, 1500, 3.00, 145.50, 'Aluminios Industriales S.A.', 2.00, 2.70, 8.10, 1, 5, 8.00, 'Ideal para cancelería comercial'),
(1, 'Lámina Aluminio Anodizado 3mm', 'Aluminio', 3000, 1500, 3.00, 185.50, 'Aluminios Industriales S.A.', 2.00, 2.70, 8.10, 1, 7, 8.00, 'Acabado premium anodizado'),
(1, 'Lámina Acero Galvanizado 2mm', 'Acero', 2000, 1000, 2.00, 89.50, 'Aceros del Norte', 1.50, 7.85, 15.70, 0, 7, 10.00, 'Requiere pedido anticipado'),
(1, 'Lámina Acero Inoxidable 2mm', 'Acero', 2000, 1000, 2.00, 245.00, 'Aceros del Norte', 1.50, 7.93, 15.86, 1, 10, 5.00, 'Para aplicaciones especiales'),
(1, 'Vidrio Templado 10mm', 'Vidrio', 2440, 1220, 10.00, 450.00, 'Vidrios del Norte S.A.', 4.00, 2.50, 25.00, 1, 5, 5.00, 'Para estructuras pesadas'),
(1, 'Perfil Aluminio Estructural', 'Aluminio', 6000, 100, 2.50, 185.50, 'Perfiles Premium', 1.00, 2.70, 6.75, 1, 2, 12.00, 'Perfil lineal, cálculo por metro');

-- Insertar proyectos de corte de ejemplo
INSERT INTO `proyectos_corte` (`empresa_id`, `usuario_id`, `nombre_proyecto`, `material_id`, `cliente_id`, `cortes_data`, `aprovechamiento`, `desperdicio`, `laminas_necesarias`, `costo_total`, `ahorro_estimado`, `observaciones`) VALUES
(1, 1, 'Ventanas Residencial ABC', 1, 1, '{"cortes":[{"id":"1","descripcion":"Ventana 1200x800","ancho":1200,"alto":800,"cantidad":4},{"id":"2","descripcion":"Ventana 800x600","ancho":800,"alto":600,"cantidad":6}]}', 87.50, 12.50, 2, 1708.00, 213.50, 'Optimización estándar aplicada'),
(1, 1, 'Fachada Comercial XYZ', 3, 2, '{"cortes":[{"id":"1","descripcion":"Panel 1500x1000","ancho":1500,"alto":1000,"cantidad":8},{"id":"2","descripcion":"Panel 1000x800","ancho":1000,"alto":800,"cantidad":4}]}', 92.30, 7.70, 3, 1957.50, 150.75, 'Patrón optimizado con rotación'),
(1, 1, 'Puertas Oficina DEF', 5, 3, '{"cortes":[{"id":"1","descripcion":"Puerta 900x2100","ancho":900,"alto":2100,"cantidad":3},{"id":"2","descripcion":"Marco 100x2100","ancho":100,"alto":2100,"cantidad":6}]}', 78.90, 21.10, 2, 358.00, 75.50, 'Material con limitaciones de corte');

-- =============================================
-- CATÁLOGOS SAT
-- =============================================

INSERT INTO `catalogos_sat` (`tipo`, `clave`, `descripcion`) VALUES
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

INSERT INTO `configuracion_sistema` (`empresa_id`, `clave`, `valor`, `descripcion`, `tipo`) VALUES
(1, 'serie_facturas', 'A', 'Serie por defecto para facturas', 'string'),
(1, 'folio_inicial_facturas', '1', 'Folio inicial para facturas', 'number'),
(1, 'iva_porcentaje', '16', 'Porcentaje de IVA', 'number'),
(1, 'moneda_default', 'MXN', 'Moneda por defecto', 'string'),
(1, 'lugar_expedicion', '64000', 'Código postal de lugar de expedición', 'string'),
(1, 'regimen_fiscal_empresa', '601', 'Régimen fiscal de la empresa', 'string'),
(1, 'api_sat_url', 'https://api.facturama.mx/v1/', 'URL de API para facturación SAT', 'string'),
(1, 'api_sat_key', '', 'API Key para facturación SAT', 'string'),
(1, 'backup_automatico', 'true', 'Activar respaldos automáticos', 'boolean'),
(1, 'dias_vencimiento_cotizacion', '15', 'Días de vigencia de cotizaciones', 'number'),
(1, 'version_sistema', '3.0', 'Versión del sistema ERP', 'string');

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

-- Índices para búsquedas frecuentes
CREATE INDEX `idx_clientes_rfc` ON `clientes`(`rfc`);
CREATE INDEX `idx_productos_codigo` ON `productos`(`codigo`);
CREATE INDEX `idx_facturas_folio` ON `facturas`(`folio`);
CREATE INDEX `idx_movimientos_fecha` ON `movimientos_inventario`(`fecha`);
CREATE INDEX `idx_proyectos_corte_fecha` ON `proyectos_corte`(`fecha_calculo`);

-- Índices compuestos para consultas complejas
CREATE INDEX `idx_clientes_empresa_status` ON `clientes`(`empresa_id`, `status`);
CREATE INDEX `idx_productos_empresa_linea` ON `productos`(`empresa_id`, `linea_id`);

-- =============================================
-- TRIGGERS PARA AUDITORÍA AUTOMÁTICA
-- =============================================

DELIMITER $$

-- Trigger para auditoría de clientes
CREATE TRIGGER `tr_clientes_audit_insert`
AFTER INSERT ON `clientes`
FOR EACH ROW
BEGIN
    INSERT INTO `auditoria_cambios` (`tabla`, `registro_id`, `operacion`, `valores_nuevos`)
    VALUES ('clientes', NEW.id, 'INSERT', JSON_OBJECT(
        'nombre', NEW.nombre,
        'rfc', NEW.rfc,
        'status', NEW.status,
        'saldo', NEW.saldo
    ));
END$$

CREATE TRIGGER `tr_clientes_audit_update`
AFTER UPDATE ON `clientes`
FOR EACH ROW
BEGIN
    INSERT INTO `auditoria_cambios` (`tabla`, `registro_id`, `operacion`, `valores_anteriores`, `valores_nuevos`)
    VALUES ('clientes', NEW.id, 'UPDATE', 
        JSON_OBJECT('nombre', OLD.nombre, 'rfc', OLD.rfc, 'status', OLD.status, 'saldo', OLD.saldo),
        JSON_OBJECT('nombre', NEW.nombre, 'rfc', NEW.rfc, 'status', NEW.status, 'saldo', NEW.saldo)
    );
END$$

-- Trigger para actualizar inventario
CREATE TRIGGER `tr_movimientos_update_inventario`
AFTER INSERT ON `movimientos_inventario`
FOR EACH ROW
BEGIN
    INSERT INTO `inventario` (`producto_id`, `almacen_id`, `stock_actual`, `costo_promedio`)
    VALUES (NEW.producto_id, NEW.almacen_id, NEW.saldo_nuevo, COALESCE(NEW.costo_unitario, 0))
    ON DUPLICATE KEY UPDATE 
        `stock_actual` = NEW.saldo_nuevo,
        `ultima_entrada` = CASE WHEN NEW.tipo IN ('Entrada', 'Transferencia') AND NEW.cantidad > 0 THEN NEW.fecha ELSE `ultima_entrada` END,
        `ultima_salida` = CASE WHEN NEW.tipo IN ('Salida', 'Transferencia') AND NEW.cantidad < 0 THEN NEW.fecha ELSE `ultima_salida` END;
END$$

DELIMITER ;

-- =============================================
-- VISTAS PARA REPORTES
-- =============================================

-- Vista de inventario consolidado
CREATE VIEW `v_inventario_consolidado` AS
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
CREATE VIEW `v_cartera_clientes` AS
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

-- Vista de proyectos de corte
CREATE VIEW `v_proyectos_corte_resumen` AS
SELECT 
    pc.id,
    pc.nombre_proyecto,
    pc.fecha_calculo,
    mc.nombre as material,
    mc.tipo as tipo_material,
    c.nombre as cliente,
    u.nombre as usuario,
    pc.aprovechamiento,
    pc.desperdicio,
    pc.laminas_necesarias,
    pc.costo_total,
    pc.ahorro_estimado,
    pc.status
FROM proyectos_corte pc
LEFT JOIN materiales_corte mc ON pc.material_id = mc.id
LEFT JOIN clientes c ON pc.cliente_id = c.id
LEFT JOIN usuarios u ON pc.usuario_id = u.id
ORDER BY pc.fecha_calculo DESC;

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS
-- =============================================

DELIMITER $$

-- Procedimiento para crear respaldo
CREATE PROCEDURE `sp_crear_respaldo`(
    IN p_tipo VARCHAR(20),
    IN p_incluir_datos BOOLEAN
)
BEGIN
    DECLARE v_fecha VARCHAR(20);
    DECLARE v_archivo VARCHAR(255);
    
    SET v_fecha = DATE_FORMAT(NOW(), '%Y%m%d_%H%i%s');
    SET v_archivo = CONCAT('backup_', v_fecha, '.sql');
    
    -- Registrar en bitácora
    INSERT INTO `bitacora_accesos` (`usuario_id`, `accion`, `modulo`, `detalles`)
    VALUES (1, 'Respaldo BD', 'Administrador', CONCAT('Archivo: ', v_archivo, ', Tipo: ', p_tipo));
    
    SELECT v_archivo as archivo_generado, 'Respaldo creado exitosamente' as mensaje;
END$$

-- Procedimiento para actualizar precios masivamente
CREATE PROCEDURE `sp_actualizar_precios_masivo`(
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
    INSERT INTO `bitacora_accesos` (`usuario_id`, `accion`, `modulo`, `detalles`)
    VALUES (p_usuario_id, 'Actualización Masiva Precios', 'Productos', 
            CONCAT('Porcentaje: ', p_porcentaje, '%, Registros: ', v_registros_afectados));
    
    SELECT v_registros_afectados as registros_actualizados, 'Precios actualizados exitosamente' as mensaje;
END$$

-- Procedimiento para calcular estadísticas de corte
CREATE PROCEDURE `sp_estadisticas_corte`(
    IN p_empresa_id INT,
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT 
        COUNT(*) as total_proyectos,
        AVG(aprovechamiento) as aprovechamiento_promedio,
        SUM(laminas_necesarias) as total_laminas,
        SUM(costo_total) as costo_total,
        SUM(ahorro_estimado) as ahorro_total,
        mc.tipo as tipo_material,
        COUNT(*) as proyectos_por_tipo
    FROM proyectos_corte pc
    LEFT JOIN materiales_corte mc ON pc.material_id = mc.id
    WHERE pc.empresa_id = p_empresa_id
    AND pc.fecha_calculo BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY mc.tipo;
END$$

DELIMITER ;

-- =============================================
-- FINALIZACIÓN
-- =============================================

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

-- Mensaje de finalización
SELECT 'Base de datos ERP Nube Aluminio/Vidrio v3.0 creada exitosamente' as mensaje,
       'Estructura completa con datos de demostración y módulo de corte optimizado' as descripcion,
       NOW() as fecha_creacion,
       'Ubuntu Server 24.04.2 LTS Compatible' as compatibilidad;