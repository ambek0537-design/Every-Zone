import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { S3StorageService } from './storage/s3-storage.service';
import { VideoProcessor } from './processors/video.processor';

@Module({
  controllers: [MediaController],
  providers: [MediaService, S3StorageService, VideoProcessor],
  exports: [MediaService, S3StorageService, VideoProcessor],
})
export class MediaModule {}
