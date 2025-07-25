import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteBucketCommand,
} from '@aws-sdk/client-s3'
import { ConfigService } from '@nestjs/config'
import * as sharp from 'sharp'

@Injectable()
export class StorageService implements OnModuleInit {
  private logger = new Logger(StorageService.name)
  private s3Client: S3Client
  private s3Bucket: string

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): any {
    this.s3Client = new S3Client({
      region: this.config.get<string>('S3_REGION') || '',
      credentials: {
        accessKeyId: this.config.get<string>('S3_ACCESS_KEY_ID') || '',
        secretAccessKey: this.config.get<string>('S3_SECRET_ACCESS_KEY') || '',
      },
    })

    this.s3Bucket = this.config.get<string>('S3_BUCKET_NAME') || ''
  }

  async proccessAvatarFile(file: Express.Multer.File) {
    let processImage: Buffer
    let outputMineType: string
    let extension: string

    if (file.mimetype === 'image/png') {
      processImage = await sharp(file.buffer)
        .resize(200, 200, { fit: 'cover' })
        .png({ compressionLevel: 8 })
        .toBuffer()

      outputMineType = 'image/png'
      extension = '.png'
    } else {
      processImage = await sharp(file.buffer)
        .resize(200, 200, { fit: 'cover' })
        .jpeg({ quality: 80 })
        .toBuffer()

      outputMineType = 'image/jpeg'
      extension = '.jpg'
    }

    return {
      ...file,
      buffer: processImage,
      mineType: outputMineType,
      originalName: file.originalname.replace(/\.[^/.]+$/, extension),
    }
  }

  async uploadFile(fileKey: string, file: Express.Multer.File) {
    const uploadParam: PutObjectCommandInput = {
      Bucket: this.s3Bucket,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    }

    const command = new PutObjectCommand(uploadParam)
    await this.s3Client.send(command)

    return `https://${this.s3Bucket}.s3.${this.config.get<string>('S3_REGION')}.amazonaws.com/${fileKey}`
  }

  async deleteFile(fileKey: string) {
    const deleteParam = {
      Bucket: this.s3Bucket,
      Key: fileKey,
    }

    const command = new DeleteBucketCommand(deleteParam)

    try {
      await this.s3Client.send(command)
      this.logger.log(`File with key '${fileKey}' deleted successfully.`)
    } catch (error) {
      this.logger.error(`Error deleting file with key '${fileKey}':`, error)
      throw error
    }
  }
}
