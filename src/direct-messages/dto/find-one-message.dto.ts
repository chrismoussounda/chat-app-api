import { IsNotEmpty, IsMongoId } from 'class-validator';

export class FindOneDirectMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  memberId: string;

  @IsMongoId()
  @IsNotEmpty()
  conversationId: string;
}
