import { Injectable, Inject } from '@nestjs/common';
import type { IUserPreferencesRepository } from '@/domain/repositories/identity/preferences';

export interface InitializePreferencesResult {
  preferencesId: string;
  userId: string;
  initialized: boolean;
}

@Injectable()
export class InitializeUserPreferencesUseCase {
  constructor(
    @Inject('IUserPreferencesRepository')
    private readonly userPreferencesRepository: IUserPreferencesRepository,
  ) {}

  async execute(userId: string): Promise<InitializePreferencesResult> {
    const existingPreferences =
      await this.userPreferencesRepository.findByUserId(userId);

    if (existingPreferences) {
      return {
        preferencesId: existingPreferences.id,
        userId,
        initialized: false,
      };
    }

    const preferences =
      await this.userPreferencesRepository.createDefaultPreferences(userId);

    return {
      preferencesId: preferences.id,
      userId,
      initialized: true,
    };
  }
}
