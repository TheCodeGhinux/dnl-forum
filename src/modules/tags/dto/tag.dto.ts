import { IsArray, ArrayNotEmpty, IsString } from 'class-validator';

export class CreateTagDTO {
  @IsString()
  postId: string;

  @IsString()
  taggedUserId: string;
}


export class TagUsersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];
}