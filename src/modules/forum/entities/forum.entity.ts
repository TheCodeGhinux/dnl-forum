import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsNotEmpty, IsDate, IsArray } from 'class-validator';
import { Document, SchemaTypes } from 'mongoose';
import { BaseSchema, Schema } from 'src/database/schema/base.schema';
import { DB_TABLE_NAMES } from 'src/shared';

@Schema({ collection: DB_TABLE_NAMES.FORUMS })
export class Forum extends BaseSchema {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true, unique: true })
  title: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  description: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ type: SchemaTypes.ObjectId, ref: DB_TABLE_NAMES.USERS, required: true })
  createdBy: string;

  @IsArray()
  @Prop({ type: [SchemaTypes.ObjectId], ref: DB_TABLE_NAMES.USERS, default: [] })
  members: string[];
}

export const ForumSchema = SchemaFactory.createForClass(Forum);
export type ForumDocument = Forum & Document;

ForumSchema.virtual('posts', {
  ref: DB_TABLE_NAMES.POSTS,
  localField: '_id',
  foreignField: 'forum',
});
