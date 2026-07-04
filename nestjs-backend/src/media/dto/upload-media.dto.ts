import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { MediaOwnerType } from '@prisma/client';

export class UploadMediaDto {
  @IsEnum(MediaOwnerType, {
    message: 'ownerType must be one of: USER, VENDOR, PRODUCT, PROPERTY, JOB, CHAT, KYC',
  })
  @IsNotEmpty({ message: 'ownerType is required' })
  ownerType: MediaOwnerType;

  @IsString()
  @IsNotEmpty({ message: 'ownerId is required to associate this media' })
  ownerId: string;

  @IsString()
  @IsNotEmpty({ message: 'uploadedBy is required to track file authorship' })
  uploadedBy: string;

  @IsString()
  @IsOptional()
  subFolder?: string; // e.g. "logos", "covers", "images", "videos"
}
