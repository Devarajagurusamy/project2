import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());  // Parse cookies in requests
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  app.use(cors({
    origin: 'http://localhost:4000',  // Adjust frontend URL
    credentials: true,
  })); // Enable CORS
  await app.listen(3000);
}
bootstrap();
