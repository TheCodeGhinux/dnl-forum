import { Module } from '@nestjs/common';
import { TagService } from './tags.service';
import { TagsController } from './tags.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from 'src/shared';
import { UserSchema } from '../user/entities/user.entity';
import { TagSchema } from './entities/tag.entity';
import { TagDAL } from './tags/tag.dal';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_TABLE_NAMES.TAGS, schema: TagSchema },
    ]),
  ],
  controllers: [TagsController],
  providers: [TagService, TagDAL],
  exports: [TagService]
})
export class TagsModule {}
