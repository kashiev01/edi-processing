import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AWSConfig {
  private readonly region: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get('AWS_S3_REGION');
    this.accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
    this.secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');
  }

  getS3ClientConfig() {
    return {
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    };
  }
}
