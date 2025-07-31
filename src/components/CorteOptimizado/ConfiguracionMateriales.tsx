import React, { useState } from 'react';
import { Calculator, Plus, Edit, Trash2, Search, Upload, Download, Copy, Settings } from 'lucide-react';

interface MaterialConfig {
  id: number;
  nombre: string;
  tipo: string;
  ancho_estandar: number;
  alto_estandar: number;
  espesor: number;
  costo_m2: number;
  proveedor: string;
  status: string;
  tolerancia_sierra: number;
  densidad?: number;
  peso_m2?: number;
  disponible_stock: boolean;
  tiempo_entrega_dias: number;
  descuento_volumen?: number;
  observaciones?: string;
}

const ConfiguracionMateriales: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MaterialConfig | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('all');
  const [showImportModal, setShowImportModal] = useState(false);

  const [materiales, setMateriales] = useState<MaterialConfig[]>([
    {
      id: 1,
      nombre: 'Vidrio Templado 6mm Transparente',
      tipo: 'Vidrio',
      ancho_estandar: 2440,
      alto_estandar: 1220,
      espesor: 6,
      costo_m2: 350.00,
      proveedor: 'Vidrios del Norte S.A.',
      status: 'Activo',
      tolerancia_sierra: 3,
      densidad: 2.5,
      peso_m2: 15.0,
      disponible_stock: true,
      tiempo_entrega_dias: 3,
      descuento_volumen: 5.0,
      observaciones: 'Material premium para proyectos residenciales'
    },
    {
      id: 2,
      nombre: 'Lámina Aluminio Natural 3mm',
      tipo: 'Aluminio',
      ancho_estandar: 3000,
      alto_estandar: 1500,
      espesor: 3,
      costo_m2: 145.50,
      proveedor: 'Aluminios Industriales S.A.',
      status: 'Activo',
      tolerancia_sierra: 2,
      densidad: 2.7,
      peso_m2: 8.1,
      disponible_stock: true,
      tiempo_entrega_dias: 5,
      descuento_volumen: 8.0,
      observaciones: 'Ideal para cancelería comercial'
    },
    {
      id: 3,
      nombre: 'Lámina Acero Galvanizado 2mm',
      tipo: 'Acero',
      ancho_estandar: 2000,
      alto_estandar: 1000,
      espesor: 2,
      costo_m2: 89.50,
      proveedor: 'Aceros del Norte',
      status: 'Activo',
      tolerancia_sierra: 1.5,
      densidad: 7.85,
      peso_m2: 15.7,
      disponible_stock: false,
      tiempo_entrega_dias: 7,
      descuento_volumen: 10.0,
      observaciones: 'Requiere pedido anticipado'
    },
    {
      id: 4,
      nombre: 'Vidrio Laminado 8mm Seguridad',
      tipo: 'Vidrio',
      ancho_estandar: 2440,
      alto_estandar: 1220,
      espesor: 8,
      costo_m2: 520.00,
      proveedor: 'Vidrios Especiales',
      status: 'Activo',
      tolerancia_sierra: 4,
      densidad: 2.5,
      peso_m2: 20.0,
      disponible_stock: true,
      tiempo_entrega_dias: 5,
      descuento_volumen: 3.0,
      observaciones: 'Para aplicaciones de seguridad'
    },
    {
      id: 5,
      nombre: 'Perfil Aluminio Anodizado',
      tipo: 'Aluminio',
      ancho_estandar: 6000,
      alto_estandar: 100,
      espesor: 2.5,
      costo_m2: 185.50,
      proveedor: 'Perfiles Premium',
      status: 'Activo',
      tolerancia_sierra: 1,
      densidad: 2.7,
      peso_m2: 6.75,
      disponible_stock: true,
      tiempo_entrega_dias: 2,
      descuento_volumen: 12.0,
      observaciones: 'Perfil lineal, cálculo por metro'
    }
  ]);

  const handleEdit = (material: MaterialConfig) => {
    setEditingItem(material);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Está seguro de eliminar este material?')) {
      setMateriales(materiales.filter(m => m.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    const materialData = {
      ...formData,
      peso_m2: formData.densidad * formData.espesor * 1000 / 1000000 // Cálculo automático
    };

    if (editingItem) {
      setMateriales(materiales.map(m => m.id === editingItem.id ? { ...m, ...materialData } : m));
    } else {
      const newMaterial = {
        id: Math.max(...materiales.map(m => m.id)) + 1,
        ...materialData
      };
      setMateriales([...materiales, newMaterial]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const duplicarMaterial = (material: MaterialConfig) => {
    const duplicado = {
      ...material,
      id: Math.max(...materiales.map(m => m.id)) + 1,
      nombre: `${material.nombre} (Copia)`,
      status: 'Inactivo'
    };
    setMateriales([...materiales, duplicado]);
  };

  const filteredMateriales = materiales.filter(material => {
    const matchesSearch = 
      material.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.proveedor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTipo = filterTipo === 'all' || material.tipo === filterTipo;
    
    return matchesSearch && matchesTipo;
  });

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

  const getStatusColor = (status: string) => {
    return status === 'Activo' 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const exportarCatalogo = (formato: string) => {
    alert(`Exportando catálogo de materiales en formato ${formato}`);
  };

  const importarMateriales = () => {
    setShowImportModal(true);
  };

  // Estadísticas calculadas
  const totalMateriales = materiales.length;
  const materialesActivos = materiales.filter(m => m.status === 'Activo').length;
  const tiposUnicos = new Set(materiales.map(m => m.tipo)).size;
  const costoPromedio = materiales.reduce((sum, m) => sum + m.costo_m2, 0) / materiales.length;
  const materialesEnStock = materiales.filter(m => m.disponible_stock).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calculator className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Configuración de Materiales</h3>
              <p className="text-sm text-gray-600">Gestión completa de materiales base para optimización de cortes</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={importarMateriales}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Importar</span>
            </button>
            <button
              onClick={() => exportarCatalogo('Excel')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </button>
            <button
              onClick={() => {
                setEditingItem(null);
                setShowModal(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Material</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          <div>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="Vidrio">Vidrio</option>
              <option value="Aluminio">Aluminio</option>
              <option value="Acero">Acero</option>
            </select>
          </div>
          <div>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">Todos los proveedores</option>
              <option value="vidrios">Vidrios del Norte</option>
              <option value="aluminios">Aluminios Industriales</option>
              <option value="aceros">Aceros del Norte</option>
            </select>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Total Materiales</p>
            <p className="text-2xl font-bold text-blue-900">{totalMateriales}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Materiales Activos</p>
            <p className="text-2xl font-bold text-green-900">{materialesActivos}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Tipos Diferentes</p>
            <p className="text-2xl font-bold text-purple-900">{tiposUnicos}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Costo Promedio</p>
            <p className="text-2xl font-bold text-yellow-900">${costoPromedio.toFixed(0)}</p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg">
            <p className="text-sm text-teal-600 font-medium">En Stock</p>
            <p className="text-2xl font-bold text-teal-900">{materialesEnStock}</p>
          </div>
        </div>

        {/* Cards de Materiales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredMateriales.map((material) => (
            <div key={material.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{material.nombre}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTipoColor(material.tipo)}`}>
                      {material.tipo}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Proveedor: {material.proveedor}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(material.status)}`}>
                      {material.status}
                    </span>
                    {material.disponible_stock ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        En Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Sin Stock
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => duplicarMaterial(material)}
                    className="p-1 text-gray-600 hover:text-gray-800"
                    title="Duplicar material"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(material)}
                    className="p-1 text-blue-600 hover:text-blue-800"
                    title="Editar material"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(material.id)}
                    className="p-1 text-red-600 hover:text-red-800"
                    title="Eliminar material"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Especificaciones Técnicas */}
              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <h5 className="text-xs font-medium text-gray-700 mb-2">ESPECIFICACIONES TÉCNICAS</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Dimensiones:</span>
                    <p className="font-medium">{material.ancho_estandar} x {material.alto_estandar} mm</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Espesor:</span>
                    <p className="font-medium">{material.espesor} mm</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Tolerancia:</span>
                    <p className="font-medium">{material.tolerancia_sierra} mm</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Peso/m²:</span>
                    <p className="font-medium">{material.peso_m2} kg</p>
                  </div>
                </div>
              </div>

              {/* Información Comercial */}
              <div className="bg-blue-50 p-3 rounded-lg mb-3">
                <h5 className="text-xs font-medium text-blue-700 mb-2">INFORMACIÓN COMERCIAL</h5>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-blue-600">Costo/m²:</span>
                    <span className="font-bold text-blue-900">${material.costo_m2.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Área estándar:</span>
                    <span className="font-medium text-blue-800">
                      {((material.ancho_estandar * material.alto_estandar) / 1000000).toFixed(2)} m²
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Costo/lámina:</span>
                    <span className="font-bold text-green-600">
                      ${(((material.ancho_estandar * material.alto_estandar) / 1000000) * material.costo_m2).toFixed(2)}
                    </span>
                  </div>
                  {material.descuento_volumen && (
                    <div className="flex justify-between">
                      <span className="text-blue-600">Desc. volumen:</span>
                      <span className="font-medium text-orange-600">{material.descuento_volumen}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Información de Entrega */}
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h5 className="text-xs font-medium text-yellow-700 mb-2">DISPONIBILIDAD</h5>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-yellow-600">Tiempo entrega:</span>
                  <span className="text-xs font-medium text-yellow-800">
                    {material.tiempo_entrega_dias} días
                  </span>
                </div>
                {material.observaciones && (
                  <p className="text-xs text-yellow-700 mt-1 italic">
                    {material.observaciones}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Análisis de Costos por Tipo */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Análisis de Costos por Tipo de Material</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Vidrio', 'Aluminio', 'Acero'].map((tipo) => {
              const materialesTipo = materiales.filter(m => m.tipo === tipo);
              const costoPromedio = materialesTipo.reduce((sum, m) => sum + m.costo_m2, 0) / materialesTipo.length || 0;
              const costoMin = Math.min(...materialesTipo.map(m => m.costo_m2));
              const costoMax = Math.max(...materialesTipo.map(m => m.costo_m2));
              
              return (
                <div key={tipo} className="bg-white p-4 rounded-lg border border-gray-200">
                  <h5 className="font-medium text-gray-900 mb-3">{tipo}</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Materiales:</span>
                      <span className="font-medium">{materialesTipo.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Costo promedio:</span>
                      <span className="font-medium">${costoPromedio.toFixed(2)}/m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rango:</span>
                      <span className="font-medium text-xs">
                        ${costoMin.toFixed(0)} - ${costoMax.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">En stock:</span>
                      <span className="font-medium">
                        {materialesTipo.filter(m => m.disponible_stock).length}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Nuevo/Editar Material */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto">
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
                tolerancia_sierra: parseFloat(formData.get('tolerancia_sierra') as string),
                densidad: parseFloat(formData.get('densidad') as string),
                disponible_stock: formData.get('disponible_stock') === 'on',
                tiempo_entrega_dias: parseInt(formData.get('tiempo_entrega_dias') as string),
                descuento_volumen: parseFloat(formData.get('descuento_volumen') as string) || 0,
                observaciones: formData.get('observaciones'),
                status: formData.get('status') || 'Activo'
              });
            }}>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Información Básica */}
                  <div className="md:col-span-3 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Información Básica</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
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
                          <option value="Madera">Madera</option>
                          <option value="Plástico">Plástico</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Especificaciones Técnicas */}
                  <div className="md:col-span-3 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Especificaciones Técnicas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                          Tolerancia Sierra (mm)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          name="tolerancia_sierra"
                          defaultValue={editingItem?.tolerancia_sierra || 3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Densidad (g/cm³)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          name="densidad"
                          defaultValue={editingItem?.densidad || 2.5}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información Comercial */}
                  <div className="md:col-span-3 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Información Comercial</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          Descuento Volumen (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          name="descuento_volumen"
                          defaultValue={editingItem?.descuento_volumen || 0}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tiempo Entrega (días)
                        </label>
                        <input
                          type="number"
                          name="tiempo_entrega_dias"
                          defaultValue={editingItem?.tiempo_entrega_dias || 3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        <label className="flex items-center space-x-2 mt-6">
                          <input
                            type="checkbox"
                            name="disponible_stock"
                            defaultChecked={editingItem?.disponible_stock || false}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Disponible en Stock</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div className="md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observaciones
                    </label>
                    <textarea
                      name="observaciones"
                      rows={3}
                      defaultValue={editingItem?.observaciones || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Notas adicionales sobre el material..."
                    />
                  </div>
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
                  {editingItem ? 'Actualizar' : 'Crear'} Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Importar Materiales */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Importar Materiales</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archivo Excel/CSV
                  </label>
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Formato de Archivo</h4>
                  <p className="text-sm text-blue-800 mb-2">
                    El archivo debe contener las siguientes columnas:
                  </p>
                  <div className="text-xs font-mono bg-white p-2 rounded border">
                    nombre,tipo,ancho_estandar,alto_estandar,espesor,costo_m2,proveedor,tolerancia_sierra
                  </div>
                </div>
                <button
                  onClick={() => alert('Descargando plantilla...')}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Descargar Plantilla Excel
                </button>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Importar Materiales
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const duplicarMaterial = (material: MaterialConfig) => {
  // Esta función se implementaría en el componente padre
  console.log('Duplicando material:', material);
};

export default ConfiguracionMateriales;