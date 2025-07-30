import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Search, Shield, Eye, EyeOff } from 'lucide-react';

const Usuarios: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: 'Administrador Sistema',
      email: 'admin@empresa.com',
      rol: 'Administrador',
      sucursal: 'Matriz',
      status: 'Activo',
      ultimoAcceso: '2024-01-17 14:30',
      fechaCreacion: '2023-01-01'
    },
    {
      id: 2,
      nombre: 'Carlos López Mendoza',
      email: 'carlos.lopez@empresa.com',
      rol: 'Vendedor',
      sucursal: 'Matriz',
      status: 'Activo',
      ultimoAcceso: '2024-01-17 12:15',
      fechaCreacion: '2023-02-15'
    },
    {
      id: 3,
      nombre: 'María García Silva',
      email: 'maria.garcia@empresa.com',
      rol: 'Almacenista',
      sucursal: 'Sucursal Norte',
      status: 'Activo',
      ultimoAcceso: '2024-01-17 09:45',
      fechaCreacion: '2023-03-10'
    },
    {
      id: 4,
      nombre: 'Juan Pérez Rodríguez',
      email: 'juan.perez@empresa.com',
      rol: 'Comprador',
      sucursal: 'Matriz',
      status: 'Inactivo',
      ultimoAcceso: '2024-01-10 16:20',
      fechaCreacion: '2023-01-20'
    }
  ]);

  const roles = ['Administrador', 'Vendedor', 'Almacenista', 'Comprador', 'Contador', 'Gerente'];
  const sucursales = ['Matriz', 'Sucursal Norte', 'Sucursal Sur', 'Sucursal Centro'];

  const handleEdit = (usuario: any) => {
    setEditingUser(usuario);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    if (editingUser) {
      setUsuarios(usuarios.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      const newUser = {
        id: Math.max(...usuarios.map(u => u.id)) + 1,
        ultimoAcceso: 'Nunca',
        fechaCreacion: new Date().toISOString().split('T')[0],
        ...formData
      };
      setUsuarios([...usuarios, newUser]);
    }
    setShowModal(false);
    setEditingUser(null);
  };

  const filteredUsuarios = usuarios.filter(usuario =>
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'Activo' 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const getRolColor = (rol: string) => {
    const colors = {
      'Administrador': 'bg-purple-100 text-purple-800',
      'Vendedor': 'bg-blue-100 text-blue-800',
      'Almacenista': 'bg-green-100 text-green-800',
      'Comprador': 'bg-yellow-100 text-yellow-800',
      'Contador': 'bg-indigo-100 text-indigo-800',
      'Gerente': 'bg-red-100 text-red-800'
    };
    return colors[rol as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h3>
              <p className="text-sm text-gray-600">Administración de cuentas de usuario del sistema</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingUser(null);
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Usuarios</p>
            <p className="text-2xl font-bold text-blue-900">{usuarios.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Usuarios Activos</p>
            <p className="text-2xl font-bold text-green-900">
              {usuarios.filter(u => u.status === 'Activo').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Roles Diferentes</p>
            <p className="text-2xl font-bold text-yellow-900">
              {new Set(usuarios.map(u => u.rol)).size}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Sucursales</p>
            <p className="text-2xl font-bold text-purple-900">
              {new Set(usuarios.map(u => u.sucursal)).size}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Usuario</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Rol</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Sucursal</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Último Acceso</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
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
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRolColor(usuario.rol)}`}>
                      {usuario.rol}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{usuario.sucursal}</td>
                  <td className="py-3 px-4 text-sm">{usuario.ultimoAcceso}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(usuario.status)}`}>
                      {usuario.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(usuario)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Editar usuario"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Ver permisos"
                      >
                        <Shield className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(usuario.id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Logs de Acceso Recientes */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Actividad Reciente</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white p-3 rounded-lg">
              <div>
                <span className="font-medium">Carlos López</span>
                <span className="text-gray-600 ml-2">inició sesión</span>
              </div>
              <span className="text-sm text-gray-500">Hace 2 horas</span>
            </div>
            <div className="flex items-center justify-between bg-white p-3 rounded-lg">
              <div>
                <span className="font-medium">María García</span>
                <span className="text-gray-600 ml-2">creó una nota de entrada</span>
              </div>
              <span className="text-sm text-gray-500">Hace 3 horas</span>
            </div>
            <div className="flex items-center justify-between bg-white p-3 rounded-lg">
              <div>
                <span className="font-medium">Administrador</span>
                <span className="text-gray-600 ml-2">modificó configuración</span>
              </div>
              <span className="text-sm text-gray-500">Hace 5 horas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSave({
                nombre: formData.get('nombre'),
                email: formData.get('email'),
                rol: formData.get('rol'),
                sucursal: formData.get('sucursal'),
                status: formData.get('status') || 'Activo'
              });
            }}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    defaultValue={editingUser?.nombre || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingUser?.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña {editingUser ? '' : '*'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={!editingUser}
                    placeholder={editingUser ? 'Dejar vacío para mantener actual' : ''}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol *
                  </label>
                  <select
                    name="rol"
                    defaultValue={editingUser?.rol || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar rol...</option>
                    {roles.map((rol) => (
                      <option key={rol} value={rol}>{rol}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sucursal *
                  </label>
                  <select
                    name="sucursal"
                    defaultValue={editingUser?.sucursal || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar sucursal...</option>
                    {sucursales.map((sucursal) => (
                      <option key={sucursal} value={sucursal}>{sucursal}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={editingUser?.status || 'Activo'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingUser ? 'Actualizar' : 'Crear'} Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;