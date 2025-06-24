import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import { AppLogger, LOGGER } from './shared';
import helmet from 'helmet';
import { ResponseInterceptor } from './middlewares/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get<AppLogger>(LOGGER);

  app.useLogger(logger);
  // app.useGlobalFilters(new AllExceptionsFilter(logger), new ValidationFilter());
  app.useGlobalInterceptors(new ResponseInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ limit: '100mb', extended: true }));
  app.use(helmet());

  const configService = app.get(ConfigService);
  const isDev = configService.get<() => boolean>('isDev');
  const port = configService.get<string>('port');
  if (isDev()) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    app.use(require('morgan')('dev'));
  }
  await app.listen(port);
}
bootstrap();
