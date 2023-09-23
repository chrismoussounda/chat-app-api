import { IsNotEmpty, IsString, IsMongoId } from 'class-validator';

export class CreateConversationDto {
  @IsMongoId()
  @IsNotEmpty()
  memberOneId: string;

  @IsMongoId()
  @IsNotEmpty()
  memberTwoId: string;
}
