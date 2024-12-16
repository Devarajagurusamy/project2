import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Validate request data (e.g., check if a field is missing)
    console.log("Email middleware")
    if (!req.body.email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    next(); // Proceed to the next middleware or route handler
  }
}
