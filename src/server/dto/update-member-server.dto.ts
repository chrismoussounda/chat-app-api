import { MemberRole } from '@prisma/client';
import { IsIn, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateMemberServerDto {
  @IsUUID()
  @IsNotEmpty()
  memberId: string;

  @IsNotEmpty()
  @IsIn([MemberRole.ADMIN, MemberRole.GUEST, MemberRole.MODERATOR])
  role: MemberRole;
}
