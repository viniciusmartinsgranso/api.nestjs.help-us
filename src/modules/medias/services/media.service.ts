import { Injectable } from '@nestjs/common';
import { environment } from '../../../environment/environment';
import * as AWS from '@aws-sdk/client-s3';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class MediaService {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      credentials: {
        secretAccessKey: environment.S3_SECRET_ACCESS_KEY,
        accessKeyId: environment.S3_ACCESS_KEY_ID,
      },
      region: environment.AWS_REGION,
    });
  }

  public async uploadFile(file: Express.Multer.File): Promise<{ url: string }> {
    const bucketName = environment.S3_BUCKET_NAME;
    const key = `${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ACL: 'public-read',
    });

    try {
      await this.s3Client.send(command);
      const url = `https://${bucketName}.s3.${environment.AWS_REGION}.amazonaws.com/${key}`;
      return {
        url: url,
      };
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }
}
