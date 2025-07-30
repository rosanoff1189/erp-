import React, { useState } from 'react';
import { Database, Download, Upload, RefreshCw, AlertTriangle, CheckCircle, HardDrive, Copy, Zap } from 'lucide-react';
import { DatabaseService } from '../../services/DatabaseService';

const AdministradorBD: React.FC = () => {
  const [activeOperation, setActiveOperation] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [operationResult, setOperationResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const operaciones = [
    {
      id: 'backup',
      nombre: 'Respaldo de Base de Datos',
      descripcion: 'Crear respaldo completo de la base de datos',
      icon: Download,
      color: 'blue',
      peligroso: false
    },
    {
      id: 'restore',
      nombre: 'Restaurar Base de Datos',
      descripcion: 'Restaurar base de datos desde archivo de respaldo',
      icon: Upload,
      color: 'green',
      peligroso: true
    },
    {
      id: 'clone',
      nombre: 'Clonar Base de Datos',
      descripcion: 'Crear una copia exacta de la base de datos',
      icon: Copy,
      color: 'purple',
      peligroso: false
    },
    {
      id: 'migrate',
      nombre: 'Migración de Datos',
      descripcion: 'Migrar datos entre diferentes versiones',
      icon: RefreshCw,
      color: 'yellow',
      peligroso: true
    },
    {
      id: 'optimize',
      nombre: 'Optimizar Base de Datos',
      descripcion: 'Optimizar tablas y mejorar rendimiento',
      icon: HardDrive,
      color: 'indigo',
      peligroso: false
    },
    {
      id: 'create-structure',
      nombre: 'Crear Estructura Completa ERP',
      descripcion: 'Crear toda la estructura ERP y poblar con datos iniciales',
      icon: Zap,
      color: 'green',
      peligroso: true
    }
  ];

  const [estadisticasBD, setEstadisticasBD] = useState({
    tamaño: '2.5 GB',
    tablas: 45,
    registros: 125430,
    ultimoRespaldo: '2024-01-15 14:30:00',
    version: 'MySQL 8.0.35',
    conexionesActivas: 12
  });

  const handleExecuteOperation = (operationId: string) => {
    setActiveOperation(operationId);
    setShowModal(true);
    setOperationResult(null);
  };

  const executeOperation = async (operationId: string, params: any) => {
    setOperationResult({ status: 'processing', message: 'Ejecutando operación...' });

    try {
      let result;
      
      switch (operationId) {
        case 'backup':
          result = await DatabaseService.createBackup({
            type: params.type || 'complete',
            includeData: params.includeData !== false,
            includeLogs: params.includeLogs || false,
            compression: params.compression || false
          });
          break;
          
        case 'restore':
          if (!selectedFile) {
            throw new Error('Debe seleccionar un archivo de respaldo');
          }
          result = await DatabaseService.restoreBackup(selectedFile);
          break;
          
        case 'clone':
          result = await DatabaseService.cloneDatabase(params.newName || 'erp_clone');
          break;
          
        case 'migrate':
          result = await DatabaseService.migrateVersion(params.targetVersion || '3.0');
          break;
          
        case 'optimize':
          result = await DatabaseService.optimizeDatabase();
          break;
          
        case 'create-structure':
          result = await DatabaseService.createERPStructure(params);
          break;
          
        default:
          throw new Error('Operación no reconocida');
      }

      setOperationResult({
        status: 'success',
        message: result.message,
        details: result
      });

      // Actualizar estadísticas después de operaciones exitosas
      if (operationId === 'backup') {
        setEstadisticasBD(prev => ({
          ...prev,
          ultimoRespaldo: new Date().toLocaleString()
        }));
      }
      
    } catch (error) {
      setOperationResult({
        status: 'error',
        message: 'Error durante la operación',
        details: { error: error.message }
      });
    }
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800',
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      red: 'bg-red-50 border-red-200 text-red-800'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Administrador de Base de Datos</h3>
            <p className="text-sm text-gray-600">Herramientas avanzadas para gestión y mantenimiento de la base de datos</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Estadísticas de la BD */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Estado de la Base de Datos</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Tamaño</p>
              <p className="text-lg font-bold text-blue-600">{estadisticasBD.tamaño}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Tablas</p>
              <p className="text-lg font-bold text-green-600">{estadisticasBD.tablas}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Registros</p>
              <p className="text-lg font-bold text-purple-600">{estadisticasBD.registros.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Último Respaldo</p>
              <p className="text-xs font-medium text-gray-800">{estadisticasBD.ultimoRespaldo}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Versión</p>
              <p className="text-sm font-medium text-gray-800">{estadisticasBD.version}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Conexiones</p>
              <p className="text-lg font-bold text-yellow-600">{estadisticasBD.conexionesActivas}</p>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <p className="text-sm font-medium text-red-800">
              Advertencia: Las operaciones marcadas como peligrosas pueden afectar la integridad de los datos. 
              Asegúrese de tener respaldos actualizados antes de proceder.
            </p>
          </div>
        </div>

        {/* Operaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {operaciones.map((operacion) => {
            const Icon = operacion.icon;
            const colorClasses = getColorClasses(operacion.color);
            
            return (
              <div key={operacion.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${colorClasses}`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Icon className="w-6 h-6" />
                    {operacion.peligroso && (
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-1" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium mb-2">{operacion.nombre}</h5>
                    <p className="text-sm opacity-80 mb-3">{operacion.descripcion}</p>
                    {operacion.peligroso && (
                      <p className="text-xs text-red-600 mb-3 font-medium">⚠️ Operación Peligrosa</p>
                    )}
                    <button
                      onClick={() => handleExecuteOperation(operacion.id)}
                      className="w-full px-3 py-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-lg transition-colors font-medium"
                    >
                      Ejecutar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Historial de Operaciones */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Historial de Operaciones</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white p-3 rounded-lg">
              <div>
                <span className="font-medium">Respaldo Automático</span>
                <span className="text-gray-600 ml-2">- backup_auto_2024-01-17.sql (2.5 GB)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Hace 2 horas</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Exitoso</span>
              </div>
            </div>
            <div className="flex items-center justify-between bg-white p-3 rounded-lg">
              <div>
                <span className="font-medium">Optimización de Tablas</span>
                <span className="text-gray-600 ml-2">- 45 tablas optimizadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Ayer</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Exitoso</span>
              </div>
            </div>
            <div className="flex items-center justify-between bg-white p-3 rounded-lg">
              <div>
                <span className="font-medium">Migración de Datos</span>
                <span className="text-gray-600 ml-2">- Actualización a versión 2.1</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Hace 3 días</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Exitoso</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Operación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {operaciones.find(o => o.id === activeOperation)?.nombre}
              </h3>
            </div>
            
            <div className="p-6">
              {!operationResult && (
                <div>
                  {activeOperation === 'backup' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Respaldo
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="complete">Respaldo Completo</option>
                          <option value="structure">Solo Estructura</option>
                          <option value="data">Solo Datos</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Incluir en el Respaldo
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Datos de catálogos</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Transacciones</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Configuración del sistema</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Bitácora y auditoría</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeOperation === 'restore' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Advertencia:</strong> Esta operación reemplazará todos los datos actuales. 
                          Asegúrese de tener un respaldo antes de continuar.
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Archivo de Respaldo
                        </label>
                        <input
                          type="file"
                          accept=".sql,.zip,.gz"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Opciones de Restauración
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Eliminar datos existentes</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Mantener usuarios actuales</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Verificar integridad</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeOperation === 'create-structure' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <strong>Asistente ERP:</strong> Esta función creará toda la estructura de base de datos 
                          y poblará con datos de demostración para comenzar a usar el sistema inmediatamente.
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Configuración Inicial
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Crear estructura completa de tablas</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Poblar con datos de demostración</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Configurar catálogos SAT</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Crear usuarios y roles por defecto</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Configurar sucursales múltiples</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Datos de la Empresa
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Razón Social"
                            defaultValue="Aluminios y Vidrios del Norte S.A. de C.V."
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="text"
                            placeholder="RFC"
                            defaultValue="AVN123456789"
                            className="px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeOperation === 'clone' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre de la Base de Datos Clonada
                        </label>
                        <input
                          type="text"
                          placeholder="erp_clone_2024"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Opciones de Clonado
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Incluir datos</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Incluir índices</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Incluir triggers</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeOperation === 'migrate' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Migración
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="version">Actualización de Versión</option>
                          <option value="server">Migración de Servidor</option>
                          <option value="engine">Cambio de Motor BD</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Versión Destino
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="2.1">ERP v2.1</option>
                          <option value="2.2">ERP v2.2</option>
                          <option value="3.0">ERP v3.0</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {activeOperation === 'optimize' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Optimización
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Optimizar tablas</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" defaultChecked />
                            <span className="text-sm">Reconstruir índices</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Analizar estadísticas</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-sm">Limpiar logs antiguos</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {operationResult && (
                <div className="space-y-4">
                  {operationResult.status === 'processing' && (
                    <div className="text-center py-8">
                      <Database className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
                      <p className="text-lg font-medium text-gray-900">{operationResult.message}</p>
                      <p className="text-sm text-gray-600">Esta operación puede tomar varios minutos...</p>
                    </div>
                  )}

                  {operationResult.status === 'success' && (
                    <div>
                      <div className="text-center py-4">
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <p className="text-lg font-medium text-green-900">{operationResult.message}</p>
                      </div>
                      
                      {operationResult.details && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-900 mb-2">Detalles de la Operación:</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-green-700">Archivo:</span>
                              <span className="font-medium text-green-900">{operationResult.details.filename}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-700">Tamaño:</span>
                              <span className="font-medium text-green-900">{operationResult.details.size}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-green-700">Duración:</span>
                              <span className="font-medium text-green-900">{operationResult.details.duration}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {operationResult.status === 'error' && (
                    <div className="text-center py-4">
                      <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
                      <p className="text-lg font-medium text-red-900">{operationResult.message}</p>
                      {operationResult.details?.error && (
                        <p className="text-sm text-red-700 mt-2">{operationResult.details.error}</p>
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
                  setOperationResult(null);
                  setActiveOperation('');
                  setSelectedFile(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {operationResult ? 'Cerrar' : 'Cancelar'}
              </button>
              {!operationResult && (
                <button
                  onClick={() => executeOperation(activeOperation, {})}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    operaciones.find(o => o.id === activeOperation)?.peligroso
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {operaciones.find(o => o.id === activeOperation)?.peligroso ? 'Ejecutar (Peligroso)' : 'Ejecutar'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministradorBD;