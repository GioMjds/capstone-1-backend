import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import {
  DomainException,
  EntityNotFoundException,
  InvalidStateException,
} from '@/shared/exceptions';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const { status, body } = this.handleException(exception);

    this.logger.warn(
      `Domain error: ${exception.name} - ${exception.message}`,
      exception.stack,
    );

    response.status(status).json({
      error: {
        ...body,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }

  private handleException(exception: DomainException): {
    status: number;
    body: Record<string, any>;
  } {
    if (exception instanceof EntityNotFoundException) {
      return {
        status: 404,
        body: {
          code: 'ENTITY_NOT_FOUND',
          message: exception.message,
        },
      };
    }

    if (exception instanceof InvalidStateException) {
      return {
        status: 400,
        body: {
          code: 'INVALID_STATE',
          message: exception.message,
        },
      };
    }

    return {
      status: 400,
      body: {
        code: 'DOMAIN_ERROR',
        message: exception.message,
      },
    };
  }
}
