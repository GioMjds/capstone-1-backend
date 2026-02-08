import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  SetSortFilterDefaultsDto,
  SortFilterDefaultsResponseDto,
  SortOrder,
} from '@/application/dto/identity/preferences';
import { ICustomizationsRepository } from '@/domain/repositories/identity/preferences';

@Injectable()
export class SetSortFilterDefaultsUseCase {
  constructor(
    @Inject('ICustomizationsRepository')
    private readonly customizationsRepository: ICustomizationsRepository,
  ) {}

  async execute(userId: string, dto: SetSortFilterDefaultsDto): Promise<SortFilterDefaultsResponseDto> {
    await this.customizationsRepository.updateCustomizationSettings(userId, {
      sortFilterDefaults: {
        defaultSortField: dto.defaultSortField ?? 'createdAt',
        defaultSortOrder: dto.defaultSortOrder ?? SortOrder.DESC,
        defaultFilters: dto.defaultFilters ?? {},
      },
    });

    const settings = await this.customizationsRepository.getCustomizationSettings(userId);

    if (!settings) {
      throw new NotFoundException('Customization settings not found');
    }

    const sortFilter = settings.sortFilterDefaults as Record<string, unknown>;

    return {
      defaultSortField: (sortFilter?.defaultSortField as string) ?? 'createdAt',
      defaultSortOrder: (sortFilter?.defaultSortOrder as SortOrder) ?? SortOrder.DESC,
      defaultFilters: sortFilter?.defaultFilters as Record<string, unknown>,
      updatedAt: new Date(),
    };
  }
}
