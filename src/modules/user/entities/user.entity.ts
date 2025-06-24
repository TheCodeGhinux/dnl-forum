import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsString, IsNotEmpty, IsEmail, IsEnum, IsDate, IsOptional, IsArray } from 'class-validator';
import { Document, SchemaTypes } from 'mongoose';
import { BaseSchema, Schema } from 'src/database/schema/base.schema';
import { DB_TABLE_NAMES } from 'src/shared';

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({ collection: DB_TABLE_NAMES.USERS })
export class User extends BaseSchema {
  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @Prop({ required: true, unique: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  password: string;

  @IsEnum(UserRole)
  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @IsDate()
  @IsOptional()
  @Prop()
  lastActive?: Date;

  @IsArray()
  @IsOptional()
  @Prop({ type: [SchemaTypes.ObjectId], ref: DB_TABLE_NAMES.FORUMS, default: [] })
  forums: string[]; 
}

export const UserSchema = SchemaFactory.createForClass(User);
