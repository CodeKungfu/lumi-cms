import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as fs from 'fs';

@Injectable()
export class ExcelFileCleanupInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      tap(async () => {
        const filePath = response?.filePathToDelete;
        if (filePath) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error('Error deleting file:', err);
          }
        }
      }),
    );
  }
}
