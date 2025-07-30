// Excel Import/Export Service
export interface ImportResult {
  processed: number;
  errors: number;
  warnings: number;
  details: any[];
}

export interface ExportOptions {
  filename: string;
  format: 'xlsx' | 'csv' | 'pdf';
  includeHeaders: boolean;
  filters?: any;
}

export class ExcelService {
  static async importClientes(file: File): Promise<ImportResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Simular procesamiento de archivo Excel/CSV
          const content = e.target?.result as string;
          const lines = content.split('\n');
          
          const result: ImportResult = {
            processed: lines.length - 1, // Excluir header
            errors: Math.floor(Math.random() * 5),
            warnings: Math.floor(Math.random() * 10),
            details: []
          };

          // Simular validaciones y errores
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line) {
              const columns = line.split(',');
              if (columns.length < 8) {
                result.details.push({
                  row: i + 1,
                  type: 'error',
                  message: 'Faltan columnas requeridas'
                });
              } else if (!this.validateRFC(columns[5])) {
                result.details.push({
                  row: i + 1,
                  type: 'warning',
                  message: 'RFC con formato incorrecto'
                });
              }
            }
          }

          setTimeout(() => resolve(result), 2000);
        } catch (error) {
          resolve({
            processed: 0,
            errors: 1,
            warnings: 0,
            details: [{ type: 'error', message: 'Error al procesar archivo' }]
          });
        }
      };
      reader.readAsText(file);
    });
  }

  static async importProductos(file: File): Promise<ImportResult> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const lines = content.split('\n');
          
          const result: ImportResult = {
            processed: lines.length - 1,
            errors: Math.floor(Math.random() * 3),
            warnings: Math.floor(Math.random() * 8),
            details: []
          };

          setTimeout(() => resolve(result), 2500);
        } catch (error) {
          resolve({
            processed: 0,
            errors: 1,
            warnings: 0,
            details: [{ type: 'error', message: 'Error al procesar archivo' }]
          });
        }
      };
      reader.readAsText(file);
    });
  }

  static async exportData(data: any[], options: ExportOptions): Promise<string> {
    // Simular exportación
    return new Promise((resolve) => {
      setTimeout(() => {
        const filename = `${options.filename}_${new Date().toISOString().split('T')[0]}.${options.format}`;
        resolve(filename);
      }, 1000);
    });
  }

  static generateTemplate(type: string): string {
    const templates = {
      clientes: 'nombre,status,telefono,correo,direccion,rfc,saldo,precio_especial,descuento,metodo_pago_preferido,comentarios\n"Ejemplo Cliente","Activo","555-0123","cliente@email.com","Av. Ejemplo 123","EJE123456789",0.00,FALSE,0.0,"Efectivo","Cliente de ejemplo"',
      productos: 'codigo,descripcion,status,linea,ubicacion,unidad_sat,clave_sat,precio_base,costo,stock_min,stock_max\n"PROD-001","Producto Ejemplo","Activo","Línea 1","A-01-01","PZA","01010101",100.00,60.00,10,100',
      proveedores: 'nombre,status,telefono,correo,direccion,rfc,saldo,metodo_pago_habitual,condiciones_credito\n"Proveedor Ejemplo","Activo","555-0123","proveedor@email.com","Av. Proveedor 123","PRO123456789",0.00,"Transferencia","30 días"'
    };

    return templates[type as keyof typeof templates] || '';
  }

  private static validateRFC(rfc: string): boolean {
    const rfcPattern = /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/;
    return rfcPattern.test(rfc?.replace(/[^A-ZÑ&0-9]/g, ''));
  }
}