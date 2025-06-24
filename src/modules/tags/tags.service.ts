import { HttpStatus, Injectable } from '@nestjs/common';
import { TagDAL } from './tags/tag.dal';
import { CustomHttpException } from 'src/shared/exception.handler';

@Injectable()
export class TagService {
  constructor(private readonly tagDal: TagDAL) { }

  async createTags(postId: string, userIds: string[]) {
    if (!userIds?.length) {
      throw new CustomHttpException(
        'No user IDs provided to tag',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tags = userIds.map((userId) => ({
      post: postId,
      taggedUser: userId,
    }));
    const created = await this.tagDal.create(tags);
    return {
      message: 'Users tagged successfully',
      data: created,
    };
  }

  async getTagsForPost(postId: string) {
    const tags = await this.tagDal.find({ post: postId });
    if (!tags?.length) {
      throw new CustomHttpException(
        `No tags found for post ${postId}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      message: 'Tags fetched successfully',
      data: tags,
    };
  }

  async updateTagsForPost(postId: string, userIds: string[]) {
    // remove all existing
    await this.tagDal.deleteMany({ post: postId });
    // create new
    const tags = userIds.map((userId) => ({
      post: postId,
      taggedUser: userId,
    }));
    const updated = await this.tagDal.create(tags);
    return {
      message: 'Tags updated successfully',
      data: updated,
    };
  }

  async deleteTagsForPost(postId: string) {
    const deleteCount = await this.tagDal.deleteMany({ post: postId });
    return {
      message: 'Tags deleted successfully',
      data: { deletedCount: deleteCount },
    };
  }

  async getUserMentions(userId: string) {
    const mentions = await this.tagDal.find({ taggedUser: userId });
    if (!mentions?.length) {
      throw new CustomHttpException(
        `No mentions found for user ${userId}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      message: 'User mentions fetched successfully',
      data: mentions,
    };
  }
}
