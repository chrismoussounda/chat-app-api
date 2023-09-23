import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class GetToken {
  @IsMongoId()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}
