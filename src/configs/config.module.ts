import { Module } from '@nestjs/common';
import * as NestConfig from '@nestjs/config';
import { AWSConfig } from './aws.config';
import { AppConfig } from './app.config';
import { ConfigService } from './config.service';

@Module({
  imports: [
    NestConfig.ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
  ],
  providers: [ConfigService, AWSConfig, AppConfig],
  exports: [ConfigService, AWSConfig, AppConfig],
})
export class ConfigModule {}
