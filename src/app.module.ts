import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ValidationMiddleware } from './common/middleware/validation.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware) // Apply the logger middleware globally
      .forRoutes('*'); // Apply to all routes

    consumer
      .apply(ValidationMiddleware) // Apply validation middleware
      .forRoutes('auth/login'); // Apply to a specific route (login)
  }
}
