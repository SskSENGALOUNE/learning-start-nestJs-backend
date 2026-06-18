// src/common/interceptors/logging.interceptor.ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const { method, url } = req;
        const start = Date.now();

        console.log(`→ ${method} ${url}`);

        return next.handle().pipe(
            tap(() => {
                console.log(`✅ ${method} ${url} — ${Date.now() - start}ms`);
            }),
            catchError((err) => {
                console.log(`❌ ${method} ${url} — ${err.message}`);
                return throwError(() => err);
            }),
        );
    }
}
