import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserPassword {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
