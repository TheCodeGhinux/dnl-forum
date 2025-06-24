import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreatePostDTO {
  @IsString()
  content: string;

  @IsString()
  forumId: string;

  @IsString()
  authorId: string;

  @IsOptional()
  @IsString()
  parentPostId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  taggedUserIds?: string[];
}

export class UpdatePostDTO {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  taggedUserIds?: string[];
}

