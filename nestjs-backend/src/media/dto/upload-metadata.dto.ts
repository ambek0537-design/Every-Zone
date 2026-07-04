import { IsString, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UploadMetadataDto {
  @IsString()
  @IsNotEmpty({ message: 'vendorId is required to associate uploaded timeline media' })
  vendorId: string;

  @IsString()
  @IsNotEmpty({ message: 'A descriptive title for your video stream is required' })
  title: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'Video duration must be at least 1 second' })
  @Max(30, { message: 'Video duration exceeds standard 30-second marketing time-gate restrictions!' })
  duration: number; // Duration of video in seconds (rigidly capped at 30s)

  @IsString()
  @IsOptional()
  listingId?: string; // Optional listing association
}
