import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ValidationMiddleware } from './common/middleware/validation.middleware';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://familiandbuser:focJJFECPXU5f9O3@cluster0-shard-00-00.pa5bd.mongodb.net:27017,cluster0-shard-00-01.pa5bd.mongodb.net:27017,cluster0-shard-00-02.pa5bd.mongodb.net:27017/project2?ssl=true&replicaSet=atlas-cejw98-shard-0&authSource=admin&retryWrites=true&w=majority"
), 
    AuthModule, UsersModule
  ],
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
