import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import axios from 'axios';
import { PortalNames } from './enums/portal-name.enum';
import { ConfigService } from './configs/config.service';
import { AWSConfig } from './configs/aws.config';
import { S3 } from 'aws-sdk';

@Injectable()
export class AppService {
  private readonly s3: S3;
  private readonly diskFolder = path.join(__dirname, '../edi-uploads'); // path of disk directory
  private readonly prod_endpoint: string;
  private readonly prod_token: string;

  constructor(configService: ConfigService, awsConfig: AWSConfig) {
    this.prod_token = configService.getString('PROD_AUTH_TOKEN');
    this.prod_endpoint = configService.getString('PROD_ENDPOINT');
    this.s3 = new S3(awsConfig.getS3ClientConfig());
  }

  async uploadAndProcess() {
    const new_task_ids: string[] = [];
    const already_processed_task_ids: string[] = [];

    try {
      const fileNames = await fs.readdir(this.diskFolder);
      for (let fileName of fileNames) {
        const updatedFileName = fileName.toLocaleLowerCase().replace(/_/g, '');
        const fileBuffer = await fs.readFile(`${this.diskFolder}/${fileName}`);
        switch (true) {
          case updatedFileName.startsWith('zelis'):
            const zelisAwsResult = await this.uplaodAws(
              PortalNames.ZELIS,
              fileName,
              fileBuffer,
            );
            if (zelisAwsResult) {
              const zelisResponse = await this.sendPostRequest(
                PortalNames.ZELIS,
                fileName,
              );
              if (zelisResponse.status == 'OK') {
                new_task_ids.push(zelisResponse.task_id);
              } else {
                already_processed_task_ids.push(zelisResponse.task_id);
              }
            }

            break;

          case updatedFileName.startsWith('dxc'):
            const dxcAwsResult = await this.uplaodAws(
              PortalNames.DXC,
              fileName,
              fileBuffer,
            );
            if (dxcAwsResult) {
              const dxcResponse = await this.sendPostRequest(
                PortalNames.DXC,
                fileName,
              );
              if (dxcResponse.status == 'OK') {
                new_task_ids.push(dxcResponse.task_id);
              } else {
                already_processed_task_ids.push(dxcResponse.task_id);
              }
            }

            break;

          case updatedFileName.startsWith('echo') ||
            updatedFileName.startsWith('ansi'):
            const echoAwsResult = await this.uplaodAws(
              PortalNames.ECHO,
              fileName,
              fileBuffer,
            );
            if (echoAwsResult) {
              const echoResponse = await this.sendPostRequest(
                PortalNames.ECHO,
                fileName,
              );
              if (echoResponse.status == 'OK') {
                new_task_ids.push(echoResponse.task_id);
              } else {
                already_processed_task_ids.push(echoResponse.task_id);
              }
            }

            break;

          case updatedFileName.startsWith('ddall'):
            const ddallAwsResult = await this.uplaodAws(
              PortalNames.DDALL,
              fileName,
              fileBuffer,
            );
            if (ddallAwsResult) {
              const ddallResponse = await this.sendPostRequest(
                PortalNames.DDALL,
                fileName,
              );
              if (ddallResponse.status == 'OK') {
                new_task_ids.push(ddallResponse.task_id);
              } else {
                already_processed_task_ids.push(ddallResponse.task_id);
              }
            }

            break;

          case updatedFileName.startsWith('chc'):
            const chcAwsResult = await this.uplaodAws(
              PortalNames.CHC,
              fileName,
              fileBuffer,
            );
            if (chcAwsResult) {
              const chcResponse = await this.sendPostRequest(
                PortalNames.CHC,
                fileName,
              );
              if (chcResponse.status == 'OK') {
                new_task_ids.push(chcResponse.task_id);
              } else {
                already_processed_task_ids.push(chcResponse.task_id);
              }
            }

            break;
        }
      }
      return { task_ids: new_task_ids, already_processed_task_ids };
    } catch (error) {
      return error.data;
    }
  }

  async uplaodAws(portalName: string, fileName: string, buffer: Buffer) {
    if (portalName === PortalNames.CHC) {
      const params = {
        Bucket: 'zen-change-healthcare-production',
        Key: `${portalName}/manual/adk-manual-uploads/${fileName}`,
        Body: buffer,
      };
      try {
        const result = await this.s3.upload(params).promise();
        return result;
      } catch (error) {
        return false;
      }
    }

    const params = {
      Bucket: 'zen-edi-uploads-production',
      Key: `${portalName}/manual/adk-manual-uploads/${fileName}`,
      Body: buffer,
    };
    try {
      const result = await this.s3.upload(params).promise();
      return result;
    } catch (error) {
      return false;
    }
  }

  async sendPostRequest(
    portalName: PortalNames,
    fileName: string,
  ): Promise<any> {
    const payload = {
      file_key: `${portalName}/manual/adk-manual-uploads/${fileName}`, // if you have your own folder path, you can change the path
      source: portalName,
      upload_type: 'manual',
    };

    try {
      const result = await axios.post(this.prod_endpoint, payload, {
        headers: {
          Authorization: `Bearer ${this.prod_token}`,
        },
      });
      return result.data;
    } catch (error) {
      return error.response.data;
    }
  }
}
