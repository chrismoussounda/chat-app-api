import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindOneDirectMessageDto {
  @IsUUID()
  @IsNotEmpty()
  memberId: string;

  @IsUUID()
  @IsNotEmpty()
  conversationId: string;
}
