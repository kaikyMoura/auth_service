<div align="center">

# 🔐 Auth Service API

**Auth Service** is a robust authentication and authorization backend for modern applications. It provides secure user authentication, session management, role-based access control (RBAC), and token lifecycle management. Built with NestJS, TypeScript, Prisma, and Redis, it is designed for scalability, security, and extensibility.

</div>

<div align="center">

![GitHub top language](https://img.shields.io/github/languages/top/kaikyMoura/auth_service)
![Repository size](https://img.shields.io/github/repo-size/kaikyMoura/auth_service)
![Github last commit](https://img.shields.io/github/last-commit/kaikyMoura/auth_service)
![License](https://img.shields.io/badge/license-UNLICENSED-blue)
![Languages count](https://img.shields.io/github/languages/count/kaikyMoura/auth_service)

</div>

---

## 1. About the Project

Auth Service is a secure, scalable, and extensible authentication and authorization API, ideal for microservices and modern web/mobile backends. It features JWT-based authentication, refresh token rotation, session tracking, RBAC, and integrates with external user services. The service is built with NestJS, Prisma, and Redis for high performance and reliability.

### 🏗️ **Architecture Highlights**

- **Clean Architecture**: Separation of concerns with domain, application, and infrastructure layers
- **Dependency Injection**: Token-based DI for better testability and flexibility
- **Modular Design**: Well-organized modules with clear boundaries
- **Type Safety**: Full TypeScript implementation with strict validation
- **Security First**: Comprehensive security measures and best practices

---

## 2. Features

### 🔐 Authentication & Security
- JWT-based authentication (access and refresh tokens)
- Refresh token rotation and session invalidation
- Role-based access control (RBAC)
- Secure session management with session tracking
- Rate limiting and brute-force protection (Throttler)
- Password hashing with bcrypt
- Caching with Redis for user/session data
- Google OAuth login support

### 👥 User Management
- User registration and login
- Integration with external user service (via HTTP)
- Profile and credential validation
- Account activation and status checks

### 🛡️ API Protection
- Guards for JWT and throttling
- Global error handling and logging
- Audit logging for authentication events
- **Enhanced CORS configuration** with environment-based origins
- **Request/Response interceptors** for monitoring and logging

### 📈 Observability & Health
- Health, readiness, and liveness endpoints for monitoring
- **Enhanced Swagger documentation** with detailed API descriptions
- Environment-based configuration and validation
- Modular, extensible architecture
- **Memory monitoring** and performance tracking
- **Structured logging** with Winston

---

## 3. Technologies

- **NestJS** (Node.js framework)
- **TypeScript** (with strict configuration)
- **Prisma** (ORM with PostgreSQL)
- **PostgreSQL** (primary database)
- **Redis** (cache/session store)
- **Passport.js** (authentication strategies)
- **JWT** (token management)
- **Axios** (HTTP client for external services)
- **Jest** (testing framework)
- **ESLint/Prettier** (code quality and formatting)
- **Winston** (structured logging)
- **Helmet** (security headers)
- **Compression** (response compression)

---

## 4. Installation

### Prerequisites
- **Node.js** 18+
- **PostgreSQL** 14+
- **Redis** (for caching)
- **pnpm** (recommended package manager)

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/kaikyMoura/auth_service.git
cd auth_service

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Set up database
pnpm db:migrate
pnpm db:generate

# 5. Start development server
pnpm start:dev
```

---

## 5. Environment Setup

### Required Environment Variables

```env
# Application
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/auth_service"

# JWT Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key_here_minimum_32_characters
JWT_ACCESS_EXPIRES=1h
JWT_REFRESH_EXPIRES=7d

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_TTL=300
REDIS_MAX_ITEMS=100

# Rate Limiting
THROTTLER_TTL=60
THROTTLER_LIMIT=10

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# External Services
USERS_SERVICE_URL=http://localhost:3001

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CREDENTIALS=your_google_credentials_json
```

#### Environment Variables Explained
- **NODE_ENV**: Application environment (`development`, `production`, `test`)
- **PORT**: Port where the server will listen
- **DATABASE_URL**: PostgreSQL connection string
- **JWT_SECRET_KEY**: Secret key for signing JWT tokens (use a strong, unique value)
- **JWT_ACCESS_EXPIRES**: Access token expiration (e.g., `1h`)
- **JWT_REFRESH_EXPIRES**: Refresh token expiration (e.g., `7d`)
- **REDIS_URL**: Redis connection string
- **REDIS_TTL**: Default cache TTL in seconds
- **REDIS_MAX_ITEMS**: Max items in Redis cache
- **THROTTLER_TTL**: Rate limiter window in seconds
- **THROTTLER_LIMIT**: Max requests per window
- **ALLOWED_ORIGINS**: Comma-separated list of allowed CORS origins
- **USERS_SERVICE_URL**: URL of the external user service
- **GOOGLE_CLIENT_ID**: Google OAuth client ID
- **GOOGLE_CREDENTIALS**: Google OAuth credentials JSON string

---

## 6. API Documentation

- **Swagger UI:** [http://localhost:5000/docs](http://localhost:5000/docs)

### Main Endpoints

#### Authentication
- `POST /auth/register` — Register a new user
- `POST /auth/login` — User login
- `POST /auth/logout` — User logout (requires refresh token)
- `POST /auth/refresh-token` — Refresh JWT token
- `POST /auth/google/login` — Google OAuth login
- `POST /auth/google/signup` — Google OAuth signup
- `POST /auth/google/callback` — Google OAuth callback

#### Health & Monitoring
- `GET /health` — General health check
- `GET /health/simple` — Simple health check
- `GET /health/ready` — Readiness probe
- `GET /health/live` — Liveness probe

#### (User management is handled by an external service)

---

## 7. Development

### Available Scripts

```bash
# Development
pnpm start:dev          # Start development server with hot reload
pnpm start:dev:gc       # Start with garbage collection monitoring
pnpm start:debug        # Start with debug mode
pnpm start:prod         # Start production server

# Testing
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:cov           # Run tests with coverage
pnpm test:ci            # Run tests for CI/CD
pnpm test:e2e           # Run end-to-end tests
pnpm test:debug         # Run tests with debugger

# Code Quality
pnpm lint               # Run ESLint with auto-fix
pnpm lint:check         # Run ESLint without auto-fix
pnpm format             # Format code with Prettier
pnpm type-check         # Run TypeScript type checking
pnpm check-all          # Run all checks (lint, type-check, tests)

# Database
pnpm db:generate        # Generate Prisma client
pnpm db:migrate         # Deploy database migrations
pnpm db:migrate:dev     # Create and apply new migration
pnpm db:migrate:reset   # Reset database and apply migrations
pnpm db:studio          # Open Prisma Studio
pnpm db:seed            # Seed database with initial data

# Build & Clean
pnpm build              # Build the application
pnpm clean              # Clean build artifacts
```

### Project Structure

```
src/
├── application/           # Application layer (use cases, DTOs, services)
│   ├── dtos/             # Data Transfer Objects
│   ├── services/         # Application services
│   └── use-cases/        # Business logic use cases
├── controllers/          # HTTP controllers
├── domain/               # Domain layer (entities, interfaces, enums)
│   ├── enums/           # Domain enums
│   └── interfaces/      # Domain interfaces
├── infra/                # Infrastructure layer
│   ├── audit/           # Audit logging
│   ├── decorators/      # Custom decorators
│   ├── google-auth/     # Google OAuth integration
│   ├── guards/          # Authentication guards
│   ├── interceptors/    # Request/response interceptors
│   ├── logger/          # Logging infrastructure
│   ├── prisma/          # Database layer
│   └── strategies/      # Passport strategies
├── libs/                 # Shared libraries
│   └── users-client/    # External user service client
├── modules/              # Feature modules
│   ├── health/          # Health check module
│   └── sessions/        # Session management module
├── shared/               # Shared utilities and configurations
│   ├── config/          # Configuration files
│   ├── interceptors/    # Global interceptors
│   ├── schemas/         # Environment validation schemas
│   ├── tasks/           # Scheduled tasks
│   ├── types/           # Shared types
│   └── utils/           # Utility functions
├── app.module.ts         # Root application module
├── auth.module.ts        # Authentication module
└── main.ts              # Application bootstrap
```

### Architecture Patterns

#### **Clean Architecture**
- **Domain Layer**: Core business logic and entities
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: External dependencies and implementations

#### **Dependency Injection**
- **Token-based DI**: Using Symbol tokens for better type safety
- **Interface-based contracts**: Loose coupling between layers
- **Modular providers**: Clear separation of concerns

#### **Validation & Security**
- **Class-validator**: Comprehensive input validation
- **Custom decorators**: Reusable validation logic
- **Security headers**: Helmet integration
- **Rate limiting**: Throttler protection

---

## 8. Troubleshooting

- **Database connection issues:** Check your `DATABASE_URL` and if PostgreSQL is running.
- **Redis issues:** Ensure Redis is running and `REDIS_URL` is correct.
- **JWT issues:** Use a strong `JWT_SECRET_KEY` (minimum 32 characters) and check expiration settings.
- **External user service:** Make sure `USERS_SERVICE_URL` is reachable.
- **Google OAuth issues:** Check your `GOOGLE_CLIENT_ID` and credentials.
- **Dependency injection errors:** Verify that all tokens are properly exported and imported.

---

## 9. Deployment

```bash
# Build and start production
pnpm build
pnpm start:prod
```

Or use Docker:

```bash
docker build -t auth-service .
docker run -p 5000:5000 \
  -e DATABASE_URL="your_production_db_url" \
  -e JWT_SECRET_KEY="your_production_jwt_secret" \
  -e GOOGLE_CLIENT_ID="your_google_client_id" \
  -e GOOGLE_CREDENTIALS="your_google_credentials_json" \
  auth-service
```

---

## 📝 Terms of Use

- **Non-commercial** project.
- All rights related to user data and privacy are respected.
- This project aims to serve as a learning and portfolio tool.

---

## Author

Kaiky Tupinambá — Fullstack Developer
