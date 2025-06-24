import { Injectable } from '@nestjs/common';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { ForumDAL } from './dals/forum.dal';
import { Forum } from './entities/forum.entity';

@Injectable()
export class ForumService {
  constructor(private readonly forumDal: ForumDAL) { }

  async createForum(payload: any) {
    return this.forumDal.create({
      title: payload.title,
      description: payload.description,
      createdBy: payload.userId,
      members: [payload.userId]
    });
  }

  async addUserToForum(payload: any) {
    return this.forumDal.updateOne(
      { _id: payload.forumId },
      { members: payload.userId }
    );
  }

  async findForumById(id: string) {
    return this.forumDal.findOne({ _id: id });
  }

  async getUserForums(userIds: string[]) {
    return this.forumDal.find({ members: userIds });
  }

  async updateForum(id: string, update: Partial<Forum>) {
    return this.forumDal.updateOne({ _id: id }, update);
  }
}
