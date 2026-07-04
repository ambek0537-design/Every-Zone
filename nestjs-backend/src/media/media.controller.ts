import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFile, 
  UploadedFiles,
  Body, 
  HttpCode, 
  HttpStatus, 
  UsePipes, 
  ValidationPipe,
  Delete,
  Get,
  Param
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { UploadMetadataDto } from './dto/upload-metadata.dto';
import { UploadMediaDto } from './dto/upload-media.dto';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * Single file upload endpoint (POST /media/upload)
   * Automatically routes between legacy time-gate video flow and modern general S3 asset flow.
   */
  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    // If the body contains both duration and vendorId, route to legacy premium advertiser clip flow
    if (body.duration !== undefined && body.vendorId !== undefined) {
      const legacyDto: UploadMetadataDto = {
        vendorId: body.vendorId,
        title: body.title || 'Legacy Marketing Stream',
        duration: Number(body.duration),
        listingId: body.listingId,
      };
      return this.mediaService.processVideoUpload(file, legacyDto);
    }

    // Modern multi-purpose upload flow
    const mediaDto: UploadMediaDto = {
      ownerType: body.ownerType,
      ownerId: body.ownerId,
      mediaType: body.mediaType,
      uploadedBy: body.uploadedBy,
      subFolder: body.subFolder,
    };
    return this.mediaService.createAsset(file, mediaDto);
  }

  /**
   * Secondary legacy endpoint for explicit compatability with "video" form-data upload structures
   */
  @Post('legacy-video')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('video'))
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async uploadLegacyVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadMetadataDto
  ) {
    return this.mediaService.processVideoUpload(file, dto);
  }

  /**
   * Multiple files upload endpoint (POST /media/multiple)
   */
  @Post('multiple')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('files', 10)) // Max 10 files
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any
  ) {
    const mediaDto: UploadMediaDto = {
      ownerType: body.ownerType,
      ownerId: body.ownerId,
      mediaType: body.mediaType,
      uploadedBy: body.uploadedBy,
      subFolder: body.subFolder,
    };
    return this.mediaService.createMultipleAssets(files, mediaDto);
  }

  /**
   * Retrieve asset metadata and generate dynamic signed URLs for Private KYC storage (GET /media/:id)
   */
  @Get(':id')
  async getAsset(@Param('id') id: string) {
    return this.mediaService.getAssetById(id);
  }

  /**
   * Delete media asset registry and S3 storage (DELETE /media/:id)
   */
  @Delete(':id')
  async deleteAsset(@Param('id') id: string) {
    return this.mediaService.deleteAssetById(id);
  }
}
