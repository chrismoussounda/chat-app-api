import { MemberRole } from '@prisma/client';
import { IsIn, IsNotEmpty, IsMongoId } from 'class-validator';

export class UpdateMemberServerDto {
  @IsMongoId()
  @IsNotEmpty()
  memberId: string;

  @IsNotEmpty()
  @IsIn([MemberRole.ADMIN, MemberRole.GUEST, MemberRole.MODERATOR])
  role: MemberRole;
}
