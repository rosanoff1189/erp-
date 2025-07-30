import React, { useState } from 'react';
import { Calculator, Plus, Edit, Trash2, Search } from 'lucide-react';

const ConfiguracionMateriales: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [materiales, setMateriales] = useState([
    {
      id: 1,
      nombre: 'Vidrio Templado 6mm',
      tipo: 'Vidrio',
      ancho_estandar: 2440,
      alto_estandar: 1220,
      espesor: 6,
      costo_m2: 350.00,
      proveedor: 'Vidrios del Norte',
      status: 'Activo'
    },
    {
      id: 2,
      nombre: 'Lámina Aluminio Natural',
      tipo: 'Aluminio',
      ancho_estandar: 3000,
      alto_estandar: 1500,
      espesor: 3,
      costo_m2: 145.50,
      proveedor: 'Aluminios Industriales',
      status: 'Activo'
    },
    {
      id: 3,
      nombre: 'Lámina Acero Galvanizado',
      tipo: 'Acero',
      ancho_estandar: 2000,
      alto_estandar: 1000,
      espesor: 2,
      costo_m2: 89.50,
      proveedor: 'Aceros del Norte',
      status: 'Activo'
    }
  ]);

  const handleEdit = (material: any) => {
    setEditingItem(material);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este material?')) {
      setMateriales(materiales.filter(m => m.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    if (editingItem) {
      setMateriales(materiales.map(m => m.id === editingItem.id ? { ...m, ...formData } : m));
    } else {
      const newMaterial = {
        id: Math.max(...materiales.map(m => m.id)) + 1,
        ...formData
      };
      setMateriales([...materiales, newMaterial]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const filteredMateriales = materiales.filter(material =>
    material.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'Vidrio':
        return 'bg-blue-100 text-blue-800';
      case 'Aluminio':
        return 'bg-green-100 text-green-800';
      case 'Acero':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calculator className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Configuración de Materiales</h3>
              <p className="text-sm text-gray-600">Gestión de materiales base para optimización</p>
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
            <span>Nuevo Material</span>
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
              placeholder="Buscar materiales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Materiales</p>
            <p className="text-2xl font-bold text-blue-900">{materiales.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Tipos Diferentes</p>
            <p className="text-2xl font-bold text-green-900">
              {new Set(materiales.map(m => m.tipo)).size}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Materiales Activos</p>
            <p className="text-2xl font-bold text-purple-900">
              {materiales.filter(m => m.status === 'Activo').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Costo Promedio</p>
            <p className="text-2xl font-bold text-yellow-900">
              ${(materiales.reduce((sum, m) => sum + m.costo_m2, 0) / materiales.length).toFixed(0)}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredMateriales.map((material) => (
            <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{material.nombre}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(material.tipo)}`}>
                      {material.tipo}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Proveedor: {material.proveedor}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(material)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(material.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Dimensiones Estándar:</p>
                  <p className="font-medium">{material.ancho_estandar} x {material.alto_estandar} mm</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Espesor:</p>
                  <p className="font-medium">{material.espesor} mm</p>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">Costo por m²:</p>
                    <p className="text-lg font-bold text-green-600">${material.costo_m2.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Área estándar:</p>
                    <p className="font-medium">
                      {((material.ancho_estandar * material.alto_estandar) / 1000000).toFixed(2)} m²
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Editar Material' : 'Nuevo Material'}
              </h3>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSave({
                nombre: formData.get('nombre'),
                tipo: formData.get('tipo'),
                ancho_estandar: parseInt(formData.get('ancho_estandar') as string),
                alto_estandar: parseInt(formData.get('alto_estandar') as string),
                espesor: parseFloat(formData.get('espesor') as string),
                costo_m2: parseFloat(formData.get('costo_m2') as string),
                proveedor: formData.get('proveedor'),
                status: formData.get('status') || 'Activo'
              });
            }}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Material *
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
                    Tipo *
                  </label>
                  <select
                    name="tipo"
                    defaultValue={editingItem?.tipo || 'Vidrio'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Vidrio">Vidrio</option>
                    <option value="Aluminio">Aluminio</option>
                    <option value="Acero">Acero</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proveedor
                  </label>
                  <input
                    type="text"
                    name="proveedor"
                    defaultValue={editingItem?.proveedor || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ancho Estándar (mm) *
                  </label>
                  <input
                    type="number"
                    name="ancho_estandar"
                    defaultValue={editingItem?.ancho_estandar || 2440}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alto Estándar (mm) *
                  </label>
                  <input
                    type="number"
                    name="alto_estandar"
                    defaultValue={editingItem?.alto_estandar || 1220}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Espesor (mm) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="espesor"
                    defaultValue={editingItem?.espesor || 6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo por m² *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="costo_m2"
                    defaultValue={editingItem?.costo_m2 || 0}
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

export default ConfiguracionMateriales;