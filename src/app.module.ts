import { AppController } from './app.controller';
import { HttpCacheInterceptor } from './shared/http-cache.interceptor';
import * as crypto from 'crypto';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as redisStore from 'cache-manager-redis-store';
import * as expressBasicAuth from 'express-basic-auth';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { RedisClientOptions } from 'redis';
import config from './config/config';
import { loggingProvider } from './shared/logger.provider';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ForumModule } from './modules/forum/forum.module';
import { PostsModule } from './modules/posts/posts.module';
import { TagsModule } from './modules/tags/tags.module';

@Global()
@Module({
  providers: [loggingProvider],
  exports: [loggingProvider],
  imports: [UserModule, AuthModule, ForumModule, PostsModule, TagsModule],
})
class LoggingModule { }

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRoot(config().database.url, {
      connectionFactory(connection) {
        connection.plugin(mongoosePaginate);
        return connection;
      },
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory() {
        const { cache, isTest, redis } = config();
        if (isTest) {
          return { ttl: -1 };
        }

        if (!redis.host || !redis.port) {
          return { ttl: cache.ttl };
        }

        return {
          host: redis.host,
          port: redis.port,
          ttl: cache.ttl,
          password: redis.password,
          store: redisStore,
          isCacheableValue(value) {
            return value !== undefined;
          },
        };
      },
    }),
    BullModule.forRoot({
      connection: {
        host: config().redis.host,
        port: config().redis.port,
        password: config().redis.password,
      },
    }),
    BullBoardModule.forRoot({
      route: '/bull-board',
      middleware: expressBasicAuth({
        challenge: true,
        users: {
          admin:
            process.env.BULL_BOARD_ADMIN_PASSWORD ||
            crypto.randomBytes(32).toString('hex'),
        },
      }),
      adapter: ExpressAdapter,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot({ throttlers: [config().throttle] }),
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: HttpCacheInterceptor },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
