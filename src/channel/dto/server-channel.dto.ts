import { IsNotEmpty, IsMongoId } from 'class-validator';

export class ServerChannelDto {
  @IsNotEmpty()
  @IsMongoId()
  serverId: string;
}
