import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener status del sistema' })
  @ApiResponse({ 
    status: 200, 
    description: 'Status del sistema obtenido correctamente',
    type: String // Importante: especifica el tipo de respuesta
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
