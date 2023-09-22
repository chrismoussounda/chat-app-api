import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateDirectMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  @IsNotEmpty()
  memberId: string;

  @IsUUID()
  @IsNotEmpty()
  conversationId: string;
}
