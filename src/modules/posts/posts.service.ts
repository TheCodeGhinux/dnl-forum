import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostDAL } from './dals/post.dal';
import { TagService } from '../tags/tags.service';

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
    return this.postDal.findOne({ _id: id }, null, populate);
  }

  async getForumPosts(forumId: string) {
    return this.postDal.find({ forum: forumId, parentPost: null });
  }

  async getPostReplies(postId: string) {
    return this.postDal.find({ parentPost: postId });
  }

  async updatePost(id: string, update: any) {
    const result = await this.postDal.updateOne({ _id: id }, update);

    // Update tags if needed
    if (update.taggedUserIds) {
      await this.tagService.updateTagsForPost(id, update.taggedUserIds);
    }

    return result;
  }

  async deletePost(id: string) {
    // Delete post and its tags
    await this.tagService.deleteTagsForPost(id);
    return this.postDal.deleteMany({ _id: id });
  }
}
