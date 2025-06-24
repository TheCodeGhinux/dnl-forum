import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsNotEmpty } from 'class-validator';
import { Document, SchemaTypes } from 'mongoose';
import { Schema, BaseSchema } from 'src/database/schema/base.schema';
import { DB_TABLE_NAMES } from 'src/shared';

export type TagDocument = Tag & Document;

@Schema({ collection: DB_TABLE_NAMES.TAGS })
export class Tag extends BaseSchema {
  @IsString()
  @IsNotEmpty()
  @Prop({ type: SchemaTypes.ObjectId, ref: DB_TABLE_NAMES.POSTS, required: true })
  post: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ type: SchemaTypes.ObjectId, ref: DB_TABLE_NAMES.USERS, required: true })
  taggedUser: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
