import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { HealthService } from './health.service';
import { Response } from 'express';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getGeneralHealth(@Res() res: Response) {
    const health = await this.healthService.getGeneralHealth();
    const status = health.status === 'HEALTHY' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    return res.status(status).json(health);
  }

  @Get('db')
  async getDbHealth(@Res() res: Response) {
    const dbHealth = await this.healthService.checkDatabase();
    const status = dbHealth.status === 'UP' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    return res.status(status).json(dbHealth);
  }

  @Get('redis')
  async getRedisHealth(@Res() res: Response) {
    const redisHealth = await this.healthService.checkRedis();
    const status = redisHealth.status === 'UP' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    return res.status(status).json(redisHealth);
  }

  @Get('storage')
  async getStorageHealth(@Res() res: Response) {
    const storageHealth = await this.healthService.checkStorage();
    const status = storageHealth.status === 'UP' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
    return res.status(status).json(storageHealth);
  }
}
