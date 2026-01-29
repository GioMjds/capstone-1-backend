import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { networkInterfaces } from 'os';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationError } from 'class-validator';

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

function formatValidationErrors(errors: ValidationError[]) {
  const result: Record<string, string[]> = {};

  const flatten = (errs: ValidationError[], prefix = '') => {
    for (const err of errs) {
      const key = prefix ? `${prefix}.${err.property}` : err.property;
      if (err.constraints) {
        result[key] = Object.values(err.constraints);
      }
      if (err.children && err.children.length) {
        flatten(err.children, key);
      }
    }
  };

  flatten(errors);
  return result;
}

async function bootstrap() {
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Capstone 1 API')
    .setDescription(
      "API documentation for Capstone 1 project. All endpoints must starts with '/api' prefix.",
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/docs', app, document);

  app.use(cookieParser(process.env.JWT_SECRET));

  app.enableCors({
    origin: ['http://localhost:3000', `http://${hostIp}:3000`],
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'Bearer',
      'Origin',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      forbidUnknownValues: false,
      exceptionFactory: (errors: ValidationError[]) => {
        const formatted = formatValidationErrors(errors);
        return new BadRequestException({
          message: 'Validation failed',
          errors: formatted,
        });
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
