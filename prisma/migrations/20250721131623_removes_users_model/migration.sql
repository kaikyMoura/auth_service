/*
  Warnings:

  - You are about to drop the `user_sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."user_sessions" DROP CONSTRAINT "user_sessions_user_id_fkey";

-- DropTable
DROP TABLE "public"."user_sessions";

-- DropTable
DROP TABLE "public"."users";

-- DropEnum
DROP TYPE "public"."Gender";

-- DropEnum
DROP TYPE "public"."Role";

-- CreateTable
CREATE TABLE "audit"."audit_logs" (
    "id" UUID NOT NULL,
    "table_name" VARCHAR(100) NOT NULL,
    "record_id" UUID NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "user_id" UUID,
    "ip_address" INET,
    "user_agent" TEXT,
    "action" "audit"."AuditAction" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit"."user_sessions" (
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
CREATE INDEX "idx_auditlog_table_name" ON "audit"."audit_logs"("table_name");

-- CreateIndex
CREATE INDEX "idx_auditlog_record_id" ON "audit"."audit_logs"("record_id");

-- CreateIndex
CREATE INDEX "idx_auditlog_action" ON "audit"."audit_logs"("action");

-- CreateIndex
CREATE INDEX "idx_auditlog_user_id" ON "audit"."audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "idx_auditlog_created_at" ON "audit"."audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "idx_usersession_user_id" ON "audit"."user_sessions"("user_id");

-- CreateIndex
CREATE INDEX "idx_usersession_refresh_token" ON "audit"."user_sessions"("refresh_token");

-- CreateIndex
CREATE INDEX "idx_usersession_expires_at" ON "audit"."user_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "idx_usersession_is_active" ON "audit"."user_sessions"("is_active");

-- CreateIndex
CREATE INDEX "idx_usersession_last_used_at" ON "audit"."user_sessions"("last_used_at");
