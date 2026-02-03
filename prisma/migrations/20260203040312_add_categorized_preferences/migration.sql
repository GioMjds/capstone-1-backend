/*
  Warnings:

  - You are about to drop the column `language` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the column `notifications` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `UserPreferences` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `UserPreferences` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserPreferences" DROP CONSTRAINT "UserPreferences_userId_fkey";

-- AlterTable
ALTER TABLE "UserPreferences" DROP COLUMN "language",
DROP COLUMN "notifications",
DROP COLUMN "theme",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notificationSettings" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "uiPreferences" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "UserSecuritySettings" (
    "id" VARCHAR(12) NOT NULL,
    "userPreferencesId" TEXT NOT NULL,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorMethod" TEXT,
    "passwordChangedAt" TIMESTAMP(3),
    "activeSessions" JSONB NOT NULL DEFAULT '[]',
    "trustedDevices" JSONB NOT NULL DEFAULT '[]',
    "passkeysEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSecuritySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserComplianceSettings" (
    "id" VARCHAR(12) NOT NULL,
    "userPreferencesId" TEXT NOT NULL,
    "dataShareConsent" BOOLEAN NOT NULL DEFAULT false,
    "dataRetentionMonths" INTEGER NOT NULL DEFAULT 12,
    "allowAccountDeletion" BOOLEAN NOT NULL DEFAULT true,
    "auditLogPreference" TEXT NOT NULL DEFAULT 'full',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserComplianceSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreferenceAuditLog" (
    "id" VARCHAR(12) NOT NULL,
    "userPreferencesId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB NOT NULL,
    "changedBy" TEXT NOT NULL,
    "changeReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PreferenceAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityAuditLog" (
    "id" VARCHAR(12) NOT NULL,
    "securitySettingsId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceAuditLog" (
    "id" VARCHAR(12) NOT NULL,
    "complianceSettingsId" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplianceAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSecuritySettings_userPreferencesId_key" ON "UserSecuritySettings"("userPreferencesId");

-- CreateIndex
CREATE UNIQUE INDEX "UserComplianceSettings_userPreferencesId_key" ON "UserComplianceSettings"("userPreferencesId");

-- CreateIndex
CREATE INDEX "PreferenceAuditLog_userPreferencesId_idx" ON "PreferenceAuditLog"("userPreferencesId");

-- CreateIndex
CREATE INDEX "PreferenceAuditLog_createdAt_idx" ON "PreferenceAuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "SecurityAuditLog_securitySettingsId_idx" ON "SecurityAuditLog"("securitySettingsId");

-- CreateIndex
CREATE INDEX "SecurityAuditLog_createdAt_idx" ON "SecurityAuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "ComplianceAuditLog_complianceSettingsId_idx" ON "ComplianceAuditLog"("complianceSettingsId");

-- CreateIndex
CREATE INDEX "ComplianceAuditLog_createdAt_idx" ON "ComplianceAuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSecuritySettings" ADD CONSTRAINT "UserSecuritySettings_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserComplianceSettings" ADD CONSTRAINT "UserComplianceSettings_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreferenceAuditLog" ADD CONSTRAINT "PreferenceAuditLog_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityAuditLog" ADD CONSTRAINT "SecurityAuditLog_securitySettingsId_fkey" FOREIGN KEY ("securitySettingsId") REFERENCES "UserSecuritySettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplianceAuditLog" ADD CONSTRAINT "ComplianceAuditLog_complianceSettingsId_fkey" FOREIGN KEY ("complianceSettingsId") REFERENCES "UserComplianceSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
