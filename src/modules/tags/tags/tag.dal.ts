import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { BaseDAL } from 'src/database/dals';
import { DB_TABLE_NAMES } from 'src/shared';

import { Model } from 'src/database/schema/types';
import { Tag, TagDocument } from '../entities/tag.entity';

@Injectable()
export class TagDAL extends BaseDAL<Tag, TagDocument> {
  constructor(
    @InjectModel(DB_TABLE_NAMES.TAGS) tags: Model<TagDocument>,
    @InjectConnection() connection: Connection,
  ) {
    super(tags, connection);
  }
}