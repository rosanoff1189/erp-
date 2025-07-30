import React, { useState } from 'react';
import { User, Plus, Edit, Trash2, Search, Phone, Mail } from 'lucide-react';

const Choferes: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [choferes, setChoferes] = useState([
    { 
      id: 1, 
      nombre: 'Juan Carlos Pérez', 
      licencia: 'A1234567890', 
      telefono: '555-0123', 
      correo: 'juan.perez@empresa.com',
      fechaVencimiento: '2025-12-15',
      status: 'Activo' 
    },
    { 
      id: 2, 
      nombre: 'María Elena González', 
      licencia: 'B9876543210', 
      telefono: '555-0456', 
      correo: 'maria.gonzalez@empresa.com',
      fechaVencimiento: '2024-08-22',
      status: 'Activo' 
    },
    { 
      id: 3, 
      nombre: 'Roberto Martínez', 
      licencia: 'C5555666677', 
      telefono: '555-0789', 
      correo: 'roberto.martinez@empresa.com',
      fechaVencimiento: '2026-03-10',
      status: 'Inactivo' 
    }
  ]);

  const handleEdit = (chofer: any) => {
    setEditingItem(chofer);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este chofer?')) {
      setChoferes(choferes.filter(c => c.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    if (editingItem) {
      setChoferes(choferes.map(c => c.id === editingItem.id ? { ...c, ...formData } : c));
    } else {
      const newChofer = {
        id: Math.max(...choferes.map(c => c.id)) + 1,
        ...formData
      };
      setChoferes([...choferes, newChofer]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const filteredChoferes = choferes.filter(chofer =>
    chofer.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chofer.licencia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLicenseExpiringSoon = (fechaVencimiento: string) => {
    const today = new Date();
    const expiration = new Date(fechaVencimiento);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Choferes</h3>
              <p className="text-sm text-gray-600">Gestión de conductores y licencias</p>
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
            <span>Nuevo Chofer</span>
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
              placeholder="Buscar choferes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChoferes.map((chofer) => (
            <div key={chofer.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{chofer.nombre}</h4>
                    <p className="text-sm text-gray-600">Licencia: {chofer.licencia}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(chofer)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(chofer.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{chofer.telefono}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{chofer.correo}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Vence:</p>
                  <p className={`text-sm font-medium ${
                    isLicenseExpiringSoon(chofer.fechaVencimiento) 
                      ? 'text-red-600' 
                      : 'text-gray-900'
                  }`}>
                    {new Date(chofer.fechaVencimiento).toLocaleDateString()}
                    {isLicenseExpiringSoon(chofer.fechaVencimiento) && (
                      <span className="ml-1 text-xs">⚠️</span>
                    )}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  chofer.status === 'Activo'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {chofer.status}
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
                {editingItem ? 'Editar Chofer' : 'Nuevo Chofer'}
              </h3>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSave({
                nombre: formData.get('nombre'),
                licencia: formData.get('licencia'),
                telefono: formData.get('telefono'),
                correo: formData.get('correo'),
                fechaVencimiento: formData.get('fechaVencimiento'),
                status: formData.get('status') || 'Activo'
              });
            }}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
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
                    Número de Licencia *
                  </label>
                  <input
                    type="text"
                    name="licencia"
                    defaultValue={editingItem?.licencia || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    defaultValue={editingItem?.telefono || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
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
                    Fecha de Vencimiento *
                  </label>
                  <input
                    type="date"
                    name="fechaVencimiento"
                    defaultValue={editingItem?.fechaVencimiento || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
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

export default Choferes;