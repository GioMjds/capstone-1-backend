import { Test, TestingModule } from '@nestjs/testing';
import { UserPreferencesController } from '@/modules/identity/preferences/preferences.controller';
import * as PreferenceUseCase from '@/application/use-cases/identity/preferences';
import * as UserPreferenceDto from '@/application/dto/identity/preferences';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/infrastructure/persistence';
import { UserMapper } from '@/infrastructure/persistence/prisma/mappers';
import { NotFoundException } from '@nestjs/common';

describe('UserPreferencesController (unit)', () => {
  let controller: UserPreferencesController;

  const testUserId = 'test-user-id-12345';

  const mockUiPreferences = {
    getTheme: () => UserPreferenceDto.ThemeEnum.LIGHT,
    getLanguage: () => 'en',
    getTimezone: () => 'UTC',
    getLocale: () => 'en-US',
  };

  const mockNotificationSettings = {
    isEmailNotificationsEnabled: () => true,
    isPushNotificationsEnabled: () => false,
    isSmsNotificationsEnabled: () => true,
    getDigestFrequency: () => UserPreferenceDto.DigestFrequency.DAILY,
    getQuietHours: () => ({ start: '22:00', end: '08:00' }),
    areSecurityAlertsEnabled: () => true,
  };

  const mockSecuritySettings = {
    isTwoFactorEnabled: () => false,
    getTwoFactorMethod: () => 'AUTHENTICATOR',
    arePasskeysEnabled: () => false,
    getPasswordChangedAt: () => new Date(),
    getActiveSessions: () => [],
    getTrustedDevices: () => [],
  };

  const mockComplianceSettings = {
    isDataShareConsentGiven: () => true,
    getDataRetentionMonths: () => 12,
    isAccountDeletionAllowed: () => true,
    getAuditLogPreference: () => UserPreferenceDto.AuditLogPreference.FULL,
  };

  const updateUiPreferencesUseMock = {
    execute: jest.fn().mockResolvedValue(mockUiPreferences),
  };
  const getUiPreferencesUseMock = {
    execute: jest.fn().mockResolvedValue(mockUiPreferences),
  };
  const updateNotificationSettingsUseMock = {
    execute: jest.fn().mockResolvedValue(mockNotificationSettings),
  };
  const getNotificationSettingsUseMock = {
    execute: jest.fn().mockResolvedValue(mockNotificationSettings),
  };
  const updateSecuritySettingsUseMock = {
    execute: jest.fn().mockResolvedValue(mockSecuritySettings),
  };
  const getSecuritySettingsUseMock = {
    execute: jest.fn().mockResolvedValue(mockSecuritySettings),
  };
  const updateComplianceSettingsUseMock = {
    execute: jest.fn().mockResolvedValue(mockComplianceSettings),
  };
  const getComplianceSettingsUseMock = {
    execute: jest.fn().mockResolvedValue(mockComplianceSettings),
  };
  const getPreferenceAuditLogsUseMock = {
    execute: jest
      .fn()
      .mockResolvedValue({ logs: [], total: 0, page: 1, limit: 20 }),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      controllers: [UserPreferencesController],
      providers: [
        JwtService,
        UserMapper,
        PrismaService,
        {
          provide: PreferenceUseCase.UpdateUiPreferencesUseCase,
          useValue: updateUiPreferencesUseMock,
        },
        {
          provide: PreferenceUseCase.GetUiPreferencesUseCase,
          useValue: getUiPreferencesUseMock,
        },
        {
          provide: PreferenceUseCase.UpdateNotificationSettingsUseCase,
          useValue: updateNotificationSettingsUseMock,
        },
        {
          provide: PreferenceUseCase.GetNotificationSettingsUseCase,
          useValue: getNotificationSettingsUseMock,
        },
        {
          provide: PreferenceUseCase.UpdateSecuritySettingsUseCase,
          useValue: updateSecuritySettingsUseMock,
        },
        {
          provide: PreferenceUseCase.GetSecuritySettingsUseCase,
          useValue: getSecuritySettingsUseMock,
        },
        {
          provide: PreferenceUseCase.UpdateComplianceSettingsUseCase,
          useValue: updateComplianceSettingsUseMock,
        },
        {
          provide: PreferenceUseCase.GetComplianceSettingsUseCase,
          useValue: getComplianceSettingsUseMock,
        },
        {
          provide: PreferenceUseCase.GetPreferenceAuditLogsUseCase,
          useValue: getPreferenceAuditLogsUseMock,
        },
        {
          provide: 'IUserRepository',
          useClass: PrismaService,
        },
      ],
    }).compile();

    controller = module.get<UserPreferencesController>(
      UserPreferencesController,
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('getUiPreferences should return UI preferences', async () => {
    const result = await controller.getUiPreferences(testUserId);
    expect(result).toBeDefined();
    expect(getUiPreferencesUseMock.execute).toHaveBeenCalledWith(testUserId);
  });

  it('updateUiPreferences should update and return UI preferences', async () => {
    const dto: UserPreferenceDto.UpdateUiPreferencesDto = {
      theme: UserPreferenceDto.ThemeEnum.DARK,
    };
    const result = await controller.updateUiPreferences(testUserId, dto);
    expect(result).toBeDefined();
    expect(updateUiPreferencesUseMock.execute).toHaveBeenCalledWith(
      testUserId,
      dto,
    );
  });

  it('updateUiPreferences should propagate errors from use case', async () => {
    const dto: UserPreferenceDto.UpdateUiPreferencesDto = {
      theme: 'INVALID' as UserPreferenceDto.ThemeEnum,
    };
    updateUiPreferencesUseMock.execute.mockRejectedValueOnce(
      new Error('Invalid theme'),
    );
    await expect(
      controller.updateUiPreferences(testUserId, dto),
    ).rejects.toThrow('Invalid theme');
  });

  it('getNotificationSettings should return notification settings', async () => {
    const result = await controller.getNotificationSettings(testUserId);
    expect(result).toBeDefined();
    expect(getNotificationSettingsUseMock.execute).toHaveBeenCalledWith(
      testUserId,
    );
  });

  it('updateNotificationSettings should update and return notification settings', async () => {
    const dto: UserPreferenceDto.UpdateNotificationSettingsDto = {
      emailNotifications: true,
    };
    const result = await controller.updateNotificationSettings(testUserId, dto);
    expect(result).toBeDefined();
    expect(updateNotificationSettingsUseMock.execute).toHaveBeenCalledWith(
      testUserId,
      dto,
    );
  });

  it('updateNotificationSettings should propagate errors from use case', async () => {
    const dto: UserPreferenceDto.UpdateNotificationSettingsDto = {
      digestFrequency: 'INVALID' as UserPreferenceDto.DigestFrequency,
    };
    updateNotificationSettingsUseMock.execute.mockRejectedValueOnce(
      new Error('Invalid digest frequency'),
    );
    await expect(
      controller.updateNotificationSettings(testUserId, dto),
    ).rejects.toThrow('Invalid digest frequency');
  });

  it('getSecuritySettings should return security settings', async () => {
    const result = await controller.getSecuritySettings(testUserId);
    expect(result).toBeDefined();
    expect(getSecuritySettingsUseMock.execute).toHaveBeenCalledWith(testUserId);
  });

  it('updateSecuritySettings should update and return security settings', async () => {
    const dto: UserPreferenceDto.UpdateSecuritySettingsDto = {
      twoFactorEnabled: true,
    };
    const result = await controller.updateSecurity(testUserId, dto);
    expect(result).toBeDefined();
    expect(updateSecuritySettingsUseMock.execute).toHaveBeenCalledWith(
      testUserId,
      dto,
    );
  });

  it('updateSecuritySettings should propagate errors from use case', async () => {
    const dto: UserPreferenceDto.UpdateSecuritySettingsDto = {
      sessionTimeout: -1,

    };
    updateSecuritySettingsUseMock.execute.mockRejectedValueOnce(
      new Error('Invalid session timeout'),
    );
    await expect(
      controller.updateSecurity(testUserId, dto),
    ).rejects.toThrow('Invalid session timeout');
  });

  it('getComplianceSettings should return compliance settings', async () => {
    const result = await controller.getComplianceSettings(testUserId);
    expect(result).toBeDefined();
    expect(getComplianceSettingsUseMock.execute).toHaveBeenCalledWith(
      testUserId,
    );
  });

  it('updateComplianceSettings should update and return compliance settings', async () => {
    const dto: UserPreferenceDto.UpdateComplianceSettingsDto = {
      dataRetentionMonths: 24,
    };
    const result = await controller.updateCompliance(testUserId, dto);
    expect(result).toBeDefined();
    expect(updateComplianceSettingsUseMock.execute).toHaveBeenCalledWith(
      testUserId,
      dto,
    );
  });

  it('updateComplianceSettings should propagate errors from use case', async () => {
    const dto: UserPreferenceDto.UpdateComplianceSettingsDto = {
      dataRetentionMonths: -1,
    };
    updateComplianceSettingsUseMock.execute.mockRejectedValueOnce(
      new Error('Invalid data retention'),
    );
    await expect(
      controller.updateCompliance(testUserId, dto),
    ).rejects.toThrow('Invalid data retention');
  });

  it('getPreferenceAuditLogs should return audit logs', async () => {
    const result = await controller.getAuditLogs(testUserId, {});
    expect(result).toEqual({ logs: [], total: 0, page: 1, limit: 20 });
    expect(getPreferenceAuditLogsUseMock.execute).toHaveBeenCalled();
  });

  it('getPreferenceAuditLogs should return empty array when no logs', async () => {
    getPreferenceAuditLogsUseMock.execute.mockResolvedValueOnce({
      logs: [],
      total: 0,
      page: 1,
      limit: 20,
    });
    const result = await controller.getAuditLogs(testUserId, {});
    expect(result.logs).toEqual([]);
    expect(getPreferenceAuditLogsUseMock.execute).toHaveBeenCalled();
  });

  it('getPreferenceAuditLogs should throw NotFoundException when user not found', async () => {
    getPreferenceAuditLogsUseMock.execute.mockRejectedValueOnce(
      new NotFoundException('User not found'),
    );
    await expect(
      controller.getAuditLogs('missing-user', {}),
    ).rejects.toThrow(NotFoundException);
  });
});
