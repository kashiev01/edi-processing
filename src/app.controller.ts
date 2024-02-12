import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('EDI Processing')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Upload to S3 and process files automatically' })
  @Post('prod')
  async uploadfilesBulk(): Promise<any> {
    return await this.appService.uploadAndProcess();
  }
}
