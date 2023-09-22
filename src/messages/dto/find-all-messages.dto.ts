import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class FindAllMessagesDto {
  @IsString()
  @IsOptional()
  cursor: string;

  @IsUUID()
  @IsNotEmpty()
  channelId: string;
}
