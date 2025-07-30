// SAT Integration Service for CFDI 4.0
export interface CFDIData {
  Serie: string;
  Folio: string;
  Fecha: string;
  FormaPago: string;
  MetodoPago: string;
  LugarExpedicion: string;
  Moneda: string;
  TipoDeComprobante: string;
  Receptor: {
    Rfc: string;
    Nombre: string;
    UsoCFDI: string;
  };
  Conceptos: Array<{
    ClaveProdServ: string;
    Cantidad: number;
    Unidad: string;
    Descripcion: string;
    ValorUnitario: number;
    Importe: number;
  }>;
}

export interface CFDIResponse {
  UUID: string;
  PDF: string;
  XML: string;
  Status: string;
  Message?: string;
}

export class SATService {
  private apiUrl: string;
  private apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async timbrarCFDI(facturaData: CFDIData): Promise<CFDIResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/cfdi33/Timbrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(facturaData)
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error al timbrar CFDI:', error);
      throw error;
    }
  }

  async cancelarCFDI(uuid: string, motivo: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/cfdi33/Cancelar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          UUID: uuid,
          Motivo: motivo
        })
      });

      const result = await response.json();
      return result.Status === 'Success';
    } catch (error) {
      console.error('Error al cancelar CFDI:', error);
      return false;
    }
  }

  async verificarSello(uuid: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/cfdi33/Verificar/${uuid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Error al verificar sello:', error);
      throw error;
    }
  }

  async importarCatalogoSAT(tipo: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.apiUrl}/catalogos/${tipo}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return await response.json();
    } catch (error) {
      console.error('Error al importar catálogo SAT:', error);
      throw error;
    }
  }
}

// Factory para diferentes proveedores de PAC
export class SATServiceFactory {
  static create(proveedor: string, config: any): SATService {
    switch (proveedor) {
      case 'facturama':
        return new SATService('https://api.facturama.mx/v1', config.apiKey);
      case 'facturapoti':
        return new SATService('https://api.facturapoti.com/v1', config.apiKey);
      case 'finkok':
        return new SATService('https://api.finkok.com/v1', config.apiKey);
      default:
        throw new Error(`Proveedor SAT no soportado: ${proveedor}`);
    }
  }
}