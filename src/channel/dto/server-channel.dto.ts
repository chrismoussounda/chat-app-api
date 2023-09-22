import { IsNotEmpty, IsUUID } from 'class-validator';

export class ServerChannelDto {
  @IsNotEmpty()
  @IsUUID()
  serverId: string;
}
