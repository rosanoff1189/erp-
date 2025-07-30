import React, { useState } from 'react';
import { RefreshCw, Upload, Download, Database, AlertTriangle, CheckCircle, FileText, Settings, Users, DollarSign, Zap, Shield, Package } from 'lucide-react';
import { SATService } from '../../services/SATService';
import { ExcelService } from '../../services/ExcelService';

const ProcesosEspeciales: React.FC = () => {
  const [activeProcess, setActiveProcess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [processResult, setProcessResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const procesos = [
    {
      id: 'actualizar-clientes',
      nombre: 'Actualización Masiva de Clientes',
      descripcion: 'Actualizar datos de múltiples clientes simultáneamente desde Excel o por filtros',
      categoria: 'Catálogos',
      icon: Users,
      color: 'blue',
      peligroso: false
    },
    {
      id: 'actualizar-proveedores',
      nombre: 'Actualización Masiva de Proveedores',
      descripcion: 'Actualizar datos de múltiples proveedores simultáneamente',
      categoria: 'Catálogos',
      icon: Users,
      color: 'green',
      peligroso: false
    },
    {
      id: 'cancelar-cfdi',
      nombre: 'Cancelación Masiva de CFDI',
      descripcion: 'Cancelar múltiples facturas en el SAT por rango de fechas o folios',
      categoria: 'Facturación SAT',
      icon: AlertTriangle,
      color: 'red',
      peligroso: true
    },
    {
      id: 'verificar-sellos',
      nombre: 'Verificar Sellos Digitales SAT',
      descripcion: 'Validar integridad de sellos digitales y status en el SAT',
      categoria: 'Facturación SAT',
      icon: Shield,
      color: 'purple',
      peligroso: false
    },
    {
      id: 'actualizar-precios',
      nombre: 'Actualización Masiva de Precios',
      descripcion: 'Actualizar precios por porcentaje, manual o desde archivo Excel',
      categoria: 'Productos',
      icon: DollarSign,
      color: 'yellow',
      peligroso: false
    },
    {
      id: 'importar-sat',
      nombre: 'Importar Catálogo SAT',
      descripcion: 'Importar productos y servicios actualizados del SAT',
      categoria: 'Facturación SAT',
      icon: Download,
      color: 'indigo',
      peligroso: false
    },
    {
      id: 'gestionar-acabados',
      nombre: 'Gestionar Acabados de Productos',
      descripcion: 'Actualización masiva de acabados, colores y características',
      categoria: 'Productos',
      icon: Settings,
      color: 'purple',
      peligroso: false
    },
    {
      id: 'leyenda-fiscal',
      nombre: 'Actualizar Leyenda Fiscal',
      descripcion: 'Modificar leyenda fiscal que aparece en facturas',
      categoria: 'Facturación SAT',
      icon: FileText,
      color: 'blue',
      peligroso: false
    },
    {
      id: 'reportes-masivos',
      nombre: 'Reportes Masivos de Catálogos',
      descripcion: 'Generar reportes completos de todos los catálogos en Excel/PDF',
      categoria: 'Reportes',
      icon: FileText,
      color: 'gray',
      peligroso: false
    },
    {
      id: 'importar-minimos-maximos',
      nombre: 'Importar Mínimos/Máximos',
      descripcion: 'Actualizar niveles de inventario mínimos y máximos desde Excel',
      categoria: 'Inventario',
      icon: Upload,
      color: 'green',
      peligroso: false
    },
    {
      id: 'exportar-productos-excel',
      nombre: 'Exportar Productos a Excel',
      descripcion: 'Exportar catálogo completo con precios, existencias y costos',
      categoria: 'Productos',
      icon: Download,
      color: 'blue',
      peligroso: false
    },
    {
      id: 'sincronizar-inventario',
      nombre: 'Sincronizar Inventario Multi-Almacén',
      descripcion: 'Sincronizar existencias entre múltiples almacenes y sucursales',
      categoria: 'Inventario',
      icon: RefreshCw,
      color: 'teal',
      peligroso: false
    },
    {
      id: 'limpiar-datos',
      nombre: 'Limpieza de Datos Obsoletos',
      descripcion: 'Eliminar registros antiguos, logs y datos temporales',
      categoria: 'Mantenimiento',
      icon: Database,
      color: 'orange',
      peligroso: true
    },
    {
      id: 'recalcular-saldos',
      nombre: 'Recalcular Saldos de Clientes/Proveedores',
      descripcion: 'Recalcular saldos basado en facturas y pagos registrados',
      categoria: 'Contabilidad',
      icon: DollarSign,
      color: 'green',
      peligroso: false
    },
    {
      id: 'migrar-version',
      nombre: 'Migración de Versión',
      descripcion: 'Migrar datos a nueva versión del sistema',
      categoria: 'Mantenimiento',
      icon: Zap,
      color: 'purple',
      peligroso: true
    },
    {
      id: 'importar-pedidos',
      nombre: 'Importar Pedidos Externos',
      descripcion: 'Importar pedidos desde marketplaces o sistemas externos',
      categoria: 'Ventas',
      icon: Package,
      color: 'blue',
      peligroso: false
    }
  ];

  const handleExecuteProcess = (processId: string) => {
    setActiveProcess(processId);
    setShowModal(true);
    setProcessResult(null);
  };

  const executeProcess = async (processId: string, params: any) => {
    setProcessResult({ status: 'processing', message: 'Ejecutando proceso...' });
    
    try {
      let result;
      
      switch (processId) {
        case 'actualizar-clientes':
        case 'actualizar-proveedores':
          if (selectedFile) {
            result = await ExcelService.importClientes(selectedFile);
          } else {
            result = { processed: 892, errors: 2, warnings: 5 };
          }
          break;
          
        case 'cancelar-cfdi':
          result = await this.processCancelacionMasiva(params);
          break;
          
        case 'verificar-sellos':
          result = await this.processVerificarSellos(params);
          break;
          
        case 'actualizar-precios':
          result = await this.processActualizarPrecios(params);
          break;
          
        case 'importar-sat':
          result = await this.processImportarSAT(params);
          break;
          
        case 'exportar-productos-excel':
          const filename = await ExcelService.exportData([], {
            filename: 'productos_completo',
            format: 'xlsx',
            includeHeaders: true
          });
          result = { processed: 1250, filename };
          break;
          
        default:
          result = { processed: 100, errors: 0, warnings: 0 };
      }

      setProcessResult({
        status: 'success',
        message: 'Proceso completado exitosamente',
        details: {
          ...result,
          tiempo_ejecucion: `${Math.floor(Math.random() * 300) + 30} segundos`
        }
      });
    } catch (error) {
      setProcessResult({
        status: 'error',
        message: 'Error durante la ejecución del proceso',
        details: { error: error.message }
      });
    }
  };

  const processCancelacionMasiva = async (params: any) => {
    // Simular cancelación masiva de CFDI
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          processed: 25,
          errors: 1,
          warnings: 0,
          cancelados: 24,
          rechazados: 1
        });
      }, 4000);
    });
  };

  const processVerificarSellos = async (params: any) => {
    // Simular verificación de sellos
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          processed: 150,
          errors: 3,
          warnings: 8,
          validos: 139,
          invalidos: 3,
          pendientes: 8
        });
      }, 3000);
    });
  };

  const processActualizarPrecios = async (params: any) => {
    // Simular actualización de precios
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          processed: 1250,
          errors: 0,
          warnings: 12,
          actualizados: 1250,
          porcentaje: params.porcentaje || 15
        });
      }, 2000);
    });
  };

  const processImportarSAT = async (params: any) => {
    // Simular importación de catálogo SAT
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          processed: 5412,
          errors: 5,
          warnings: 25,
          nuevos: 234,
          actualizados: 5178
        });
      }, 5000);
    });
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100',
      red: 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-800 hover:bg-purple-100',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800 hover:bg-indigo-100',
      gray: 'bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100',
      teal: 'bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100',
      orange: 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const categorias = [...new Set(procesos.map(p => p.categoria))];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 animate-fade-in">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 text-primary animate-spin" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Procesos Especiales</h3>
            <p className="text-sm text-gray-600">Herramientas avanzadas para operaciones masivas y especializadas</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Warning */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-slide-up">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 animate-bounce" />
            <p className="text-sm font-medium text-yellow-800">
              <strong>Advertencia:</strong> Estos procesos pueden afectar grandes cantidades de datos. 
              Asegúrese de tener respaldos antes de ejecutar operaciones marcadas como peligrosas.
            </p>
          </div>
        </div>

        {/* Process Categories */}
        {categorias.map((categoria, categoryIndex) => (
          <div key={categoria} className="mb-8 animate-slide-up" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
              {categoria}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {procesos.filter(p => p.categoria === categoria).map((proceso, index) => {
                const Icon = proceso.icon;
                const colorClasses = getColorClasses(proceso.color);
                
                return (
                  <div 
                    key={proceso.id} 
                    className={`border rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${colorClasses}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Icon className="w-6 h-6" />
                        {proceso.peligroso && (
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-1 animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium mb-2">{proceso.nombre}</h5>
                        <p className="text-sm opacity-80 mb-3">{proceso.descripcion}</p>
                        {proceso.peligroso && (
                          <p className="text-xs text-red-600 mb-3 font-medium animate-pulse">⚠️ Operación Peligrosa</p>
                        )}
                        <button
                          onClick={() => handleExecuteProcess(proceso.id)}
                          className={`w-full px-3 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-lg transition-all duration-200 font-medium hover:shadow-md ${
                            proceso.peligroso ? 'hover:bg-red-50 border border-red-200' : ''
                          }`}
                        >
                          {proceso.peligroso ? 'Ejecutar (Cuidado)' : 'Ejecutar Proceso'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Process History */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg animate-fade-in">
          <h4 className="font-semibold text-gray-900 mb-4">Historial de Procesos Recientes</h4>
          <div className="space-y-3">
            {[
              { nombre: 'Actualización Masiva de Precios', detalle: '1,250 productos actualizados (+15%)', tiempo: 'Hace 2 horas', status: 'Exitoso' },
              { nombre: 'Importar Catálogo SAT', detalle: '5,412 productos importados', tiempo: 'Ayer', status: 'Exitoso' },
              { nombre: 'Cancelación Masiva CFDI', detalle: '15 facturas canceladas', tiempo: 'Hace 3 días', status: 'Con advertencias' },
              { nombre: 'Verificar Sellos Digitales', detalle: '150 facturas verificadas', tiempo: 'Hace 1 semana', status: 'Exitoso' },
              { nombre: 'Exportar Productos Excel', detalle: 'Catálogo completo exportado', tiempo: 'Hace 1 semana', status: 'Exitoso' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg hover:shadow-sm transition-all duration-200">
                <div>
                  <span className="font-medium">{item.nombre}</span>
                  <span className="text-gray-600 ml-2">- {item.detalle}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{item.tiempo}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === 'Exitoso' ? 'bg-green-100 text-green-800' :
                    item.status === 'Con advertencias' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal de Proceso */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-screen overflow-y-auto animate-slide-up">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {procesos.find(p => p.id === activeProcess)?.nombre}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {procesos.find(p => p.id === activeProcess)?.descripcion}
              </p>
            </div>
            
            <div className="p-6">
              {!processResult && (
                <div className="space-y-6">
                  {/* Configuración específica por proceso */}
                  {activeProcess === 'actualizar-precios' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tipo de Actualización
                          </label>
                          <select className="input-field">
                            <option value="percentage">Por Porcentaje</option>
                            <option value="excel">Desde Archivo Excel</option>
                            <option value="manual">Manual por Línea</option>
                            <option value="formula">Por Fórmula Personalizada</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Porcentaje de Incremento (%)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="15.5"
                            className="input-field"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Línea de Productos (Opcional)
                          </label>
                          <select className="input-field">
                            <option value="">Todas las líneas</option>
                            <option value="vidrios">Vidrios</option>
                            <option value="perfiles">Perfiles de Aluminio</option>
                            <option value="herrajes">Herrajes</option>
                            <option value="accesorios">Accesorios</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Aplicar También a Costos
                          </label>
                          <select className="input-field">
                            <option value="no">No, solo precios</option>
                            <option value="yes">Sí, mismo porcentaje</option>
                            <option value="different">Sí, porcentaje diferente</option>
                          </select>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h5 className="font-medium text-blue-900 mb-2">Vista Previa del Cambio</h5>
                        <div className="text-sm text-blue-800">
                          <p>• Se actualizarán aproximadamente 1,250 productos</p>
                          <p>• Precio promedio actual: $285.50</p>
                          <p>• Precio promedio después: $328.33 (+15%)</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeProcess === 'cancelar-cfdi' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <p className="text-sm text-red-800">
                            <strong>Advertencia Crítica:</strong> Esta acción cancelará las facturas seleccionadas en el SAT. 
                            Esta operación NO se puede deshacer y afectará la contabilidad.
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha Inicial
                          </label>
                          <input type="date" className="input-field" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha Final
                          </label>
                          <input type="date" className="input-field" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Motivo de Cancelación SAT
                        </label>
                        <select className="input-field">
                          <option value="01">01 - Comprobante emitido con errores con relación</option>
                          <option value="02">02 - Comprobante emitido con errores sin relación</option>
                          <option value="03">03 - No se llevó a cabo la operación</option>
                          <option value="04">04 - Operación nominativa relacionada en una factura global</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {(activeProcess === 'actualizar-clientes' || activeProcess === 'actualizar-proveedores') && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Método de Actualización
                        </label>
                        <select className="input-field">
                          <option value="excel">Desde archivo Excel/CSV</option>
                          <option value="filtros">Por filtros y campos específicos</option>
                          <option value="individual">Selección individual</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Archivo Excel/CSV (Opcional)
                        </label>
                        <input
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="input-field"
                        />
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Tip:</strong> Descarga primero la plantilla Excel con los datos actuales, 
                          modifica solo los campos necesarios y vuelve a importar.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Más configuraciones para otros procesos */}
                </div>
              )}

              {processResult && (
                <div className="space-y-4">
                  {processResult.status === 'processing' && (
                    <div className="text-center py-8">
                      <RefreshCw className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                      <p className="text-lg font-medium text-gray-900">{processResult.message}</p>
                      <p className="text-sm text-gray-600">Por favor espere, esto puede tomar varios minutos...</p>
                      <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                  )}

                  {processResult.status === 'success' && (
                    <div className="animate-fade-in">
                      <div className="text-center py-4">
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4 animate-bounce" />
                        <p className="text-lg font-medium text-green-900">{processResult.message}</p>
                      </div>
                      
                      {processResult.details && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-3">Resumen del Proceso:</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                              <p className="text-green-700">Procesados:</p>
                              <p className="text-xl font-bold text-green-900">{processResult.details.processed?.toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-yellow-700">Advertencias:</p>
                              <p className="text-xl font-bold text-yellow-900">{processResult.details.warnings || 0}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-red-700">Errores:</p>
                              <p className="text-xl font-bold text-red-900">{processResult.details.errors || 0}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-blue-700">Tiempo:</p>
                              <p className="text-sm font-bold text-blue-900">{processResult.details.tiempo_ejecucion}</p>
                            </div>
                          </div>
                          {processResult.details.filename && (
                            <div className="mt-3 pt-3 border-t border-green-200">
                              <p className="text-sm text-green-800">
                                <strong>Archivo generado:</strong> {processResult.details.filename}
                              </p>
                              <button className="mt-2 btn-secondary text-sm">
                                <Download className="w-4 h-4 mr-1" />
                                Descargar Archivo
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setProcessResult(null);
                  setActiveProcess('');
                  setSelectedFile(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                {processResult ? 'Cerrar' : 'Cancelar'}
              </button>
              {!processResult && (
                <button
                  onClick={() => executeProcess(activeProcess, {})}
                  className={`px-4 py-2 text-white rounded-lg transition-all duration-200 ${
                    procesos.find(p => p.id === activeProcess)?.peligroso
                      ? 'bg-red-600 hover:bg-red-700 hover:shadow-lg'
                      : 'bg-primary hover:bg-blue-700 hover:shadow-lg'
                  }`}
                >
                  {procesos.find(p => p.id === activeProcess)?.peligroso ? 'Ejecutar (Peligroso)' : 'Ejecutar Proceso'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcesosEspeciales;