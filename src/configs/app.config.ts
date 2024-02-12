import { Injectable } from '@nestjs/common';

import { ConfigService } from './config.service';

@Injectable()
export class AppConfig {
  public readonly name: string;
  public readonly port: number;

  constructor(configService: ConfigService) {
    this.port = configService.getNumber('APP_PORT');
  }
}
