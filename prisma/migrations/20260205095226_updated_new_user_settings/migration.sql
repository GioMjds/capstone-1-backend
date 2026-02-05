-- AlterTable
ALTER TABLE "UserNotificationSettings" ADD COLUMN     "digestFrequency" TEXT NOT NULL DEFAULT 'daily',
ADD COLUMN     "emailByCategory" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "marketingOptIn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pushByCategory" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "quietHoursEnd" TEXT,
ADD COLUMN     "quietHoursStart" TEXT,
ADD COLUMN     "smsAlerts" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "UserSecuritySettings" ADD COLUMN     "backupCodes" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "ipRestrictions" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "loginAlerts" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "passwordRotationReminder" INTEGER NOT NULL DEFAULT 90,
ADD COLUMN     "sessionExpiration" INTEGER NOT NULL DEFAULT 3600,
ADD COLUMN     "suspiciousActivityAlerts" JSONB NOT NULL DEFAULT '{}';

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" VARCHAR(12) NOT NULL,
    "userPreferencesId" TEXT NOT NULL,
    "activityType" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginHistory" (
    "id" VARCHAR(12) NOT NULL,
    "userPreferencesId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "deviceName" TEXT,
    "loginMethod" TEXT,
    "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logoutAt" TIMESTAMP(3),
    "duration" INTEGER,

    CONSTRAINT "LoginHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataOwnershipSettings" (
    "id" VARCHAR(12) NOT NULL,
    "userPreferencesId" TEXT NOT NULL,
    "exportFormat" TEXT NOT NULL DEFAULT 'json',
    "dataRetentionDays" INTEGER NOT NULL DEFAULT 365,
    "allowAutoDelete" BOOLEAN NOT NULL DEFAULT false,
    "allowDataAnonymization" BOOLEAN NOT NULL DEFAULT false,
    "dataExportRequests" JSONB NOT NULL DEFAULT '[]',
    "dataDeletionRequests" JSONB NOT NULL DEFAULT '[]',
    "dataCorrections" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataOwnershipSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivacySettings" (
    "id" VARCHAR(12) NOT NULL,
    "userPreferencesId" TEXT NOT NULL,
    "profileVisibility" TEXT NOT NULL DEFAULT 'private',
    "activityVisibility" JSONB NOT NULL DEFAULT '{}',
    "fieldLevelVisibility" JSONB NOT NULL DEFAULT '{}',
    "onlinePresence" TEXT NOT NULL DEFAULT 'hidden',
    "allowPublicProfile" BOOLEAN NOT NULL DEFAULT false,
    "allowSearchEngineIndex" BOOLEAN NOT NULL DEFAULT false,
    "allowThirdPartySharing" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivacySettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityLog_userPreferencesId_idx" ON "ActivityLog"("userPreferencesId");

-- CreateIndex
CREATE INDEX "ActivityLog_timestamp_idx" ON "ActivityLog"("timestamp");

-- CreateIndex
CREATE INDEX "LoginHistory_userPreferencesId_idx" ON "LoginHistory"("userPreferencesId");

-- CreateIndex
CREATE INDEX "LoginHistory_loginAt_idx" ON "LoginHistory"("loginAt");

-- CreateIndex
CREATE UNIQUE INDEX "DataOwnershipSettings_userPreferencesId_key" ON "DataOwnershipSettings"("userPreferencesId");

-- CreateIndex
CREATE UNIQUE INDEX "PrivacySettings_userPreferencesId_key" ON "PrivacySettings"("userPreferencesId");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginHistory" ADD CONSTRAINT "LoginHistory_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataOwnershipSettings" ADD CONSTRAINT "DataOwnershipSettings_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivacySettings" ADD CONSTRAINT "PrivacySettings_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
