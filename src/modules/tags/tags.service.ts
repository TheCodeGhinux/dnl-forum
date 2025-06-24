import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagDAL } from './tags/tag.dal';

@Injectable()
export class TagService {
  constructor(private readonly tagDal: TagDAL) { }

  async createTags(postId: string, userIds: string[]) {
    const tags = userIds.map(userId => ({
      post: postId,
      taggedUser: userId
    }));
    return this.tagDal.create(tags);
  }

  async getTagsForPost(postId: string) {
    return this.tagDal.find({ post: postId });
  }

  async updateTagsForPost(postId: string, userIds: string[]) {
    // Full replacement strategy
    await this.tagDal.deleteMany({ post: postId });
    return this.createTags(postId, userIds);
  }

  async deleteTagsForPost(postId: string) {
    return this.tagDal.deleteMany({ post: postId });
  }

  async getUserMentions(userId: string) {
    return this.tagDal.find({ taggedUser: userId });
  }
}
