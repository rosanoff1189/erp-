import React, { useState } from 'react';
import { Users, Search, Shield, Clock, Eye, Download, Filter } from 'lucide-react';

const ControlUsuarios: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('usuarios');
  const [filterRole, setFilterRole] = useState('all');

  const usuarios = [
    {
      id: 1,
      nombre: 'Administrador Sistema',
      email: 'admin@empresa.com',
      rol: 'Administrador',
      sucursal: 'Matriz',
      status: 'Activo',
      ultimoAcceso: '2024-01-17 14:30:25',
      sesionesActivas: 1,
      intentosFallidos: 0,
      fechaCreacion: '2023-01-01',
      ultimaModificacion: '2024-01-15'
    },
    {
      id: 2,
      nombre: 'Carlos López Mendoza',
      email: 'carlos.lopez@empresa.com',
      rol: 'Vendedor',
      sucursal: 'Matriz',
      status: 'Activo',
      ultimoAcceso: '2024-01-17 12:15:10',
      sesionesActivas: 0,
      intentosFallidos: 0,
      fechaCreacion: '2023-02-15',
      ultimaModificacion: '2024-01-10'
    },
    {
      id: 3,
      nombre: 'María García Silva',
      email: 'maria.garcia@empresa.com',
      rol: 'Almacenista',
      sucursal: 'Sucursal Norte',
      status: 'Bloqueado',
      ultimoAcceso: '2024-01-16 18:45:30',
      sesionesActivas: 0,
      intentosFallidos: 3,
      fechaCreacion: '2023-03-10',
      ultimaModificacion: '2024-01-16'
    }
  ];

  const bitacora = [
    {
      id: 1,
      fecha: '2024-01-17 14:30:25',
      usuario: 'admin@empresa.com',
      accion: 'Inicio de Sesión',
      modulo: 'Sistema',
      ip: '192.168.1.100',
      detalles: 'Acceso exitoso desde navegador Chrome'
    },
    {
      id: 2,
      fecha: '2024-01-17 14:25:10',
      usuario: 'carlos.lopez@empresa.com',
      accion: 'Crear Factura',
      modulo: 'Ventas',
      ip: '192.168.1.105',
      detalles: 'Factura FAC-2024-0156 creada por $45,680.00'
    },
    {
      id: 3,
      fecha: '2024-01-17 14:20:15',
      usuario: 'maria.garcia@empresa.com',
      accion: 'Intento Fallido',
      modulo: 'Sistema',
      ip: '192.168.1.110',
      detalles: 'Contraseña incorrecta - Intento 3/3'
    },
    {
      id: 4,
      fecha: '2024-01-17 14:15:30',
      usuario: 'admin@empresa.com',
      accion: 'Modificar Usuario',
      modulo: 'Configuración',
      ip: '192.168.1.100',
      detalles: 'Usuario maria.garcia@empresa.com bloqueado por intentos fallidos'
    }
  ];

  const auditoria = [
    {
      id: 1,
      fecha: '2024-01-17 14:30:00',
      tabla: 'facturas',
      operacion: 'INSERT',
      usuario: 'carlos.lopez@empresa.com',
      registroId: 156,
      valoresAnteriores: null,
      valoresNuevos: '{"folio":"FAC-2024-0156","total":45680.00,"cliente_id":1}'
    },
    {
      id: 2,
      fecha: '2024-01-17 14:25:00',
      tabla: 'productos',
      operacion: 'UPDATE',
      usuario: 'maria.garcia@empresa.com',
      registroId: 25,
      valoresAnteriores: '{"stock_actual":125}',
      valoresNuevos: '{"stock_actual":100}'
    },
    {
      id: 3,
      fecha: '2024-01-17 14:20:00',
      tabla: 'clientes',
      operacion: 'UPDATE',
      usuario: 'admin@empresa.com',
      registroId: 1,
      valoresAnteriores: '{"saldo":77830.00}',
      valoresNuevos: '{"saldo":123510.00}'
    }
  ];

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = 
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || usuario.rol === filterRole;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo':
        return 'bg-green-100 text-green-800';
      case 'Inactivo':
        return 'bg-gray-100 text-gray-800';
      case 'Bloqueado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccionColor = (accion: string) => {
    switch (accion) {
      case 'Inicio de Sesión':
        return 'bg-green-100 text-green-800';
      case 'Cierre de Sesión':
        return 'bg-blue-100 text-blue-800';
      case 'Intento Fallido':
        return 'bg-red-100 text-red-800';
      case 'Crear Factura':
        return 'bg-purple-100 text-purple-800';
      case 'Modificar Usuario':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDesbloquearUsuario = (userId: number) => {
    if (confirm('¿Está seguro de desbloquear este usuario?')) {
      alert(`Usuario desbloqueado. Se ha enviado notificación por correo.`);
    }
  };

  const handleRestablecerPassword = (userId: number) => {
    if (confirm('¿Está seguro de restablecer la contraseña de este usuario?')) {
      alert(`Contraseña restablecida. Se ha enviado nueva contraseña por correo.`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Control de Usuarios</h3>
              <p className="text-sm text-gray-600">Gestión avanzada, bitácora y auditoría de usuarios</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Exportar Reporte</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('usuarios')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'usuarios'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Gestión de Usuarios
          </button>
          <button
            onClick={() => setActiveTab('bitacora')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'bitacora'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bitácora de Accesos
          </button>
          <button
            onClick={() => setActiveTab('auditoria')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'auditoria'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Auditoría de Cambios
          </button>
        </div>

        {activeTab === 'usuarios' && (
          <div>
            {/* Filters */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos los roles</option>
                <option value="Administrador">Administrador</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Almacenista">Almacenista</option>
                <option value="Comprador">Comprador</option>
              </select>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Usuarios Totales</p>
                <p className="text-2xl font-bold text-blue-900">{usuarios.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Usuarios Activos</p>
                <p className="text-2xl font-bold text-green-900">
                  {usuarios.filter(u => u.status === 'Activo').length}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-red-600 font-medium">Usuarios Bloqueados</p>
                <p className="text-2xl font-bold text-red-900">
                  {usuarios.filter(u => u.status === 'Bloqueado').length}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600 font-medium">Sesiones Activas</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {usuarios.reduce((sum, u) => sum + u.sesionesActivas, 0)}
                </p>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Usuario</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Rol/Sucursal</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Último Acceso</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Sesiones</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{usuario.nombre}</p>
                          <p className="text-sm text-gray-600">{usuario.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium">{usuario.rol}</p>
                          <p className="text-xs text-gray-500">{usuario.sucursal}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">{usuario.ultimoAcceso}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(usuario.status)}`}>
                          {usuario.status}
                        </span>
                        {usuario.intentosFallidos > 0 && (
                          <p className="text-xs text-red-600 mt-1">
                            {usuario.intentosFallidos} intentos fallidos
                          </p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          usuario.sesionesActivas > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {usuario.sesionesActivas} activa(s)
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {usuario.status === 'Bloqueado' && (
                            <button
                              onClick={() => handleDesbloquearUsuario(usuario.id)}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                            >
                              Desbloquear
                            </button>
                          )}
                          <button
                            onClick={() => handleRestablecerPassword(usuario.id)}
                            className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                          >
                            Reset Pass
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'bitacora' && (
          <div>
            <div className="mb-4">
              <div className="flex items-center space-x-4">
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-500">a</span>
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Todas las acciones</option>
                  <option value="login">Inicios de Sesión</option>
                  <option value="logout">Cierres de Sesión</option>
                  <option value="failed">Intentos Fallidos</option>
                  <option value="create">Creaciones</option>
                  <option value="update">Modificaciones</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha/Hora</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Usuario</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Acción</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Módulo</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">IP</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {bitacora.map((registro) => (
                    <tr key={registro.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-mono">{registro.fecha}</td>
                      <td className="py-3 px-4 text-sm">{registro.usuario}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccionColor(registro.accion)}`}>
                          {registro.accion}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{registro.modulo}</td>
                      <td className="py-3 px-4 text-sm font-mono">{registro.ip}</td>
                      <td className="py-3 px-4 text-sm">{registro.detalles}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'auditoria' && (
          <div>
            <div className="mb-4">
              <div className="flex items-center space-x-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Todas las tablas</option>
                  <option value="facturas">Facturas</option>
                  <option value="productos">Productos</option>
                  <option value="clientes">Clientes</option>
                  <option value="proveedores">Proveedores</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Todas las operaciones</option>
                  <option value="INSERT">Creaciones</option>
                  <option value="UPDATE">Modificaciones</option>
                  <option value="DELETE">Eliminaciones</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha/Hora</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Tabla</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Operación</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Usuario</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Registro ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {auditoria.map((registro) => (
                    <tr key={registro.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-mono">{registro.fecha}</td>
                      <td className="py-3 px-4 text-sm font-medium">{registro.tabla}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          registro.operacion === 'INSERT' ? 'bg-green-100 text-green-800' :
                          registro.operacion === 'UPDATE' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {registro.operacion}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{registro.usuario}</td>
                      <td className="py-3 px-4 text-sm font-mono">{registro.registroId}</td>
                      <td className="py-3 px-4">
                        <button
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          title="Ver cambios detallados"
                        >
                          Ver Cambios
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlUsuarios;