import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggerService } from './shared/loggers/logger.service';
import { MemoryMonitor } from './shared/utils/memory-monitor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(LoggerService);

  const port = configService.get<number>('PORT', 5000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  const memoryMonitor = app.get(MemoryMonitor);
  if (memoryMonitor) {
    memoryMonitor?.logMemoryUsageWithContext?.('APPLICATION_START', {
      detailed: true,
    });
  }

  app.use(
    helmet({
      contentSecurityPolicy: nodeEnv === 'production' ? undefined : false,
    }),
  );

  app.use(compression());

  const allowedOrigins =
    configService.get<string>('ALLOWED_ORIGINS')?.split(',') || [];

  if (nodeEnv === 'development') {
    allowedOrigins.push('http://localhost:3000', 'http://localhost:3001');
  }

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Swagger documentation
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Auth Service API')
      .setDescription('Auth service API with comprehensive features')
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Auth', 'User authentication and authorization')
      .addServer(`http://localhost:${port}`, 'Development server')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
    logger.log(`📚 Swagger documentation available at
http://localhost:${port}/docs`);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableShutdownHooks();

  await app.listen(port ?? 5000);

  logger.log(`🚀 Auth service is running on port ${port}`);
  logger.log(`🌍 Environment: ${nodeEnv}`);
}
void bootstrap();
