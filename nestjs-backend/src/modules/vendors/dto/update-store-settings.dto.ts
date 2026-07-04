import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateStoreSettingsDto {
  @IsOptional()
  @IsBoolean()
  allowMessages?: boolean;

  @IsOptional()
  @IsBoolean()
  allowReviews?: boolean;

  @IsOptional()
  @IsBoolean()
  autoAcceptOrders?: boolean;

  @IsOptional()
  @IsBoolean()
  vacationMode?: boolean;
}
