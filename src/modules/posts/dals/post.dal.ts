import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { BaseDAL } from 'src/database/dals';
import { DB_TABLE_NAMES } from 'src/shared';

import { Model } from 'src/database/schema/types';
import { Post, PostDocument } from '../entities/post.entity';

@Injectable()
export class PostDAL extends BaseDAL<Post, PostDocument> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.POSTS) posts: Model<PostDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(posts, connection);
  }
}