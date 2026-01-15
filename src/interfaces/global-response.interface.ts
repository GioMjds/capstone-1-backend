export interface IMessageResponse {
  message: string;
}

export interface ISuccessResponse {
  success: boolean;
  message: string;
}

export interface IErrorResponse {
  statusCode: number;
  message: string | string[];
  timestamp: string;
}
