/*
  Warnings:

  - You are about to drop the column `notificationSettings` on the `UserPreferences` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PreferenceCategory" AS ENUM ('UI', 'NOTIFICATION', 'SECURITY', 'COMPLIANCE', 'ACCOUNT', 'ACTIVITY');

-- AlterTable
ALTER TABLE "UserPreferences" DROP COLUMN "notificationSettings";

-- CreateTable
CREATE TABLE "UserNotificationSettings" (
    "id" VARCHAR(12) NOT NULL,
    "userPreferencesId" TEXT NOT NULL,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT false,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserNotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountControlSettings" (
    "id" VARCHAR(12) NOT NULL,
    "userPreferencesId" TEXT NOT NULL,
    "deactivated" BOOLEAN NOT NULL DEFAULT false,
    "deactivatedAt" TIMESTAMP(3),
    "deletionRequested" BOOLEAN NOT NULL DEFAULT false,
    "deletionRequestedAt" TIMESTAMP(3),
    "recoveryToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccountControlSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveSession" (
    "id" VARCHAR(12) NOT NULL,
    "userPreferencesId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActiveSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrustedDevice" (
    "id" VARCHAR(12) NOT NULL,
    "userPreferencesId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "deviceName" TEXT,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrustedDevice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserNotificationSettings_userPreferencesId_key" ON "UserNotificationSettings"("userPreferencesId");

-- CreateIndex
CREATE UNIQUE INDEX "AccountControlSettings_userPreferencesId_key" ON "AccountControlSettings"("userPreferencesId");

-- CreateIndex
CREATE INDEX "ActiveSession_userPreferencesId_idx" ON "ActiveSession"("userPreferencesId");

-- CreateIndex
CREATE INDEX "ActiveSession_lastSeen_idx" ON "ActiveSession"("lastSeen");

-- CreateIndex
CREATE INDEX "TrustedDevice_userPreferencesId_idx" ON "TrustedDevice"("userPreferencesId");

-- AddForeignKey
ALTER TABLE "UserNotificationSettings" ADD CONSTRAINT "UserNotificationSettings_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountControlSettings" ADD CONSTRAINT "AccountControlSettings_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveSession" ADD CONSTRAINT "ActiveSession_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrustedDevice" ADD CONSTRAINT "TrustedDevice_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
