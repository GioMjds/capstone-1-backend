import { Inject, Injectable } from '@nestjs/common';
import { IAccountControlsRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class AccountDeactivationUseCase {
  constructor(
    @Inject('IAccountControlsRepository')
    private readonly accountControlsRepository: IAccountControlsRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.accountControlsRepository.deactivateAccount(userId);
  }
}
