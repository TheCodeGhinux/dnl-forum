import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { TagService } from './tags.service';
import { CreateTagDTO, TagUsersDto } from './dto/tag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagService) {}
  @Post('post/:postId')
  tagUsers(
    @Param('postId') postId: string,
    @Body() dto: TagUsersDto,
  ) {
    return this.tagService.createTags(postId, dto.userIds);
  }

  @Get('post/:postId')
  getTagsForPost(@Param('postId') postId: string) {
    return this.tagService.getTagsForPost(postId);
  }

  @Put('post/:postId')
  updateTagsForPost(
    @Param('postId') postId: string,
    @Body() dto: TagUsersDto,
  ) {
    return this.tagService.updateTagsForPost(postId, dto.userIds);
  }

  @Delete('post/:postId')
  deleteTagsForPost(@Param('postId') postId: string) {
    return this.tagService.deleteTagsForPost(postId);
  }

  @Get('user/:userId')
  getUserMentions(@Param('userId') userId: string) {
    return this.tagService.getUserMentions(userId);
  }

}
