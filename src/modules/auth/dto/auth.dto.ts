import { UserRole } from "src/modules/user/entities/user.entity";
import { PartialType } from '@nestjs/swagger';

export class CreateAuthDto {
  email: string;
  username: string;
  password: string;
  role?: UserRole;
}


export class UpdateAuthDto extends PartialType(CreateAuthDto) { }

export class LoginDto {
  email: string;
  password: string;
}