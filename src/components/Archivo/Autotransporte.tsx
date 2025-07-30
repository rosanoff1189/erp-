import React, { useState } from 'react';
import { Truck, Plus, Edit, Trash2, Search } from 'lucide-react';

const Autotransporte: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [vehiculos, setVehiculos] = useState([
    { 
      id: 1, 
      placas: 'ABC-123-45', 
      marca: 'Ford', 
      modelo: 'Transit', 
      año: 2023,
      capacidad: '3.5 Ton', 
      tipo: 'Camioneta',
      polizaSeguro: 'POL-2024-001',
      venceSeguro: '2024-12-31',
      status: 'Activo' 
    },
    { 
      id: 2, 
      placas: 'XYZ-987-65', 
      marca: 'Chevrolet', 
      modelo: 'NPR', 
      año: 2022,
      capacidad: '5 Ton', 
      tipo: 'Camión',
      polizaSeguro: 'POL-2024-002',
      venceSeguro: '2024-10-15',
      status: 'Activo' 
    },
    { 
      id: 3, 
      placas: 'DEF-456-78', 
      marca: 'Isuzu', 
      modelo: 'ELF', 
      año: 2021,
      capacidad: '7 Ton', 
      tipo: 'Camión',
      polizaSeguro: 'POL-2024-003',
      venceSeguro: '2024-08-20',
      status: 'Mantenimiento' 
    }
  ]);

  const handleEdit = (vehiculo: any) => {
    setEditingItem(vehiculo);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este vehículo?')) {
      setVehiculos(vehiculos.filter(v => v.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    if (editingItem) {
      setVehiculos(vehiculos.map(v => v.id === editingItem.id ? { ...v, ...formData } : v));
    } else {
      const newVehiculo = {
        id: Math.max(...vehiculos.map(v => v.id)) + 1,
        ...formData
      };
      setVehiculos([...vehiculos, newVehiculo]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const filteredVehiculos = vehiculos.filter(vehiculo =>
    vehiculo.placas.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isInsuranceExpiringSoon = (venceSeguro: string) => {
    const today = new Date();
    const expiration = new Date(venceSeguro);
    const diffTime = expiration.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo':
        return 'bg-green-100 text-green-800';
      case 'Mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'Inactivo':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Truck className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Autotransporte</h3>
              <p className="text-sm text-gray-600">Gestión de flota vehicular</p>
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
            <span>Nuevo Vehículo</span>
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
              placeholder="Buscar vehículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Vehículos</p>
            <p className="text-2xl font-bold text-blue-900">{vehiculos.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Activos</p>
            <p className="text-2xl font-bold text-green-900">
              {vehiculos.filter(v => v.status === 'Activo').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Mantenimiento</p>
            <p className="text-2xl font-bold text-yellow-900">
              {vehiculos.filter(v => v.status === 'Mantenimiento').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Seguros por Vencer</p>
            <p className="text-2xl font-bold text-red-900">
              {vehiculos.filter(v => isInsuranceExpiringSoon(v.venceSeguro)).length}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehiculos.map((vehiculo) => (
            <div key={vehiculo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{vehiculo.placas}</h4>
                    <p className="text-sm text-gray-600">
                      {vehiculo.marca} {vehiculo.modelo} {vehiculo.año}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(vehiculo)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(vehiculo.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium">{vehiculo.tipo}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacidad:</span>
                  <span className="font-medium">{vehiculo.capacidad}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Seguro:</span>
                  <span className={`font-medium ${
                    isInsuranceExpiringSoon(vehiculo.venceSeguro) 
                      ? 'text-red-600' 
                      : 'text-gray-900'
                  }`}>
                    {new Date(vehiculo.venceSeguro).toLocaleDateString()}
                    {isInsuranceExpiringSoon(vehiculo.venceSeguro) && (
                      <span className="ml-1">⚠️</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vehiculo.status)}`}>
                  {vehiculo.status}
                </span>
                <span className="text-xs text-gray-500">{vehiculo.polizaSeguro}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl m-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Editar Vehículo' : 'Nuevo Vehículo'}
              </h3>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSave({
                placas: formData.get('placas'),
                marca: formData.get('marca'),
                modelo: formData.get('modelo'),
                año: parseInt(formData.get('año') as string),
                capacidad: formData.get('capacidad'),
                tipo: formData.get('tipo'),
                polizaSeguro: formData.get('polizaSeguro'),
                venceSeguro: formData.get('venceSeguro'),
                status: formData.get('status') || 'Activo'
              });
            }}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Placas *
                  </label>
                  <input
                    type="text"
                    name="placas"
                    defaultValue={editingItem?.placas || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marca *
                  </label>
                  <input
                    type="text"
                    name="marca"
                    defaultValue={editingItem?.marca || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    name="modelo"
                    defaultValue={editingItem?.modelo || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año *
                  </label>
                  <input
                    type="number"
                    name="año"
                    defaultValue={editingItem?.año || new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacidad *
                  </label>
                  <input
                    type="text"
                    name="capacidad"
                    defaultValue={editingItem?.capacidad || ''}
                    placeholder="ej: 3.5 Ton"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    name="tipo"
                    defaultValue={editingItem?.tipo || 'Camioneta'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Camioneta">Camioneta</option>
                    <option value="Camión">Camión</option>
                    <option value="Tráiler">Tráiler</option>
                    <option value="Van">Van</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Póliza de Seguro
                  </label>
                  <input
                    type="text"
                    name="polizaSeguro"
                    defaultValue={editingItem?.polizaSeguro || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vencimiento Seguro
                  </label>
                  <input
                    type="date"
                    name="venceSeguro"
                    defaultValue={editingItem?.venceSeguro || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={editingItem?.status || 'Activo'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Mantenimiento">Mantenimiento</option>
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

export default Autotransporte;