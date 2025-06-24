import { PartialType } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateForumDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class AddUserToForumDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];

  // @IsString()
  // forumId: string;
}

export class UpdateForumDTO extends PartialType(CreateForumDTO) {}