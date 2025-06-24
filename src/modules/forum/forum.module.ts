import { Module } from '@nestjs/common';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from 'src/shared';
import { UserSchema } from '../user/entities/user.entity';
import { PostSchema } from '../posts/entities/post.entity';
import { ForumDAL } from './dals/forum.dal';
import { ForumSchema } from './entities/forum.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_TABLE_NAMES.FORUMS, schema: ForumSchema },
    ]),
  ],
  controllers: [ForumController],
  providers: [ForumService, ForumDAL],
  exports: [ForumService]
})
export class ForumModule {}
