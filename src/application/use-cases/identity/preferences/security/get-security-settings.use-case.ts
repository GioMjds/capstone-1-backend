import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { SecuritySettingsResponseDto } from '@/application/dto/identity/preferences';
import { IUserRepository } from '@/domain/repositories';

@Injectable()
export class GetSecuritySettingsUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<SecuritySettingsResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundException(`User with id ${userId} not found`);

    const preferences = user.getPreferences();

    if (!preferences) {
      return {
        twoFactorEnabled: false,
        twoFactorMethod: '',
        passkeysEnabled: false,
        passwordChangedAt: new Date(),
        activeSessions: [],
        trustedDevices: [],
      };
    }

    return {
      twoFactorEnabled: false,
      twoFactorMethod: '',
      passkeysEnabled: false,
      passwordChangedAt: new Date(),
      activeSessions: [],
      trustedDevices: [],
    };
  }
}
