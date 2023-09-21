import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as LocalSession from 'telegraf-session-local';
import { validateEnvVariables } from './config/env.validation';
import { ComponentsModule } from './components';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

const sessions = new LocalSession({database: 'session_db.json'});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvVariables
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          middlewares: [
            sessions.middleware(),
            // async (next) => {
            //   console.time();
            //   await next();
            //   console.timeEnd();
            // }
          ],
          token: configService.get<string>('TELEGRAM_TOKEN'),
        }
      },
      inject: [ConfigService]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get<string>('DB_TYPE', 'mongodb'),
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: Number(configService.get<string>('DB_PORT', '27017')),
          database: configService.get<string>('DB_DATABASE', 'surveys'),
          useNewUrlParser: !!configService.get<string>('DB_USENEWURLPARSER:', '1'),
          autoLoadEntities: !!configService.get<string>('DB_AUTOLOADENTITIES', '1'),
          useUnifiedTopology: !!configService.get<string>('DB_USEUNIFIEDTOPOLOGY', '1'),
          entities: [join(__dirname, '**/**.entity{.ts,.js}')]
        } as TypeOrmModuleOptions
      },
      inject: [ConfigService]
    }),
    ComponentsModule
  ]
})
export class AppModule {
}
