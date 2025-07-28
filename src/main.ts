import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { LoggerService } from './infra/logger/logger.service';
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
    configService.get<string>('ALLOWED_ORIGINS')?.split(',') ?? [];

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
        `
        🔐 **Auth Service API** - Secure authentication and authorization backend
        
        ## Features
        - JWT-based authentication with refresh tokens
        - Google OAuth integration
        - Role-based access control (RBAC)
        - Session management and tracking
        - Rate limiting and security protection
        - Audit logging for all operations
        
        ## Authentication
        Most endpoints require authentication. Use the JWT token from login/register endpoints in the Authorization header:
        \`Authorization: Bearer <your-jwt-token>\`
        
        ## Rate Limiting
        API endpoints are rate-limited to prevent abuse. Limits are applied per IP address.
        
        ## Error Handling
        All errors return consistent JSON responses with appropriate HTTP status codes.
      `,
      )
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token from login/register endpoints',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Auth', 'User authentication and authorization endpoints')
      .addTag('Health', 'Health check and monitoring endpoints')
      .addServer(`http://localhost:${port}`, 'Development server')
      .addServer('https://api.example.com', 'Production server')
      .setContact(
        'Kaiky Tupinambá',
        'https://github.com/kaikyMoura',
        'kaikydev@gmail.com',
      )
      .setLicense('UNLICENSED', 'https://github.com/kaikyMoura/auth_service')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
        docExpansion: 'list',
        filter: true,
        showRequestDuration: true,
        tryItOutEnabled: true,
      },
      customSiteTitle: 'Auth Service API Documentation',
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { color: #2c3e50; font-size: 2.5em; }
        .swagger-ui .info .description { font-size: 1.1em; line-height: 1.6; }
      `,
    });
    logger.log(
      `📚 Swagger documentation available at http://localhost:${port}/docs`,
    );
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableShutdownHooks();

  await app.listen(port ?? 5000);

  logger.log(`🚀 Auth service is running on port ${port}`);
  logger.log(`🌍 Environment: ${nodeEnv}`);
  logger.log(`🔗 API Base URL: http://localhost:${port}`);
  if (nodeEnv !== 'production') {
    logger.log(`📖 API Documentation: http://localhost:${port}/docs`);
  }
}
void bootstrap();
