import { IsNotEmpty, IsMongoId } from 'class-validator';

export class MemberServerDto {
  @IsMongoId()
  @IsNotEmpty()
  memberId: string;
}
