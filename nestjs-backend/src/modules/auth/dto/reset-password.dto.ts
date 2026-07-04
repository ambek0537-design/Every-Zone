export class ResetPasswordDto {
  phone: string;
  code: string;
  newPassword?: string;
}
