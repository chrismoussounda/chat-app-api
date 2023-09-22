import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUrl()
  @IsOptional()
  fileUrl: string;

  @IsUUID()
  @IsNotEmpty()
  serverId: string;

  @IsUUID()
  @IsNotEmpty()
  channelId: string;
}
