import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsMongoId,
} from 'class-validator';

export class CreateDirectMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUrl()
  @IsOptional()
  fileUrl: string;

  @IsMongoId()
  @IsNotEmpty()
  memberId: string;

  @IsMongoId()
  @IsNotEmpty()
  conversationId: string;
}
