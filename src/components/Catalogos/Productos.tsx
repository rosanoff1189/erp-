import React, { useState } from 'react';
import { Package, Plus, Edit, Trash2, Search, Filter, Eye } from 'lucide-react';

const Productos: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLinea, setFilterLinea] = useState('all');

  const [productos, setProductos] = useState([
    {
      id: 1,
      codigo: 'VT-6MM-001',
      descripcion: 'Vidrio Templado 6mm Transparente',
      status: 'Activo',
      linea: 'Vidrios',
      ubicacion: 'A-01-15',
      unidadSAT: 'M2',
      precioBase: 350.00,
      costo: 210.00,
      stockMin: 50,
      stockMax: 500,
      stockActual: 125
    },
    {
      id: 2,
      codigo: 'AL-NAT-001',
      descripcion: 'Perfil Aluminio Natural 2x1',
      status: 'Activo',
      linea: 'Perfiles',
      ubicacion: 'B-02-08',
      unidadSAT: 'PZA',
      precioBase: 145.50,
      costo: 87.30,
      stockMin: 100,
      stockMax: 1000,
      stockActual: 320
    },
    {
      id: 3,
      codigo: 'VL-8MM-001',
      descripcion: 'Vidrio Laminado 8mm Seguridad',
      status: 'Activo',
      linea: 'Vidrios',
      ubicacion: 'A-03-22',
      unidadSAT: 'M2',
      precioBase: 520.00,
      costo: 312.00,
      stockMin: 30,
      stockMax: 300,
      stockActual: 85
    }
  ]);

  const lineas = ['Vidrios', 'Perfiles', 'Herrajes', 'Accesorios'];

  const handleEdit = (producto: any) => {
    setEditingItem(producto);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este producto?')) {
      setProductos(productos.filter(p => p.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    if (editingItem) {
      setProductos(productos.map(p => p.id === editingItem.id ? { ...p, ...formData } : p));
    } else {
      const newProducto = {
        id: Math.max(...productos.map(p => p.id)) + 1,
        stockActual: Math.floor(Math.random() * 200) + 50,
        ...formData
      };
      setProductos([...productos, newProducto]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const filteredProductos = productos.filter(producto => {
    const matchesSearch = 
      producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterLinea === 'all' || producto.linea === filterLinea;
    return matchesSearch && matchesFilter;
  });

  const getStockStatus = (actual: number, min: number, max: number) => {
    if (actual <= min) return { status: 'low', color: 'text-red-600 bg-red-50', label: 'Bajo' };
    if (actual >= max * 0.8) return { status: 'high', color: 'text-blue-600 bg-blue-50', label: 'Alto' };
    return { status: 'normal', color: 'text-green-600 bg-green-50', label: 'Normal' };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Catálogo de Productos</h3>
              <p className="text-sm text-gray-600">Gestión de inventario y precios</p>
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
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterLinea}
            onChange={(e) => setFilterLinea(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las líneas</option>
            {lineas.map((linea) => (
              <option key={linea} value={linea}>{linea}</option>
            ))}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Productos</p>
            <p className="text-2xl font-bold text-blue-900">{productos.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Productos Activos</p>
            <p className="text-2xl font-bold text-green-900">
              {productos.filter(p => p.status === 'Activo').length}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-red-600 font-medium">Stock Bajo</p>
            <p className="text-2xl font-bold text-red-900">
              {productos.filter(p => p.stockActual <= p.stockMin).length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Valor Inventario</p>
            <p className="text-2xl font-bold text-yellow-900">
              ${productos.reduce((sum, p) => sum + (p.stockActual * p.costo), 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Código</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Descripción</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Línea</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Precio</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductos.map((producto) => {
                const stockInfo = getStockStatus(producto.stockActual, producto.stockMin, producto.stockMax);
                return (
                  <tr key={producto.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">{producto.codigo}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{producto.descripcion}</p>
                        <p className="text-sm text-gray-500">Ubicación: {producto.ubicacion}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {producto.linea}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{producto.stockActual} {producto.unidadSAT}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${stockInfo.color}`}>
                          {stockInfo.label}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">${producto.precioBase.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Costo: ${producto.costo.toFixed(2)}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        producto.status === 'Activo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {producto.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(producto)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(producto.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl m-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSave({
                codigo: formData.get('codigo'),
                descripcion: formData.get('descripcion'),
                status: formData.get('status'),
                linea: formData.get('linea'),
                ubicacion: formData.get('ubicacion'),
                unidadSAT: formData.get('unidadSAT'),
                precioBase: parseFloat(formData.get('precioBase') as string),
                costo: parseFloat(formData.get('costo') as string),
                stockMin: parseInt(formData.get('stockMin') as string),
                stockMax: parseInt(formData.get('stockMax') as string)
              });
            }}>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <input
                    type="text"
                    name="descripcion"
                    defaultValue={editingItem?.descripcion || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Línea de Producción
                  </label>
                  <select
                    name="linea"
                    defaultValue={editingItem?.linea || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar...</option>
                    {lineas.map((linea) => (
                      <option key={linea} value={linea}>{linea}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    name="ubicacion"
                    defaultValue={editingItem?.ubicacion || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="A-01-15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unidad SAT
                  </label>
                  <select
                    name="unidadSAT"
                    defaultValue={editingItem?.unidadSAT || 'PZA'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="PZA">Pieza</option>
                    <option value="M2">Metro Cuadrado</option>
                    <option value="KG">Kilogramo</option>
                    <option value="M">Metro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Base *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="precioBase"
                    defaultValue={editingItem?.precioBase || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="costo"
                    defaultValue={editingItem?.costo || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    name="stockMin"
                    defaultValue={editingItem?.stockMin || 0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Máximo
                  </label>
                  <input
                    type="number"
                    name="stockMax"
                    defaultValue={editingItem?.stockMax || 0}
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

export default Productos;