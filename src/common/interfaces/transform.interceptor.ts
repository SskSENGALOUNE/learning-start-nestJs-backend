import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ApiResponse } from './api-response.interface';
import { Reflector } from '@nestjs/core';
import { map, Observable } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '../decorators/response-message.decorator';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const http = context.switchToHttp();
    const response = http.getResponse();
    const request = http.getRequest();

    const customMessage = this.reflector.get<string>(
      RESPONSE_MESSAGE_KEY,
      context.getHandler(),
    );

    return next.handle().pipe(
      map((data) => {
        const isPaginated =
          data != null &&
          typeof data === 'object' &&
          'meta' in data &&
          'items' in data;

        const payload = isPaginated ? data.items : data;

        return {
          success: true,
          statusCode: response.statusCode,
          message: customMessage ?? 'Success',
          count: Array.isArray(payload) ? payload.length : undefined,
          ...(isPaginated ? { meta: data.meta } : {}),
          data: payload,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}
