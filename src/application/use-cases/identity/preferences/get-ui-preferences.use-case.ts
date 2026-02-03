import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { UiPreferencesResponseDto } from '@/application/dto/identity/preferences';
import { IUserRepository } from '@/domain/repositories';

@Injectable()
export class GetUiPreferencesUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<UiPreferencesResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const preferences = user.getPreferences();

    if (!preferences) {
      return {
        theme: 'light',
        language: 'en',
      };
    }

    return {
      theme: preferences.getTheme(),
      language: preferences.getLanguage(),
    };
  }
}