import React, { useState } from 'react';
import { Briefcase, Plus, Edit, Trash2, Search, Mail, Phone, MapPin } from 'lucide-react';

const Proveedores: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [proveedores, setProveedores] = useState([
    {
      id: 1,
      nombre: 'Aluminios Industriales S.A.',
      rfc: 'AIN123456789',
      status: 'Activo',
      telefono: '555-1001',
      correo: 'ventas@aluminiosindustriales.com',
      direccion: 'Zona Industrial Norte, Lote 15',
      saldo: 125430.50,
      metodoPagoHabitual: 'Transferencia',
      condicionesCredito: '30 días',
      contacto: 'Ing. María López',
      categoria: 'Materia Prima'
    },
    {
      id: 2,
      nombre: 'Vidrios y Cristales del Bajío',
      rfc: 'VCB890123456',
      status: 'Activo',
      telefono: '555-1002',
      correo: 'compras@vidriosbajio.com',
      direccion: 'Carretera Nacional Km 45',
      saldo: 89750.00,
      metodoPagoHabitual: 'Cheque',
      condicionesCredito: '15 días',
      contacto: 'Lic. Carlos Ramírez',
      categoria: 'Vidrio'
    },
    {
      id: 3,
      nombre: 'Herrajes y Accesorios Premium',
      rfc: 'HAP850429AB1',
      status: 'Activo',
      telefono: '555-1003',
      correo: 'info@herrajespremium.com',
      direccion: 'Boulevard de la Industria 234',
      saldo: 45200.00,
      metodoPagoHabitual: 'Efectivo',
      condicionesCredito: 'Contado',
      contacto: 'Sr. Jorge Mendoza',
      categoria: 'Herrajes'
    }
  ]);

  const categorias = ['Materia Prima', 'Vidrio', 'Herrajes', 'Herramientas', 'Servicios'];

  const handleEdit = (proveedor: any) => {
    setEditingItem(proveedor);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este proveedor?')) {
      setProveedores(proveedores.filter(p => p.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    if (editingItem) {
      setProveedores(proveedores.map(p => p.id === editingItem.id ? { ...p, ...formData } : p));
    } else {
      const newProveedor = {
        id: Math.max(...proveedores.map(p => p.id)) + 1,
        ...formData
      };
      setProveedores([...proveedores, newProveedor]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSaldoColor = (saldo: number) => {
    if (saldo > 100000) return 'text-red-600';
    if (saldo > 50000) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Catálogo de Proveedores</h3>
              <p className="text-sm text-gray-600">Gestión de cuentas por pagar y condiciones comerciales</p>
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
            <span>Nuevo Proveedor</span>
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
              placeholder="Buscar proveedores por nombre, RFC o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Proveedores</p>
            <p className="text-2xl font-bold text-blue-900">{proveedores.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Proveedores Activos</p>
            <p className="text-2xl font-bold text-green-900">
              {proveedores.filter(p => p.status === 'Activo').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Con Crédito</p>
            <p className="text-2xl font-bold text-yellow-900">
              {proveedores.filter(p => p.condicionesCredito !== 'Contado').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">CxP Total</p>
            <p className="text-2xl font-bold text-red-900">
              ${proveedores.reduce((sum, p) => sum + p.saldo, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProveedores.map((proveedor) => (
            <div key={proveedor.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{proveedor.nombre}</h4>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {proveedor.categoria}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-mono">{proveedor.rfc}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(proveedor)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(proveedor.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{proveedor.telefono}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{proveedor.correo}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{proveedor.direccion}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Contacto:</p>
                    <p className="font-medium">{proveedor.contacto}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Crédito:</p>
                    <p className="font-medium">{proveedor.condicionesCredito}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Saldo CxP:</p>
                    <p className={`font-bold ${getSaldoColor(proveedor.saldo)}`}>
                      ${proveedor.saldo.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Pago habitual:</p>
                    <p className="font-medium text-sm">{proveedor.metodoPagoHabitual}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      proveedor.status === 'Activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {proveedor.status}
                    </span>
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </h3>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSave({
                nombre: formData.get('nombre'),
                rfc: formData.get('rfc'),
                status: formData.get('status'),
                telefono: formData.get('telefono'),
                correo: formData.get('correo'),
                direccion: formData.get('direccion'),
                saldo: parseFloat(formData.get('saldo') as string) || 0,
                metodoPagoHabitual: formData.get('metodoPagoHabitual'),
                condicionesCredito: formData.get('condicionesCredito'),
                contacto: formData.get('contacto'),
                categoria: formData.get('categoria')
              });
            }}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razón Social *
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
                    RFC *
                  </label>
                  <input
                    type="text"
                    name="rfc"
                    defaultValue={editingItem?.rfc || ''}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    name="categoria"
                    defaultValue={editingItem?.categoria || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contacto Principal
                  </label>
                  <input
                    type="text"
                    name="contacto"
                    defaultValue={editingItem?.contacto || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección
                  </label>
                  <textarea
                    name="direccion"
                    rows={2}
                    defaultValue={editingItem?.direccion || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saldo Actual CxP
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="saldo"
                    defaultValue={editingItem?.saldo || 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago Habitual
                  </label>
                  <select
                    name="metodoPagoHabitual"
                    defaultValue={editingItem?.metodoPagoHabitual || 'Transferencia'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condiciones de Crédito
                  </label>
                  <select
                    name="condicionesCredito"
                    defaultValue={editingItem?.condicionesCredito || 'Contado'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Contado">Contado</option>
                    <option value="15 días">15 días</option>
                    <option value="30 días">30 días</option>
                    <option value="45 días">45 días</option>
                    <option value="60 días">60 días</option>
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

export default Proveedores;