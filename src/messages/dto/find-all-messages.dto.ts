import { IsNotEmpty, IsOptional, IsString, IsMongoId } from 'class-validator';

export class FindAllMessagesDto {
  @IsString()
  @IsOptional()
  cursor: string;

  @IsMongoId()
  @IsNotEmpty()
  channelId: string;
}
