import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  private readonly configService: NestConfigService;

  constructor(configService: NestConfigService) {
    this.configService = configService;
  }

  private getValue(name: string): string {
    const value = this.configService.get<string>(name);
    if (value === undefined || value.length === 0) {
      throw new InternalServerErrorException(
        `${name} parameter does not specified in .env file`,
      );
    }
    return value;
  }

  public getString(name: string): string {
    return this.getValue(name);
  }

  public getNumber(name: string): number {
    const value = this.getValue(name);
    const number = parseFloat(value);

    if (Number.isNaN(number)) {
      throw new InternalServerErrorException(
        `${name} parameter does not specified correct number format`,
      );
    }

    return number;
  }
}
