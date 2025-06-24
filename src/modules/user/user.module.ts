import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DB_TABLE_NAMES } from 'src/shared';
import { UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDAL } from './dals/user.dal';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_TABLE_NAMES.USERS, schema: UserSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserDAL],
  exports: [UserService]
})
export class UserModule {}
