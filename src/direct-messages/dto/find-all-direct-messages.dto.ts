import { IsNotEmpty, IsOptional, IsString, IsMongoId } from 'class-validator';

export class FindAllDirectMessagesDto {
  @IsString()
  @IsOptional()
  cursor: string;

  @IsMongoId()
  @IsNotEmpty()
  conversationId: string;
}
