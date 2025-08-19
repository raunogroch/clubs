// Servicio principal de la aplicación
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * Retorna saludo de prueba
   */
  getHello(): string {
    return 'Hello World!';
  }
}
