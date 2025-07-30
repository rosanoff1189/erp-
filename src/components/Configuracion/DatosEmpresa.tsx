import React, { useState } from 'react';
import { Building, Upload, Save, Eye } from 'lucide-react';

const DatosEmpresa: React.FC = () => {
  const [datosEmpresa, setDatosEmpresa] = useState({
    razonSocial: 'Aluminios y Vidrios del Norte S.A. de C.V.',
    rfc: 'AVN123456789',
    regimenFiscal: '601',
    domicilioFiscal: 'Av. Industrial 123, Col. Norte,  CP 64000, Monterrey, N.L.',
    telefono: '81-1234-5678',
    correo: 'contacto@aluminiosnorte.com',
    sitioWeb: 'www.aluminiosnorte.com',
    codigoPostal: '64000',
    certificadoSello: 'CERT-2024-001',
    logo: null
  });

  const regimenesFiscales = [
    { codigo: '601', descripcion: 'General de Ley Personas Morales' },
    { codigo: '603', descripcion: 'Personas Morales con Fines no Lucrativos' },
    { codigo: '605', descripcion: 'Sueldos y Salarios e Ingresos Asimilados a Salarios' },
    { codigo: '606', descripcion: 'Arrendamiento' },
    { codigo: '608', descripcion: 'Demás ingresos' },
    { codigo: '610', descripcion: 'Residentes en el Extranjero sin Establecimiento Permanente en México' },
    { codigo: '611', descripcion: 'Ingresos por Dividendos (socios y accionistas)' },
    { codigo: '612', descripcion: 'Personas Físicas con Actividades Empresariales y Profesionales' },
    { codigo: '614', descripcion: 'Ingresos por intereses' },
    { codigo: '616', descripcion: 'Sin obligaciones fiscales' },
    { codigo: '620', descripcion: 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos' },
    { codigo: '621', descripcion: 'Incorporación Fiscal' },
    { codigo: '622', descripcion: 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras' },
    { codigo: '623', descripcion: 'Opcional para Grupos de Sociedades' },
    { codigo: '624', descripcion: 'Coordinados' },
    { codigo: '628', descripcion: 'Hidrocarburos' },
    { codigo: '629', descripcion: 'De los Regímenes Fiscales Preferentes y de las Empresas Multinacionales' },
    { codigo: '630', descripcion: 'Enajenación de acciones en bolsa de valores' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setDatosEmpresa(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    alert('Datos de la empresa guardados correctamente');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Building className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Datos de la Empresa</h3>
            <p className="text-sm text-gray-600">Información fiscal y configuración de documentos</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Datos Fiscales */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Datos Fiscales SAT</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razón Social *
                  </label>
                  <input
                    type="text"
                    value={datosEmpresa.razonSocial}
                    onChange={(e) => handleInputChange('razonSocial', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RFC *
                  </label>
                  <input
                    type="text"
                    value={datosEmpresa.rfc}
                    onChange={(e) => handleInputChange('rfc', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Régimen Fiscal *
                  </label>
                  <select
                    value={datosEmpresa.regimenFiscal}
                    onChange={(e) => handleInputChange('regimenFiscal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {regimenesFiscales.map((regimen) => (
                      <option key={regimen.codigo} value={regimen.codigo}>
                        {regimen.codigo} - {regimen.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domicilio Fiscal *
                  </label>
                  <textarea
                    rows={3}
                    value={datosEmpresa.domicilioFiscal}
                    onChange={(e) => handleInputChange('domicilioFiscal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal *
                  </label>
                  <input
                    type="text"
                    value={datosEmpresa.codigoPostal}
                    onChange={(e) => handleInputChange('codigoPostal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificado de Sello
                  </label>
                  <input
                    type="text"
                    value={datosEmpresa.certificadoSello}
                    onChange={(e) => handleInputChange('certificadoSello', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Datos de Contacto</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={datosEmpresa.telefono}
                    onChange={(e) => handleInputChange('telefono', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={datosEmpresa.correo}
                    onChange={(e) => handleInputChange('correo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sitio Web
                  </label>
                  <input
                    type="url"
                    value={datosEmpresa.sitioWeb}
                    onChange={(e) => handleInputChange('sitioWeb', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logo y Personalización */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Logo de la Empresa</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {datosEmpresa.logo ? (
                    <div>
                      <img src={datosEmpresa.logo} alt="Logo" className="mx-auto mb-3 max-h-24" />
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        Cambiar Logo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-2">Subir logo de la empresa</p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Seleccionar Archivo
                      </button>
                      <p className="text-xs text-gray-500 mt-2">PNG, JPG hasta 2MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Personalización de Documentos</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Principal
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        defaultValue="#0080FF"
                        className="w-12 h-10 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        defaultValue="#0080FF"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color Secundario
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        defaultValue="#2EC4B6"
                        className="w-12 h-10 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        defaultValue="#2EC4B6"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Letra
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="arial">Arial</option>
                      <option value="helvetica">Helvetica</option>
                      <option value="times">Times New Roman</option>
                      <option value="calibri">Calibri</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Vista Previa</h4>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="bg-white p-4 rounded shadow-sm">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900">{datosEmpresa.razonSocial}</h5>
                        <p className="text-xs text-gray-600">{datosEmpresa.rfc}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>{datosEmpresa.telefono}</p>
                      <p>{datosEmpresa.correo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuración de Series */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-4">Configuración de Series de Documentos</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serie de Facturas
              </label>
              <input
                type="text"
                defaultValue="A"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Folio Inicial
              </label>
              <input
                type="number"
                defaultValue="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Folio Actual
              </label>
              <input
                type="number"
                defaultValue="158"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="mt-8 flex justify-end space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="w-4 h-4" />
            <span>Vista Previa</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatosEmpresa;