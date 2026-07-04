import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('NestApplicationBootstrap');
  
  // Create NestJS app instance
  const app = await NestFactory.create(AppModule);

  // Configure Global API route prefixing to separate backend from frontends
  app.setGlobalPrefix('api');

  // Activate CORS for the Vite client applications
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  // Enable validation layers globally with strict options
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip out non-decorated parameter inputs automatically
      forbidNonWhitelisted: true, // block requests containing unauthorized values
      transform: true, // auto-cast incoming string paths/query to numbers, booleans etc
    }),
  );

  const PORT = process.env.BACKEND_PORT || 3005;
  await app.listen(PORT, '0.0.0.0');
  
  logger.log(`Every-zone Advanced NestJS Service is fully operational on: http://0.0.0.0:${PORT}/api`);
}

bootstrap();
export default bootstrap;
