import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { PostService } from './posts.service';
import { CreatePostDTO, UpdatePostDTO } from './dto/post.dto';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';
import { AuthGuard } from 'src/middlewares/auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createPost(@Body() payload: CreatePostDTO) {
    return this.postService.createPost(payload);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getPostsById(
    @Param('id') id: string,
    @Query('populate') populate?: string,
  ) {
    const pop = populate ? JSON.parse(populate) : undefined;
    return this.postService.getPostById(id, pop);
  }

  @Get('forum/:forumId')
  @UseGuards(AuthGuard)
  async getForumPosts(@Param('forumId') forumId: string) {
    return this.postService.getForumPosts(forumId);
  }

  @Get(':postId/replies')
  @UseGuards(AuthGuard)
  async getReplies(@Param('postId') postId: string) {
    return this.postService.getPostReplies(postId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updatePost(
    @Param('id') id: string,
    @Body() update: any,
    @CurrentUser() user: User) {
    return this.postService.updatePost(id, update, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePost(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.postService.deletePost(id, user);
  }

  @Get('replies/:postId')
  @UseGuards(AuthGuard)
  async getPostReplies(@Param('postId') postId: string) {
    return this.postService.getPostReplies(postId);
  }

}
