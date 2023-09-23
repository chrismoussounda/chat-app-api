import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  IsUrl,
} from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsMongoId()
  @IsNotEmpty()
  serverId: string;

  @IsMongoId()
  @IsNotEmpty()
  channelId: string;
}
