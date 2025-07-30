import React, { useState } from 'react';
import { UserCheck, Plus, Edit, Trash2, Search, Mail, Phone, MapPin, TrendingUp } from 'lucide-react';

const Vendedores: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [vendedores, setVendedores] = useState([
    {
      id: 1,
      nombre: 'Carlos López Mendoza',
      status: 'Activo',
      telefono: '555-2001',
      correo: 'carlos.lopez@empresa.com',
      zona: 'Norte',
      comision: 3.5,
      ventasMes: 125000.00,
      metaMes: 150000.00,
      clientesAsignados: 25,
      fechaIngreso: '2023-01-15'
    },
    {
      id: 2,
      nombre: 'Ana Martínez Silva',
      status: 'Activo',
      telefono: '555-2002',
      correo: 'ana.martinez@empresa.com',
      zona: 'Sur',
      comision: 4.0,
      ventasMes: 145000.00,
      metaMes: 140000.00,
      clientesAsignados: 32,
      fechaIngreso: '2023-03-10'
    },
    {
      id: 3,
      nombre: 'José García Ruiz',
      status: 'Activo',
      telefono: '555-2003',
      correo: 'jose.garcia@empresa.com',
      zona: 'Centro',
      comision: 3.0,
      ventasMes: 98000.00,
      metaMes: 120000.00,
      clientesAsignados: 18,
      fechaIngreso: '2022-11-05'
    },
    {
      id: 4,
      nombre: 'Laura Rodríguez Vega',
      status: 'Vacaciones',
      telefono: '555-2004',
      correo: 'laura.rodriguez@empresa.com',
      zona: 'Oriente',
      comision: 3.5,
      ventasMes: 0.00,
      metaMes: 130000.00,
      clientesAsignados: 22,
      fechaIngreso: '2023-06-20'
    }
  ]);

  const zonas = ['Norte', 'Sur', 'Centro', 'Oriente', 'Poniente'];

  const handleEdit = (vendedor: any) => {
    setEditingItem(vendedor);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este vendedor?')) {
      setVendedores(vendedores.filter(v => v.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    if (editingItem) {
      setVendedores(vendedores.map(v => v.id === editingItem.id ? { ...v, ...formData } : v));
    } else {
      const newVendedor = {
        id: Math.max(...vendedores.map(v => v.id)) + 1,
        ventasMes: 0,
        clientesAsignados: 0,
        fechaIngreso: new Date().toISOString().split('T')[0],
        ...formData
      };
      setVendedores([...vendedores, newVendedor]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const filteredVendedores = vendedores.filter(vendedor =>
    vendedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendedor.zona.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendedor.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMetaProgress = (ventas: number, meta: number) => {
    const progress = meta > 0 ? (ventas / meta) * 100 : 0;
    return Math.min(progress, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activo':
        return 'bg-green-100 text-green-800';
      case 'Vacaciones':
        return 'bg-blue-100 text-blue-800';
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
            <UserCheck className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Catálogo de Vendedores</h3>
              <p className="text-sm text-gray-600">Gestión de equipo de ventas y comisiones</p>
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
            <span>Nuevo Vendedor</span>
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
              placeholder="Buscar vendedores por nombre, zona o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Vendedores</p>
            <p className="text-2xl font-bold text-blue-900">{vendedores.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Vendedores Activos</p>
            <p className="text-2xl font-bold text-green-900">
              {vendedores.filter(v => v.status === 'Activo').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Ventas del Mes</p>
            <p className="text-2xl font-bold text-yellow-900">
              ${vendedores.reduce((sum, v) => sum + v.ventasMes, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Comisiones</p>
            <p className="text-2xl font-bold text-purple-900">
              ${vendedores.reduce((sum, v) => sum + (v.ventasMes * v.comision / 100), 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredVendedores.map((vendedor) => {
            const metaProgress = getMetaProgress(vendedor.ventasMes, vendedor.metaMes);
            const comisionMes = vendedor.ventasMes * vendedor.comision / 100;
            
            return (
              <div key={vendedor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{vendedor.nombre}</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {vendedor.zona}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Comisión: {vendedor.comision}%</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(vendedor)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(vendedor.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{vendedor.telefono}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{vendedor.correo}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Meta del mes</span>
                    <span className="font-medium">{metaProgress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        metaProgress >= 100 ? 'bg-green-500' : 
                        metaProgress >= 80 ? 'bg-blue-500' : 
                        metaProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${metaProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>${vendedor.ventasMes.toLocaleString()}</span>
                    <span>${vendedor.metaMes.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Clientes:</p>
                      <p className="font-medium">{vendedor.clientesAsignados}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Comisión mes:</p>
                      <p className="font-medium text-green-600">${comisionMes.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Ingreso:</p>
                      <p className="text-sm font-medium">
                        {new Date(vendedor.fechaIngreso).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(vendedor.status)}`}>
                        {vendedor.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Editar Vendedor' : 'Nuevo Vendedor'}
              </h3>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSave({
                nombre: formData.get('nombre'),
                status: formData.get('status'),
                telefono: formData.get('telefono'),
                correo: formData.get('correo'),
                zona: formData.get('zona'),
                comision: parseFloat(formData.get('comision') as string) || 0,
                metaMes: parseFloat(formData.get('metaMes') as string) || 0,
                fechaIngreso: formData.get('fechaIngreso')
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
                    defaultValue={editingItem?.nombre || ''}
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
                    <option value="Vacaciones">Vacaciones</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona Asignada
                  </label>
                  <select
                    name="zona"
                    defaultValue={editingItem?.zona || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    {zonas.map((zona) => (
                      <option key={zona} value={zona}>{zona}</option>
                    ))}
                  </select>
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
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="correo"
                    defaultValue={editingItem?.correo || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comisión (%) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="comision"
                    defaultValue={editingItem?.comision || 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Mensual
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="metaMes"
                    defaultValue={editingItem?.metaMes || 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Ingreso
                  </label>
                  <input
                    type="date"
                    name="fechaIngreso"
                    defaultValue={editingItem?.fechaIngreso || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
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

export default Vendedores;