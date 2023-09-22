import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindAllDirectMessagesDto {
  @IsString()
  @IsOptional()
  cursor: string;

  @IsUUID()
  @IsNotEmpty()
  conversationId: string;
}
