import React, { useState } from 'react';
import { Palette, Plus, Edit, Trash2, Search } from 'lucide-react';

const AcabadosAluminio: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [acabados, setAcabados] = useState([
    { id: 1, nombre: 'Natural', descripcion: 'Aluminio sin tratamiento superficial', color: '#C0C0C0', status: 'Activo' },
    { id: 2, nombre: 'Anodizado Plata', descripcion: 'Acabado anodizado color plata', color: '#E5E5E5', status: 'Activo' },
    { id: 3, nombre: 'Anodizado Oro', descripcion: 'Acabado anodizado color oro', color: '#FFD700', status: 'Activo' },
    { id: 4, nombre: 'Anodizado Bronce', descripcion: 'Acabado anodizado color bronce', color: '#CD7F32', status: 'Activo' },
    { id: 5, nombre: 'Anodizado Negro', descripcion: 'Acabado anodizado color negro', color: '#2C2C2C', status: 'Activo' },
    { id: 6, nombre: 'Pintado Blanco', descripcion: 'Pintura electroestática blanca', color: '#FFFFFF', status: 'Activo' }
  ]);

  const handleEdit = (acabado: any) => {
    setEditingItem(acabado);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este acabado?')) {
      setAcabados(acabados.filter(a => a.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    if (editingItem) {
      setAcabados(acabados.map(a => a.id === editingItem.id ? { ...a, ...formData } : a));
    } else {
      const newAcabado = {
        id: Math.max(...acabados.map(a => a.id)) + 1,
        ...formData
      };
      setAcabados([...acabados, newAcabado]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const filteredAcabados = acabados.filter(acabado =>
    acabado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acabado.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Palette className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Acabados de Aluminio</h3>
              <p className="text-sm text-gray-600">Catálogo de acabados y colores disponibles</p>
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
            <span>Nuevo Acabado</span>
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
              placeholder="Buscar acabados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAcabados.map((acabado) => (
            <div key={acabado.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: acabado.color }}
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(acabado)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(acabado.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{acabado.nombre}</h4>
              <p className="text-sm text-gray-600 mb-3">{acabado.descripcion}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{acabado.color}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  acabado.status === 'Activo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {acabado.status}
                </span>
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
                {editingItem ? 'Editar Acabado' : 'Nuevo Acabado'}
              </h3>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSave({
                nombre: formData.get('nombre'),
                descripcion: formData.get('descripcion'),
                color: formData.get('color'),
                status: formData.get('status') || 'Activo'
              });
            }}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
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
                    Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      name="color"
                      defaultValue={editingItem?.color || '#C0C0C0'}
                      className="w-12 h-10 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      defaultValue={editingItem?.color || '#C0C0C0'}
                      onChange={(e) => {
                        const colorInput = e.target.previousElementSibling as HTMLInputElement;
                        if (colorInput) colorInput.value = e.target.value;
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#FFFFFF"
                    />
                  </div>
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

export default AcabadosAluminio;