import { HttpStatus, Logger, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';

const SERVER_PORT = process.env.SERVER_PORT || 7071;

async function bootstrap() {
  const swaggerPath = process.env.SWAGGER_PATH || 'swagger-api';
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    bufferLogs: true,
  });
  app.enableCors();
  // 给请求添加prefix
  // app.setGlobalPrefix(PREFIX);
  // custom logger
  // app.useLogger(app.get(LoggerService));
  // validate
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(
          errors
            .filter((item) => !!item.constraints)
            .flatMap((item) => Object.values(item.constraints))
            .join('; '),
        );
      },
    }),
  );
  // swagger
  setupSwagger(app);
  // start
  await app.listen(SERVER_PORT, '0.0.0.0');
  const serverUrl = await app.getUrl();
  Logger.log('Mode: local-dev');
  Logger.log(`Database: ${process.env.DATABASE_URL ? 'MySQL' : 'SQLite'}`);
  Logger.log(`Cache: ${process.env.USE_REAL_REDIS === 'true' ? 'Redis' : 'MockRedis'}`);
  Logger.log(`api服务已经启动,请访问: ${serverUrl}`);
  Logger.log(`API文档已生成,请访问: ${serverUrl}/${swaggerPath}/`);
}

bootstrap();
