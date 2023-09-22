import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateServerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsUrl()
  imageUrl: string;
}
