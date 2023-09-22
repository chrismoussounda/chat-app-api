import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetToken {
  @IsUUID()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}
