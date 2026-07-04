import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { PaymentProvider } from '@prisma/client';

export class RenewSubscriptionDto {
  @IsNotEmpty()
  @IsString()
  subscriptionId: string;

  @IsNotEmpty()
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsOptional()
  @IsString()
  transactionId?: string;
}
