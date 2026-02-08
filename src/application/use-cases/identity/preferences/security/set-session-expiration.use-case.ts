import { Inject, Injectable } from '@nestjs/common';
import {
  SetSessionExpirationDto,
  SetSessionExpirationResponseDto,
} from '@/application/dto/identity/preferences';
import { ISecurityRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetSessionExpirationUseCase {
  constructor(
    @Inject('ISecurityRepository')
    private readonly securityRepository: ISecurityRepository,
  ) {}

  async execute(userId: string, dto: SetSessionExpirationDto): Promise<SetSessionExpirationResponseDto> {
    await this.securityRepository.updateSecuritySettings(userId, {
      sessionExpiration: dto.expirationMinutes,
    });

    return {
      id: userId,
      expirationMinutes: dto.expirationMinutes,
      warningMinutes: dto.warningMinutes ?? 5,
      appliesImmediately: true,
      updatedAt: new Date(),
    };
  }
}
