import { Injectable } from '@nestjs/common';
import { UserDAL } from './dals/user.dal';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userDal: UserDAL){}
  create(payload: User) {
    return this.userDal.create(payload);
  }

  findOne(
    query: Partial<User>,
    select?: string[],
    populate?: Parameters<typeof this.userDal.findOne>[2],
  ) {
    return this.userDal.findOne(query, select, populate);
  }

  updateOne(
    query: Partial<User>,
    update: Partial<User>,
    unset?: Partial<Record<keyof User, boolean>>,
  ) {
    return this.userDal.updateOne(query, update, unset);
  }

  findUsersByIds(ids: string[], select?: string[]) {
    return this.userDal.find({ _id: ids }, select);
  }

  findByEmail(email: string[], select?: string[]) {
    return this.userDal.find({ email }, select);
  }
}
