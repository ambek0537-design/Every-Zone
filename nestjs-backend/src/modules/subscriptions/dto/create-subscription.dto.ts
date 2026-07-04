import { IsNotEmpty, IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  planId: string;

  @IsNotEmpty()
  @IsString()
  vendorId: string;

  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;
}
