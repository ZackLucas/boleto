import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';
import { NotFoundError } from 'rxjs';
import {
  BadRequestError,
  InvalidParamError,
  NoContentError,
  ServiceUnavailableError,
  SystemError,
  UnauthorizedError,
  UnprocessableEntityError,
  ValidationError,
} from '../domain';

@Catch()
export class HttpExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const logger = new Logger(HttpExceptionFilter.name);

    logger.error(exception);
    logger.debug(JSON.stringify({ request: { url: request.url, body: request.body }, exception }));

    let statusCode;
    if (exception instanceof NoContentError) statusCode = 204;
    if (exception instanceof SystemError) statusCode = 400;
    if (exception instanceof BadRequestError) statusCode = 400;
    if (exception instanceof InvalidParamError) statusCode = 400;
    if (exception instanceof UnauthorizedError) statusCode = 401;
    if (exception instanceof JsonWebTokenError) statusCode = 401;
    if (exception instanceof NotFoundError) statusCode = 404;
    if (exception instanceof ValidationError) statusCode = 422;
    if (exception instanceof UnprocessableEntityError) statusCode = 422;
    if (exception instanceof ServiceUnavailableError) statusCode = 503;

    if (statusCode) return response.status(statusCode).json(exception);

    return response.status(exception.status || 500).json({
      errorMessage: exception.message || '',
      name: exception.constructor.name || '',
    });
  }
}
