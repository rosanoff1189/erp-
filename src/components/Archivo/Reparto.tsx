import React, { useState } from 'react';
import { Map, Plus, Edit, Trash2, Search, MapPin } from 'lucide-react';

const Reparto: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [rutas, setRutas] = useState([
    { 
      id: 1, 
      zona: 'Norte', 
      descripcion: 'Colonias del norte de la ciudad',
      chofer: 'Juan Carlos Pérez',
      choferID: 1,
      vehiculo: 'ABC-123-45 (Ford Transit)',
      autoID: 1,
      status: 'Activo' 
    },
    { 
      id: 2, 
      zona: 'Sur', 
      descripcion: 'Zona sur y periférico',
      chofer: 'María Elena González',
      choferID: 2,
      vehiculo: 'XYZ-987-65 (Chevrolet NPR)',
      autoID: 2,
      status: 'Activo' 
    },
    { 
      id: 3, 
      zona: 'Centro', 
      descripcion: 'Centro histórico y comercial',
      chofer: 'Roberto Martínez',
      choferID: 3,
      vehiculo: 'DEF-456-78 (Isuzu ELF)',
      autoID: 3,
      status: 'Inactivo' 
    }
  ]);

  // Datos simulados para los dropdowns
  const choferes = [
    { id: 1, nombre: 'Juan Carlos Pérez' },
    { id: 2, nombre: 'María Elena González' },
    { id: 3, nombre: 'Roberto Martínez' }
  ];

  const vehiculos = [
    { id: 1, descripcion: 'ABC-123-45 (Ford Transit)' },
    { id: 2, descripcion: 'XYZ-987-65 (Chevrolet NPR)' },
    { id: 3, descripcion: 'DEF-456-78 (Isuzu ELF)' }
  ];

  const handleEdit = (ruta: any) => {
    setEditingItem(ruta);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar esta ruta de reparto?')) {
      setRutas(rutas.filter(r => r.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    const choferSeleccionado = choferes.find(c => c.id === parseInt(formData.choferID));
    const vehiculoSeleccionado = vehiculos.find(v => v.id === parseInt(formData.autoID));

    const dataToSave = {
      ...formData,
      choferID: parseInt(formData.choferID),
      autoID: parseInt(formData.autoID),
      chofer: choferSeleccionado?.nombre || '',
      vehiculo: vehiculoSeleccionado?.descripcion || ''
    };

    if (editingItem) {
      setRutas(rutas.map(r => r.id === editingItem.id ? { ...r, ...dataToSave } : r));
    } else {
      const newRuta = {
        id: Math.max(...rutas.map(r => r.id)) + 1,
        ...dataToSave
      };
      setRutas([...rutas, newRuta]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const filteredRutas = rutas.filter(ruta =>
    ruta.zona.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ruta.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ruta.chofer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Map className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Rutas de Reparto</h3>
              <p className="text-sm text-gray-600">Gestión de zonas y asignación de personal</p>
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
            <span>Nueva Ruta</span>
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
              placeholder="Buscar rutas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Rutas</p>
            <p className="text-2xl font-bold text-blue-900">{rutas.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Rutas Activas</p>
            <p className="text-2xl font-bold text-green-900">
              {rutas.filter(r => r.status === 'Activo').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Rutas Inactivas</p>
            <p className="text-2xl font-bold text-red-900">
              {rutas.filter(r => r.status === 'Inactivo').length}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRutas.map((ruta) => (
            <div key={ruta.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Zona {ruta.zona}</h4>
                    <p className="text-sm text-gray-600">{ruta.descripcion}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(ruta)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ruta.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Chofer asignado:</p>
                  <p className="text-sm font-medium text-gray-900">{ruta.chofer}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Vehículo:</p>
                  <p className="text-sm font-medium text-gray-900">{ruta.vehiculo}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  ruta.status === 'Activo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {ruta.status}
                </span>
                <span className="text-xs text-gray-500">ID: {ruta.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md m-4">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Editar Ruta' : 'Nueva Ruta'}
              </h3>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSave({
                zona: formData.get('zona'),
                descripcion: formData.get('descripcion'),
                choferID: formData.get('choferID'),
                autoID: formData.get('autoID'),
                status: formData.get('status') || 'Activo'
              });
            }}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona *
                  </label>
                  <input
                    type="text"
                    name="zona"
                    defaultValue={editingItem?.zona || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    rows={3}
                    defaultValue={editingItem?.descripcion || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chofer Asignado *
                  </label>
                  <select
                    name="choferID"
                    defaultValue={editingItem?.choferID || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar chofer...</option>
                    {choferes.map((chofer) => (
                      <option key={chofer.id} value={chofer.id}>
                        {chofer.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehículo Asignado *
                  </label>
                  <select
                    name="autoID"
                    defaultValue={editingItem?.autoID || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleccionar vehículo...</option>
                    {vehiculos.map((vehiculo) => (
                      <option key={vehiculo.id} value={vehiculo.id}>
                        {vehiculo.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={editingItem?.status || 'Activo'}
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
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reparto;