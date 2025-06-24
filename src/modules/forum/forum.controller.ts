import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { ForumService } from './forum.service';
import { CreateForumDTO, AddUserToForumDTO, UpdateForumDTO } from './dto/forum.dto';
import { CurrentUser } from 'src/decorators/currentUser.decorator';
import { User } from '../user/entities/user.entity';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PaginationRequestDTO } from 'src/shared';


@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createForum(@CurrentUser() user: User, @Body() payload: CreateForumDTO) {
    console.log("user: ", user)
    return this.forumService.createForum(payload, user);
  }

  @Post('add/:forumId')
  @UseGuards(AuthGuard)
  async addUserToForum(@CurrentUser() user: User, @Body() payload: AddUserToForumDTO, @Query('forumId') forumId: string) {
    console.log("User: ", user)
    return this.forumService.addUserToForum(payload, user, forumId);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.forumService.findForumById(id);
  }

  @Get()
  listForums(
    @CurrentUser() user: User,
    @Query() payload: PaginationRequestDTO,
  ) {
    return this.forumService.getUserForums(user, payload);
  }

  @Put(':id')
  updateForum(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() update: UpdateForumDTO,
  ) {
    return this.forumService.updateForum(id, user, update);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.forumService.deleteForum(id, user);
  }
}
