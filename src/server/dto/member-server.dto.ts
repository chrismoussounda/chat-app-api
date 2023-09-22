import { IsNotEmpty, IsUUID } from 'class-validator';

export class MemberServerDto {
  @IsUUID()
  @IsNotEmpty()
  memberId: string;
}
