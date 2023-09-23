import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsMongoId,
  IsUrl,
} from 'class-validator';

export class DeleteMessageDto {
  @IsMongoId()
  @IsNotEmpty()
  serverId: string;

  @IsMongoId()
  @IsNotEmpty()
  channelId: string;
}
