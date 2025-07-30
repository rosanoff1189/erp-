import React, { useState } from 'react';
import { Shield, Plus, Edit, Trash2, Users, Check, X } from 'lucide-react';

const Permisos: React.FC = () => {
  const [activeTab, setActiveTab] = useState('roles');
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);

  const roles = [
    {
      id: 1,
      nombre: 'Administrador',
      descripcion: 'Acceso completo al sistema',
      usuarios: 1,
      permisos: ['all']
    },
    {
      id: 2,
      nombre: 'Vendedor',
      descripcion: 'Gestión de ventas y clientes',
      usuarios: 3,
      permisos: ['ventas.read', 'ventas.write', 'clientes.read', 'clientes.write', 'productos.read']
    },
    {
      id: 3,
      nombre: 'Almacenista',
      descripcion: 'Gestión de inventario',
      usuarios: 2,
      permisos: ['inventario.read', 'inventario.write', 'productos.read']
    },
    {
      id: 4,
      nombre: 'Comprador',
      descripcion: 'Gestión de compras y proveedores',
      usuarios: 1,
      permisos: ['compras.read', 'compras.write', 'proveedores.read', 'proveedores.write']
    }
  ];

  const modulos = [
    {
      nombre: 'Dashboard',
      permisos: [
        { id: 'dashboard.read', nombre: 'Ver Dashboard', descripcion: 'Acceso al panel principal' }
      ]
    },
    {
      nombre: 'Ventas',
      permisos: [
        { id: 'ventas.read', nombre: 'Ver Ventas', descripcion: 'Consultar facturas, cotizaciones, pedidos' },
        { id: 'ventas.write', nombre: 'Crear/Editar Ventas', descripcion: 'Crear y modificar documentos de venta' },
        { id: 'ventas.delete', nombre: 'Eliminar Ventas', descripcion: 'Cancelar facturas y documentos' },
        { id: 'ventas.timbrar', nombre: 'Timbrar Facturas', descripcion: 'Generar CFDI en el SAT' }
      ]
    },
    {
      nombre: 'Compras',
      permisos: [
        { id: 'compras.read', nombre: 'Ver Compras', descripcion: 'Consultar órdenes y facturas de compra' },
        { id: 'compras.write', nombre: 'Crear/Editar Compras', descripcion: 'Crear y modificar documentos de compra' },
        { id: 'compras.approve', nombre: 'Aprobar Compras', descripcion: 'Autorizar órdenes de compra' }
      ]
    },
    {
      nombre: 'Inventario',
      permisos: [
        { id: 'inventario.read', nombre: 'Ver Inventario', descripcion: 'Consultar existencias y movimientos' },
        { id: 'inventario.write', nombre: 'Gestionar Inventario', descripcion: 'Crear entradas, salidas y ajustes' },
        { id: 'inventario.transfer', nombre: 'Transferencias', descripcion: 'Mover productos entre almacenes' }
      ]
    },
    {
      nombre: 'Catálogos',
      permisos: [
        { id: 'productos.read', nombre: 'Ver Productos', descripcion: 'Consultar catálogo de productos' },
        { id: 'productos.write', nombre: 'Gestionar Productos', descripcion: 'Crear y modificar productos' },
        { id: 'clientes.read', nombre: 'Ver Clientes', descripcion: 'Consultar información de clientes' },
        { id: 'clientes.write', nombre: 'Gestionar Clientes', descripcion: 'Crear y modificar clientes' },
        { id: 'proveedores.read', nombre: 'Ver Proveedores', descripcion: 'Consultar información de proveedores' },
        { id: 'proveedores.write', nombre: 'Gestionar Proveedores', descripcion: 'Crear y modificar proveedores' }
      ]
    },
    {
      nombre: 'Configuración',
      permisos: [
        { id: 'config.read', nombre: 'Ver Configuración', descripcion: 'Acceso a configuraciones del sistema' },
        { id: 'config.write', nombre: 'Modificar Configuración', descripcion: 'Cambiar configuraciones del sistema' },
        { id: 'usuarios.read', nombre: 'Ver Usuarios', descripcion: 'Consultar usuarios del sistema' },
        { id: 'usuarios.write', nombre: 'Gestionar Usuarios', descripcion: 'Crear y modificar usuarios' }
      ]
    }
  ];

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setShowModal(true);
  };

  const handleDeleteRole = (id: number) => {
    if (confirm('¿Está seguro de eliminar este rol?')) {
      // Lógica para eliminar rol
      alert('Rol eliminado');
    }
  };

  const hasPermission = (rolePermisos: string[], permisoId: string) => {
    return rolePermisos.includes('all') || rolePermisos.includes(permisoId);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Roles y Permisos</h3>
              <p className="text-sm text-gray-600">Gestión de roles de usuario y permisos del sistema</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingRole(null);
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Rol</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'roles'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Roles de Usuario
          </button>
          <button
            onClick={() => setActiveTab('permisos')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'permisos'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Matriz de Permisos
          </button>
        </div>

        {activeTab === 'roles' && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Total Roles</p>
                <p className="text-2xl font-bold text-blue-900">{roles.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Usuarios Asignados</p>
                <p className="text-2xl font-bold text-green-900">
                  {roles.reduce((sum, r) => sum + r.usuarios, 0)}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-600 font-medium">Permisos Únicos</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {modulos.reduce((sum, m) => sum + m.permisos.length, 0)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Módulos</p>
                <p className="text-2xl font-bold text-purple-900">{modulos.length}</p>
              </div>
            </div>

            {/* Roles Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((rol) => (
                <div key={rol.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{rol.nombre}</h4>
                      <p className="text-sm text-gray-600">{rol.descripcion}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditRole(rol)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRole(rol.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{rol.usuarios} usuarios</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {rol.permisos.includes('all') ? 'Todos' : rol.permisos.length} permisos
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-2">Permisos principales:</p>
                    <div className="flex flex-wrap gap-1">
                      {rol.permisos.includes('all') ? (
                        <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                          Acceso Total
                        </span>
                      ) : (
                        rol.permisos.slice(0, 3).map((permiso, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {permiso.split('.')[0]}
                          </span>
                        ))
                      )}
                      {rol.permisos.length > 3 && !rol.permisos.includes('all') && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          +{rol.permisos.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'permisos' && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Módulo / Permiso</th>
                    {roles.map((rol) => (
                      <th key={rol.id} className="text-center py-3 px-4 font-semibold text-gray-900">
                        {rol.nombre}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modulos.map((modulo, moduloIndex) => (
                    <React.Fragment key={moduloIndex}>
                      <tr className="bg-gray-50">
                        <td className="py-2 px-4 font-semibold text-gray-900" colSpan={roles.length + 1}>
                          {modulo.nombre}
                        </td>
                      </tr>
                      {modulo.permisos.map((permiso, permisoIndex) => (
                        <tr key={permisoIndex} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{permiso.nombre}</p>
                              <p className="text-sm text-gray-600">{permiso.descripcion}</p>
                            </div>
                          </td>
                          {roles.map((rol) => (
                            <td key={rol.id} className="py-2 px-4 text-center">
                              {hasPermission(rol.permisos, permiso.id) ? (
                                <Check className="w-5 h-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-red-400 mx-auto" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Nuevo/Editar Rol */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingRole ? 'Editar Rol' : 'Nuevo Rol'}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Rol *
                  </label>
                  <input
                    type="text"
                    defaultValue={editingRole?.nombre || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <input
                    type="text"
                    defaultValue={editingRole?.descripcion || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Permisos del Rol</h4>
                <div className="space-y-4">
                  {modulos.map((modulo, moduloIndex) => (
                    <div key={moduloIndex} className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">{modulo.nombre}</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {modulo.permisos.map((permiso, permisoIndex) => (
                          <label key={permisoIndex} className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              defaultChecked={editingRole ? hasPermission(editingRole.permisos, permiso.id) : false}
                              className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{permiso.nombre}</p>
                              <p className="text-xs text-gray-600">{permiso.descripcion}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {editingRole ? 'Actualizar' : 'Crear'} Rol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Permisos;