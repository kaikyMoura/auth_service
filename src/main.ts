import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggerService } from './shared/loggers/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const logger = new LoggerService();
  
  const port = configService.get('PORT');

  const nodeEnv = configService.get('NODE_ENV');

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
        .setDescription(
          'Auth service API with comprehensive features',
        )
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

  // Versioning
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'X-API-VERSION',
    defaultVersion: '1',
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  logger.log(`🚀 Auth service is running on port ${port}`);


  await app.listen(port);
  logger.log(`🚀 Auth service is running on port ${port}`);
}
void bootstrap();
