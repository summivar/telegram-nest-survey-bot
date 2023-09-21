import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);
  return configService.get<number>('TELEGRAM_TOKEN');
}
bootstrap().then((token) => {
  console.log(`App started with token: \n${token}`);
});
