import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SetPaginationSizeDto,
  PaginationSizeResponseDto,
} from '@/application/dto/identity/preferences';
import { ICustomizationsRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetPaginationSizeUseCase {
  constructor(
    @Inject('ICustomizationsRepository')
    private readonly customizationsRepository: ICustomizationsRepository,
  ) {}

  async execute(userId: string, dto: SetPaginationSizeDto): Promise<PaginationSizeResponseDto> {
    await this.customizationsRepository.updateCustomizationSettings(userId, {
      paginationSize: dto.defaultPageSize,
    });

    const settings = await this.customizationsRepository.getCustomizationSettings(userId);

    if (!settings) {
      throw new NotFoundException('Customization settings not found');
    }

    return {
      defaultPageSize: settings.paginationSize,
      maxPageSize: dto.maxPageSize ?? 100,
      updatedAt: new Date(),
    };
  }
}
