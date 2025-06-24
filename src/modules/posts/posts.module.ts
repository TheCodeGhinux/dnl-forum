import { Module } from '@nestjs/common';
import { PostService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_TABLE_NAMES } from 'src/shared';
import { PostSchema } from './entities/post.entity';
import { TagsModule } from '../tags/tags.module';
import { PostDAL } from './dals/post.dal';
import { TokenService } from 'src/helpers/jwt.token.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_TABLE_NAMES.POSTS, schema: PostSchema },
    ]),
    TagsModule
  ],
  controllers: [PostsController],
  providers: [PostService, PostDAL, TokenService],
  exports: [PostService]
})
export class PostsModule {}
