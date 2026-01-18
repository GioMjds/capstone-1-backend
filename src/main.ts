import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { networkInterfaces } from 'os';
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

const logger = new Logger('Server');

const nets = networkInterfaces();

let hostIp = '0.0.0.0';

for (const name of Object.keys(nets)) {
  for (const net of nets[name] ?? []) {
    if (net.family === 'IPv4' && !net.internal) {
      hostIp = net.address;
      break;
    }
  }
  if (hostIp !== '0.0.0.0') break;
}

async function bootstrap() {
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Capstone 1 API")
    .setDescription("API documentation for Capstone 1 project. All endpoints must starts with '/api' prefix.")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("/docs", app, document);

  app.use(cookieParser(process.env.JWT_SECRET));

  app.enableCors({
    origin: [
      'http://localhost:3000',
      `http://${hostIp}:3000`,
    ],
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api');

  await app.listen(port, '0.0.0.0');
  logger.log(`Local: http://localhost:${port}`);
  logger.log(`Network: http://${hostIp}:${port}`);
  logger.log(`API Docs: http://localhost:${port}/docs`);
}

bootstrap();
