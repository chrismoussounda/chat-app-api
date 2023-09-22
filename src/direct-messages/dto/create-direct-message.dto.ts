import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateDirectMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUrl()
  @IsOptional()
  fileUrl: string;

  @IsUUID()
  @IsNotEmpty()
  memberId: string;

  @IsUUID()
  @IsNotEmpty()
  conversationId: string;
}
