import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  IsUrl,
} from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUrl()
  @IsOptional()
  fileUrl: string;

  @IsMongoId()
  @IsNotEmpty()
  serverId: string;

  @IsMongoId()
  @IsNotEmpty()
  channelId: string;
}
