import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsUrl,
} from 'class-validator';

export class DeleteMessageDto {
  @IsUUID()
  @IsNotEmpty()
  serverId: string;

  @IsUUID()
  @IsNotEmpty()
  channelId: string;
}
