import { ExportFormat, ExportStatus } from '@/domain/interfaces';
import { DomainException } from '@/shared/exceptions';

export class DataExportValueObject {
  private constructor(
    private readonly format: ExportFormat,
    private readonly status: ExportStatus,
    private readonly requestedAt: Date,
    private readonly completedAt: Date | undefined,
    private readonly downloadUrl: string | undefined,
    private readonly expiresAt: Date | undefined,
  ) {
    this.validate();
  }

  static create(props: {
    format?: ExportFormat;
    status?: ExportStatus;
    requestedAt?: Date;
    completedAt?: Date;
    downloadUrl?: string;
    expiresAt?: Date;
  }): DataExportValueObject {
    return new DataExportValueObject(
      props.format ?? ExportFormat.JSON,
      props.status ?? ExportStatus.PENDING,
      props.requestedAt ?? new Date(),
      props.completedAt,
      props.downloadUrl,
      props.expiresAt,
    );
  }

  static fromPersistence(data: Record<string, unknown>): DataExportValueObject {
    return new DataExportValueObject(
      data.format as ExportFormat,
      data.status as ExportStatus,
      new Date(data.requestedAt as string),
      data.completedAt ? new Date(data.completedAt as string) : undefined,
      data.downloadUrl as string | undefined,
      data.expiresAt ? new Date(data.expiresAt as string) : undefined,
    );
  }

  toPersistence(): Record<string, unknown> {
    return {
      format: this.format,
      status: this.status,
      requestedAt: this.requestedAt.toISOString(),
      completedAt: this.completedAt?.toISOString(),
      downloadUrl: this.downloadUrl,
      expiresAt: this.expiresAt?.toISOString(),
    };
  }

  getFormat(): ExportFormat {
    return this.format;
  }

  getStatus(): ExportStatus {
    return this.status;
  }

  getRequestedAt(): Date {
    return this.requestedAt;
  }

  getCompletedAt(): Date | undefined {
    return this.completedAt;
  }

  getDownloadUrl(): string | undefined {
    return this.downloadUrl;
  }

  getExpiresAt(): Date | undefined {
    return this.expiresAt;
  }

  isExpired(): boolean {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  private validate(): void {
    if (!Object.values(ExportFormat).includes(this.format)) {
      throw new DomainException('Invalid export format');
    }

    if (!Object.values(ExportStatus).includes(this.status)) {
      throw new DomainException('Invalid export status');
    }
  }
}
