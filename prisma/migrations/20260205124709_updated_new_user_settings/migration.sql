/*
  Warnings:

  - The values [UI,COMPLIANCE] on the enum `PreferenceCategory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `uiPreferences` on the `UserPreferences` table. All the data in the column will be lost.
  - You are about to drop the `ComplianceAuditLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserComplianceSettings` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PreferenceCategory_new" AS ENUM ('ACCESSIBILITY', 'CUSTOMIZATION', 'NOTIFICATION', 'SECURITY', 'PRIVACY', 'ACCOUNT', 'ACTIVITY', 'DATA_OWNERSHIP');
ALTER TYPE "PreferenceCategory" RENAME TO "PreferenceCategory_old";
ALTER TYPE "PreferenceCategory_new" RENAME TO "PreferenceCategory";
DROP TYPE "public"."PreferenceCategory_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ComplianceAuditLog" DROP CONSTRAINT "ComplianceAuditLog_complianceSettingsId_fkey";

-- DropForeignKey
ALTER TABLE "UserComplianceSettings" DROP CONSTRAINT "UserComplianceSettings_userPreferencesId_fkey";

-- AlterTable
ALTER TABLE "PrivacySettings" ADD COLUMN     "auditLogPreference" TEXT NOT NULL DEFAULT 'full',
ADD COLUMN     "dataRetentionMonths" INTEGER NOT NULL DEFAULT 12,
ADD COLUMN     "dataShareConsent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserPreferences" DROP COLUMN "uiPreferences";

-- DropTable
DROP TABLE "ComplianceAuditLog";

-- DropTable
DROP TABLE "UserComplianceSettings";

-- CreateTable
CREATE TABLE "AccessibilitySettings" (
    "id" VARCHAR(12) NOT NULL,
    "userPreferencesId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "dateFormat" TEXT NOT NULL DEFAULT 'MM/DD/YYYY',
    "numberFormat" TEXT NOT NULL DEFAULT '1,000.00',
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "timeFormat" TEXT NOT NULL DEFAULT '12h',
    "highContrastMode" BOOLEAN NOT NULL DEFAULT false,
    "reducedMotion" BOOLEAN NOT NULL DEFAULT false,
    "screenReaderOptimized" BOOLEAN NOT NULL DEFAULT false,
    "fontSize" TEXT NOT NULL DEFAULT 'medium',
    "keyboardNavigation" BOOLEAN NOT NULL DEFAULT false,
    "colorBlindMode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessibilitySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomizationSettings" (
    "id" VARCHAR(12) NOT NULL,
    "userPreferencesId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "layoutPreferences" JSONB NOT NULL DEFAULT '{}',
    "defaultViews" JSONB NOT NULL DEFAULT '{}',
    "sortFilterDefaults" JSONB NOT NULL DEFAULT '{}',
    "paginationSize" INTEGER NOT NULL DEFAULT 10,
    "featureToggles" JSONB NOT NULL DEFAULT '{}',
    "betaFeaturesOptIn" BOOLEAN NOT NULL DEFAULT false,
    "aiFeaturesOptIn" BOOLEAN NOT NULL DEFAULT false,
    "contentSensitivityFilters" JSONB NOT NULL DEFAULT '{}',
    "sidebarCollapsed" BOOLEAN NOT NULL DEFAULT false,
    "compactMode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomizationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccessibilitySettings_userPreferencesId_key" ON "AccessibilitySettings"("userPreferencesId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomizationSettings_userPreferencesId_key" ON "CustomizationSettings"("userPreferencesId");

-- AddForeignKey
ALTER TABLE "AccessibilitySettings" ADD CONSTRAINT "AccessibilitySettings_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomizationSettings" ADD CONSTRAINT "CustomizationSettings_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
