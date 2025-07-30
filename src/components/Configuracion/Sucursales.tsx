import React, { useState } from 'react';
import { Database, Plus, Edit, Trash2, Search, MapPin, Phone, Mail } from 'lucide-react';

const Sucursales: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [sucursales, setSucursales] = useState([
    {
      id: 1,
      nombre: 'Matriz',
      codigo: 'MTZ',
      direccion: 'Av. Industrial 123, Col. Norte, CP 64000, Monterrey, N.L.',
      telefono: '81-1234-5678',
      correo: 'matriz@empresa.com',
      gerente: 'Ing. Roberto Martínez',
      status: 'Activa',
      almacenes: 2,
      usuarios: 8,
      esPrincipal: true
    },
    {
      id: 2,
      nombre: 'Sucursal Norte',
      codigo: 'NTE',
      direccion: 'Blvd. Norte 456, Col. Industrial, CP 64100, Monterrey, N.L.',
      telefono: '81-2345-6789',
      correo: 'norte@empresa.com',
      gerente: 'Lic. Ana García',
      status: 'Activa',
      almacenes: 1,
      usuarios: 5,
      esPrincipal: false
    },
    {
      id: 3,
      nombre: 'Sucursal Sur',
      codigo: 'SUR',
      direccion: 'Av. Sur 789, Col. Centro, CP 64200, Monterrey, N.L.',
      telefono: '81-3456-7890',
      correo: 'sur@empresa.com',
      gerente: 'Ing. Carlos López',
      status: 'Activa',
      almacenes: 1,
      usuarios: 3,
      esPrincipal: false
    },
    {
      id: 4,
      nombre: 'Sucursal Centro',
      codigo: 'CTR',
      direccion: 'Calle Centro 321, Col. Histórico, CP 64000, Monterrey, N.L.',
      telefono: '81-4567-8901',
      correo: 'centro@empresa.com',
      gerente: 'Lic. María Rodríguez',
      status: 'Inactiva',
      almacenes: 1,
      usuarios: 0,
      esPrincipal: false
    }
  ]);

  const handleEdit = (sucursal: any) => {
    setEditingItem(sucursal);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    const sucursal = sucursales.find(s => s.id === id);
    if (sucursal?.esPrincipal) {
      alert('No se puede eliminar la sucursal principal');
      return;
    }
    if (confirm('¿Está seguro de eliminar esta sucursal?')) {
      setSucursales(sucursales.filter(s => s.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    if (editingItem) {
      setSucursales(sucursales.map(s => s.id === editingItem.id ? { ...s, ...formData } : s));
    } else {
      const newSucursal = {
        id: Math.max(...sucursales.map(s => s.id)) + 1,
        almacenes: 1,
        usuarios: 0,
        esPrincipal: false,
        ...formData
      };
      setSucursales([...sucursales, newSucursal]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const filteredSucursales = sucursales.filter(sucursal =>
    sucursal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sucursal.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sucursal.gerente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'Activa' 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Gestión de Sucursales</h3>
              <p className="text-sm text-gray-600">Administración de sucursales y puntos de venta</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Sucursal</span>
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
              placeholder="Buscar sucursales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Sucursales</p>
            <p className="text-2xl font-bold text-blue-900">{sucursales.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Sucursales Activas</p>
            <p className="text-2xl font-bold text-green-900">
              {sucursales.filter(s => s.status === 'Activa').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Total Almacenes</p>
            <p className="text-2xl font-bold text-yellow-900">
              {sucursales.reduce((sum, s) => sum + s.almacenes, 0)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Total Usuarios</p>
            <p className="text-2xl font-bold text-purple-900">
              {sucursales.reduce((sum, s) => sum + s.usuarios, 0)}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSucursales.map((sucursal) => (
            <div key={sucursal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{sucursal.nombre}</h4>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {sucursal.codigo}
                    </span>
                    {sucursal.esPrincipal && (
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                        Principal
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(sucursal.status)}`}>
                      {sucursal.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Gerente: {sucursal.gerente}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(sucursal)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {!sucursal.esPrincipal && (
                    <button
                      onClick={() => handleDelete(sucursal.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{sucursal.direccion}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{sucursal.telefono}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{sucursal.correo}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Almacenes:</p>
                    <p className="font-medium">{sucursal.almacenes}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Usuarios:</p>
                    <p className="font-medium">{sucursal.usuarios}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mapa de Sucursales */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Distribución de Sucursales</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sucursales.filter(s => s.status === 'Activa').map((sucursal) => (
              <div key={sucursal.id} className="bg-white p-3 rounded-lg text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  sucursal.esPrincipal ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  <Database className={`w-6 h-6 ${
                    sucursal.esPrincipal ? 'text-purple-600' : 'text-blue-600'
                  }`} />
                </div>
                <h5 className="font-medium text-gray-900">{sucursal.nombre}</h5>
                <p className="text-sm text-gray-600">{sucursal.usuarios} usuarios</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Editar Sucursal' : 'Nueva Sucursal'}
              </h3>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSave({
                nombre: formData.get('nombre'),
                codigo: formData.get('codigo'),
                direccion: formData.get('direccion'),
                telefono: formData.get('telefono'),
                correo: formData.get('correo'),
                gerente: formData.get('gerente'),
                status: formData.get('status') || 'Activa'
              });
            }}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Sucursal *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    defaultValue={editingItem?.nombre || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código *
                  </label>
                  <input
                    type="text"
                    name="codigo"
                    defaultValue={editingItem?.codigo || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <textarea
                    name="direccion"
                    rows={3}
                    defaultValue={editingItem?.direccion || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    defaultValue={editingItem?.telefono || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="correo"
                    defaultValue={editingItem?.correo || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gerente
                  </label>
                  <input
                    type="text"
                    name="gerente"
                    defaultValue={editingItem?.gerente || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={editingItem?.status || 'Activa'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Activa">Activa</option>
                    <option value="Inactiva">Inactiva</option>
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
                  {editingItem ? 'Actualizar' : 'Crear'} Sucursal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sucursales;