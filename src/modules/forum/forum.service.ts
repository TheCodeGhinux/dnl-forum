import { HttpStatus, Injectable } from '@nestjs/common';
import { ForumDAL } from './dals/forum.dal';
import { Forum } from './entities/forum.entity';
import { User } from '../user/entities/user.entity';
import { AddUserToForumDTO, CreateForumDTO } from './dto/forum.dto';
import { CustomHttpException } from 'src/shared/exception.handler';
import { UserService } from '../user/user.service';
import { PaginationRequestDTO } from 'src/shared';

@Injectable()
export class ForumService {
  constructor(private readonly forumDal: ForumDAL, private readonly userService: UserService) { }

  async createForum(payload: CreateForumDTO, user: User) {
    const newForum = await this.forumDal.create({
      title: payload.title,
      description: payload.description,
      createdBy: user.id,
      members: [user.id]
    });

    return {
      message: "New forum created",
      data: newForum
    }
  }

  async addUserToForum(payload: AddUserToForumDTO, user: User, forumId: string) {
    const forum = await this.forumDal.findOne({
      id: forumId,
      createdBy: user.id,
    });
    if (!forum) {
      throw new CustomHttpException('Forum not found or access denied', HttpStatus.NOT_FOUND);
    }

    const existingUsers = await this.userService.findUsersByIds(
      payload.userIds,
      ['id'],
    );
    const validIds = existingUsers.map(u => u.id);
    if (validIds.length === 0) {
      throw new CustomHttpException('None of the provided users exist', HttpStatus.BAD_REQUEST);
    }

    const merged = Array.from(new Set([...(forum.members || []), ...validIds]));

    await this.forumDal.updateOne(
      { _id: forumId, createdBy: user.id },
      { members: merged },
    );

    const updated = await this.forumDal.findOne({
      id: forumId,
      createdBy: user.id,
    });
  }

  async findForumById(id: string): Promise<Forum> {
    const forum = await this.forumDal.findOne({ _id: id });
    if (!forum) {
      throw new CustomHttpException(`Forum with id=${id} not found`, HttpStatus.NOT_FOUND);
    }
    return forum;
  }

  async getUserForums(
    user: User,
    payload: PaginationRequestDTO,
  ): ReturnType<ForumDAL['paginate']> {
    const query: Parameters<ForumDAL['paginate']>[0] = {
      members: [user.id],
      isDeleted: false,
    };

    return this.forumDal.paginate(
      query,
      payload,
      null,
      ['name', 'description'],
      [{ path: 'createdBy', select: 'username email' }],
    );
  }

  async updateForum(
    id: string,
    user: User,
    update: Partial<Forum>,
  ): Promise<Forum> {
    // ensure user is creator
    const existing = await this.forumDal.findOne({ _id: id, createdBy: user.id });
    if (!existing) {
      throw new CustomHttpException(`You cannot update forum ${id}`, HttpStatus.FORBIDDEN);
    }
    return this.forumDal.updateOne({ _id: id }, update);
  }

  async deleteForum(id: string, user: User): Promise<{ deleted: boolean }> {
    const existing = await this.forumDal.findOne({ _id: id, createdBy: user.id });
    if (!existing) {
      throw new CustomHttpException(`You cannot delete forum ${id}`, HttpStatus.FORBIDDEN);
    }
    await this.forumDal.updateOne({ _id: id }, { isDeleted: true });
    return { deleted: true };
  }
}
