import { ChannelType } from '@prisma/client';
import {
  IsIn,
  IsNotEmpty,
  IsNotIn,
  IsString,
  IsMongoId,
} from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @IsNotIn(['general'])
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsIn([ChannelType.TEXT, ChannelType.AUDIO, ChannelType.VIDEO])
  type: ChannelType;

  @IsNotEmpty()
  @IsMongoId()
  serverId: string;
}
