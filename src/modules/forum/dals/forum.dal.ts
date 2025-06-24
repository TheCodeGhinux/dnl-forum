import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { BaseDAL } from 'src/database/dals';
import { DB_TABLE_NAMES } from 'src/shared';

import { Model } from 'src/database/schema/types';
import { Forum, ForumDocument } from '../entities/forum.entity';

@Injectable()
export class ForumDAL extends BaseDAL<Forum, ForumDocument> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.FORUMS) forums: Model<ForumDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(forums, connection);
  }
}