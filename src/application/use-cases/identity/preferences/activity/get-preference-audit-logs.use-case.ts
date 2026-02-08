import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  PreferenceAuditLogDto,
  AuditLogsResponseDto,
} from '@/application/dto/identity/preferences';
import { IUserRepository } from '@/domain/repositories';

@Injectable()
export class GetPreferenceAuditLogsUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    userId: string,
    page: number = 1,
    limit: number = 20,
    category?: string
  ): Promise<AuditLogsResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    return {
      logs: [],
      total: 0,
      page,
      limit,
      category,
    };
  }

  filterLogsByCategory(
    logs: PreferenceAuditLogDto[],
    category: string,
  ): PreferenceAuditLogDto[] {
    return logs.filter((log) => log.category === category);
  }

  filterLogsByDateRange(
    logs: PreferenceAuditLogDto[],
    startDate: Date,
    endDate: Date,
  ): PreferenceAuditLogDto[] {
    return logs.filter((log) => {
      const logDate = new Date(log.createdAt);
      return logDate >= startDate && logDate <= endDate;
    });
  }

  filterLogsByUser(
    logs: PreferenceAuditLogDto[],
    changedBy: string,
  ): PreferenceAuditLogDto[] {
    return logs.filter((log) => log.changedBy === changedBy);
  }

  sortLogsByDate(
    logs: PreferenceAuditLogDto[],
    ascending: boolean = false,
  ): PreferenceAuditLogDto[] {
    return logs.sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return ascending ? aTime - bTime : bTime - aTime;
    });
  }

  paginateLogs(
    logs: PreferenceAuditLogDto[],
    page: number,
    limit: number,
  ): PreferenceAuditLogDto[] {
    const skip = (page - 1) * limit;
    return logs.slice(skip, skip + limit);
  }
}
