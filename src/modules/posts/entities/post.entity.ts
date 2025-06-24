import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsNotEmpty, IsDate, IsOptional, IsArray } from 'class-validator';
import { Document, SchemaTypes } from 'mongoose';
import { Schema, BaseSchema } from 'src/database/schema/base.schema';
import { DB_TABLE_NAMES } from 'src/shared';


@Schema({ collection: DB_TABLE_NAMES.POSTS })
export class Post extends BaseSchema {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  content: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ type: SchemaTypes.ObjectId, ref: DB_TABLE_NAMES.FORUMS, required: true })
  forum: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ type: SchemaTypes.ObjectId, ref: DB_TABLE_NAMES.USERS, required: true })
  author: string;

  @IsOptional()
  @Prop({ type: SchemaTypes.ObjectId, ref: DB_TABLE_NAMES.POSTS })
  parentPost?: string;

  @IsArray()
  @IsOptional()
  @Prop({ type: [SchemaTypes.ObjectId], ref: DB_TABLE_NAMES.TAGS, default: [] })
  tags?: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
export type PostDocument = Post & Document;

PostSchema.virtual('replies', {
  ref: DB_TABLE_NAMES.POSTS,
  localField: '_id',
  foreignField: 'parentPost',
});

PostSchema.virtual('taggedUsers', {
  ref: DB_TABLE_NAMES.USERS,
  localField: 'tags.taggedUser',
  foreignField: '_id',
});