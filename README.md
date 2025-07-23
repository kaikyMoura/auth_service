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

This project implements a secure authentication and authorization API, ideal for microservices and modern web/mobile backends. It features JWT-based authentication, refresh token rotation, session tracking, RBAC, and integrates with external user services. The service is built with NestJS, Prisma, and Redis for high performance and reliability.

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

### 👥 User Management
- User registration and login
- Integration with external user service (via HTTP)
- Profile and credential validation
- Account activation and status checks

### 🛡️ API Protection
- Guards for JWT and throttling
- Global error handling and logging
- Audit logging for authentication events

### 🧰 Developer Experience
- Swagger/OpenAPI documentation (`/docs`)
- Environment-based configuration and validation
- Modular, extensible architecture

---

## 3. Technologies

- **NestJS** (Node.js framework)
- **TypeScript**
- **Prisma** (ORM)
- **PostgreSQL** (database)
- **Redis** (cache/session store)
- **Passport.js** (authentication)
- **JWT** (token management)
- **Axios** (HTTP client for user service)
- **Jest** (testing)
- **ESLint/Prettier** (code quality)

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
git clone https://github.com/your-org/auth-service.git
cd auth-service

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# 4. Set up database
pnpm prisma migrate deploy
pnpm prisma generate

# 5. Start development server
pnpm start:dev
```

---

## 5. Environment Setup

### Required Environment Variables

```env
NODE_ENV=development
PORT=5000

DATABASE_URL="postgresql://user:password@localhost:5432/auth_service"

JWT_SECRET_KEY=your_super_secret_jwt_key_here
JWT_ACCESS_EXPIRES=1h
JWT_REFRESH_EXPIRES=7d

REDIS_URL=redis://localhost:6379
REDIS_TTL=300
REDIS_MAX_ITEMS=100

THROTTLER_TTL=60
THROTTLER_LIMIT=10

ALLOWED_ORIGINS=http://localhost:3000
USERS_SERVICE_URL=http://localhost:3001
```

---

## 6. API Documentation

- **Swagger UI:** [http://localhost:5000/docs](http://localhost:5000/docs)

### Main Endpoints

#### Authentication
- `POST /auth/register` — Register a new user
- `POST /auth/login` — User login
- `POST /auth/logout` — User logout (requires refresh token)
- `POST /auth/refresh-token` — Refresh JWT token

#### (User management is handled by an external service)

---

## 7. Development

### Available Scripts

```bash
pnpm start:dev          # Start development server with hot reload
pnpm start:prod         # Start production server
pnpm test               # Run unit tests
pnpm test:e2e           # Run end-to-end tests
pnpm test:cov           # Run tests with coverage
pnpm lint               # Run ESLint
pnpm format             # Format code with Prettier
pnpm prisma studio      # Open Prisma Studio
pnpm prisma migrate dev # Create and apply new migration
pnpm prisma generate    # Generate Prisma client
```

### Project Structure

```
src/
├── auth/           # Authentication and authorization logic
├── sessions/       # Session management
├── shared/         # Shared modules (logger, interceptors, configs, etc)
├── users-client/   # Integration with external user service
└── main.ts         # Application bootstrap
```

---

## 8. Troubleshooting

- **Database connection issues:** Check your `DATABASE_URL` and if PostgreSQL is running.
- **Redis issues:** Ensure Redis is running and `REDIS_URL` is correct.
- **JWT issues:** Use a strong `JWT_SECRET_KEY` and check expiration settings.
- **External user service:** Make sure `USERS_SERVICE_URL` is reachable.

---

## 9. Deployment

```bash
pnpm build
pnpm start:prod
```

Or use Docker:

```bash
docker build -t auth-service .
docker run -p 5000:5000 \
  -e DATABASE_URL="your_production_db_url" \
  -e JWT_SECRET_KEY="your_production_jwt_secret" \
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
