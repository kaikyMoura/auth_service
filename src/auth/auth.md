# Auth Module

## Overview

The Auth module manages authentication, authorization, and secure session handling. It validates user credentials, issues tokens, enforces role-based access control, manages sessions, and supports password recovery and verification flows.

## Entities

- User: Represents the authenticated user.
- UserSession: Represents a user session (login, refresh, logout).

## Services

- AuthService: Manages user authentication, token generation, and session handling.
- TokenService: Manages token generation and validation.

## Controllers

- AuthController: Handles user authentication, token generation, and session handling.

## DTOs
- JwtPayload: Represents the payload of the JWT token.

## Types

- AuthTokens: Represents the authentication tokens.
- AuthResponse: Represents the authentication response.

## Guards

- JwtGuard: Protects routes that require authentication.
- ThrottlerGuard: Protects routes from brute force attacks.

## Strategies

- JwtStrategy: Strategy for JWT authentication.

## Endpoints

| Method | Endpoint | Description | Public |
|--------|----------|-------------|--------|
| POST   | /auth/login | Login a user and return the access and refresh tokens | Yes |
| POST   | /auth/register | Register a user and return the access and refresh tokens | Yes |
| POST   | /auth/logout | Logout a user and return the access and refresh tokens | No |
| POST   | /auth/refresh | Refresh a user token and return the access and refresh tokens | No |

