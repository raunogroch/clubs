import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Controlador principal de la aplicación
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Endpoint raíz que retorna saludo
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
