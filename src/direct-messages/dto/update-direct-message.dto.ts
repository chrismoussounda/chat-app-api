import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class UpdateDirectMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsMongoId()
  @IsNotEmpty()
  memberId: string;

  @IsMongoId()
  @IsNotEmpty()
  conversationId: string;
}
