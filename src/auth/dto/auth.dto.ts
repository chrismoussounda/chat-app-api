import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
export class AuthDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
