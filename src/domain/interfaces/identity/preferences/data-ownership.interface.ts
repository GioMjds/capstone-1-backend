export enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
  PDF = 'pdf',
}

export enum ExportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface IDataExportRequest {
  id: string;
  format: ExportFormat;
  status: ExportStatus;
  requestedAt: Date;
  completedAt: Date | null;
  downloadUrl: string | null;
}

export interface IDataDeletionRequest {
  id: string;
  status: ExportStatus;
  requestedAt: Date;
  completedAt: Date | null;
  reason: string | null;
}

export interface IDataCorrection {
  id: string;
  field: string;
  oldValue: string;
  newValue: string;
  status: ExportStatus;
  requestedAt: Date;
  completedAt: Date | null;
}

export interface IDataOwnershipSettings {
  id: string;
  userPreferencesId: string;
  exportFormat: string;
  dataRetentionDays: number;
  allowAutoDelete: boolean;
  allowDataAnonymization: boolean;
  dataExportRequests: IDataExportRequest[];
  dataDeletionRequests: IDataDeletionRequest[];
  dataCorrections: IDataCorrection[];
  createdAt: Date;
  updatedAt: Date;
}