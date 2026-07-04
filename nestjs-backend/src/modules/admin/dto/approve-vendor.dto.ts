import { IsString, IsNotEmpty } from 'class-validator';

export class ApproveVendorDto {
  @IsString()
  @IsNotEmpty()
  vendorId: string;
}
