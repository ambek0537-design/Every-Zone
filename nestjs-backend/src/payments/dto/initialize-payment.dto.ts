import { IsString, IsNotEmpty, IsEmail, IsOptional, IsNumber, Min } from 'class-validator';

export class InitializePaymentDto {
  @IsString()
  @IsNotEmpty({ message: 'vendorId is required' })
  vendorId: string;

  @IsEmail({}, { message: 'A valid email is required' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'fullName is required for billing address representation' })
  fullName: string;

  @IsNumber()
  @Min(1, { message: 'Amount was parsed below the Chapa transaction limit' })
  @IsOptional()
  paymentAmount?: number = 200; // Default subscription rate of 200 ETB
}
