import { HttpStatus, Injectable } from '@nestjs/common';
import { PostDAL } from './dals/post.dal';
import { TagService } from '../tags/tags.service';
import { CustomHttpException } from 'src/shared/exception.handler';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    private readonly postDal: PostDAL,
    private readonly tagService: TagService,
  ) { }

  async createPost(payload: any) {
    const post = await this.postDal.create({
      content: payload.content,
      forum: payload.forumId,
      author: payload.authorId,
      parentPost: payload.parentPostId,
    });

    // Handle tagging
    if (payload.taggedUserIds?.length) {
      await this.tagService.createTags(
        post._id.toString(),
        payload.taggedUserIds
      );
    }

    return {message: 'Post created successfully', data: post};
  }

  async getPostById(id: string, populate?: any) {
    const post = await this.postDal.findOne({ _id: id }, null, populate);
    if (!post) {
      throw new CustomHttpException(
        `Post with id=${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: 'Post fetched successfully', data: post };
  }

  async getForumPosts(forumId: string) {
    const posts = await this.postDal.find({ forum: forumId, parentPost: null });
    return { message: 'Forum posts fetched successfully', data: posts };
  }

  async getPostReplies(postId: string) {
    const replies = await this.postDal.find({ parentPost: postId });
    return { message: 'Post replies fetched successfully', data: replies };
  }

  async updatePost(id: string, update: any, user: User) {
    const existing = await this.postDal.findOne({ _id: id, author: user.id });
    if (!existing) {
      throw new CustomHttpException(
        `Post with id=${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const updated = await this.postDal.updateOne({ _id: id }, update);

    if (update.taggedUserIds) {
      await this.tagService.updateTagsForPost(id, update.taggedUserIds);
    }

    return { message: 'Post updated successfully', data: updated };
  }

  async deletePost(id: string, user: User) {
    const existing = await this.postDal.findOne({ _id: id,  author: user.id});
    if (!existing) {
      throw new CustomHttpException(
        `Post with id=${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    await this.tagService.deleteTagsForPost(id);
    await this.postDal.deleteMany({ _id: id });

    return { message: 'Post deleted successfully', data: null };
  }
}
