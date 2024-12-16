import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("Logger middleware")
    console.log(`[${req.method}] ${req.originalUrl}`);
    next(); // Pass control to the next middleware or route handler
  }
}
