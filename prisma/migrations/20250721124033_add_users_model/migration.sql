-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "audit";

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'STAFF', 'EMPLOYEE', 'MANAGER', 'CLIENT');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'NON_BINARY', 'TRANS', 'AGENDER', 'GENDER_FLUID', 'GENDER_QUEER', 'GENDER_NON_CONFORMING', 'GENDER_EXPANSIVE', 'PREFER_NOT_TO_SAY', 'OTHER');

-- CreateEnum
CREATE TYPE "audit"."AuditAction" AS ENUM ('INSERT', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'EMPLOYEE',
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "avatar" TEXT,
    "date_of_birth" DATE,
    "gender" "public"."Gender",
    "address" TEXT,
    "city" VARCHAR(100),
    "state" VARCHAR(100),
    "zip_code" VARCHAR(20),
    "country" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMPTZ,
    "last_login_at" TIMESTAMPTZ,
    "password_reset_token" TEXT,
    "password_reset_token_expires_at" TIMESTAMPTZ,
    "verification_token" TEXT,
    "verification_token_expires_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "user_agent" TEXT,
    "ip_address" INET,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "updated_at" TIMESTAMPTZ NOT NULL,
    "last_used_at" TIMESTAMPTZ,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "public"."users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_password_reset_token_key" ON "public"."users"("password_reset_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_verification_token_key" ON "public"."users"("verification_token");

-- CreateIndex
CREATE INDEX "idx_user_email" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "idx_user_phone" ON "public"."users"("phone");

-- CreateIndex
CREATE INDEX "idx_user_role" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "idx_user_is_active" ON "public"."users"("is_active");

-- CreateIndex
CREATE INDEX "idx_user_created_at" ON "public"."users"("created_at");

-- CreateIndex
CREATE INDEX "idx_user_deleted_at" ON "public"."users"("deleted_at");

-- CreateIndex
CREATE INDEX "idx_usersession_user_id" ON "public"."user_sessions"("user_id");

-- CreateIndex
CREATE INDEX "idx_usersession_refresh_token" ON "public"."user_sessions"("refresh_token");

-- CreateIndex
CREATE INDEX "idx_usersession_expires_at" ON "public"."user_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "idx_usersession_is_active" ON "public"."user_sessions"("is_active");

-- CreateIndex
CREATE INDEX "idx_usersession_last_used_at" ON "public"."user_sessions"("last_used_at");

-- AddForeignKey
ALTER TABLE "public"."user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
