import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @IsUUID()
  @IsNotEmpty()
  memberOneId: string;

  @IsUUID()
  @IsNotEmpty()
  memberTwoId: string;
}
