import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateVendorDto {
  @IsNotEmpty()
  @IsString()
  businessName: string;

  @IsOptional()
  @IsString()
  businessDescription?: string;

  @IsNotEmpty()
  vendorType: any; // VendorType enum type-safe fallback

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;
}
