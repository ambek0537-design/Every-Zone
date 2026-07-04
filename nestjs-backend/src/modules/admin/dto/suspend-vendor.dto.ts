import { IsString, IsNotEmpty } from 'class-validator';

export class SuspendVendorDto {
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
