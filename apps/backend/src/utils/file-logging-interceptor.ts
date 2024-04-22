import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class LoggingFileInterceptor extends FileInterceptor('file') {
  private readonly logger = new Logger(LoggingFileInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return super.intercept(context, next).pipe(
      catchError((err) => {
        this.logger.error('Error handling file upload', err.message);
        return throwError(() => err);
      }),
    );
  }
}
