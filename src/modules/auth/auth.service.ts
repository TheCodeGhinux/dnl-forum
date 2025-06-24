import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { hash, compare } from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CustomHttpException } from 'src/shared/exception.handler';
import { LOGGER } from 'src/shared';
import { Logger } from 'winston';
import moment from 'moment';
import { pick } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger: Logger;
  constructor(private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(LOGGER) logger: Logger,
  ) {
    this.logger = logger.child({ service: AuthService.name });
  }

  async register(payload: any) {

    const existingUser = await this.userService.findOne({
      email: payload.email.trim().toLowerCase(),
    });

    if (existingUser) {
      this.logger.info('Failed signup attempt', {
        payload: { ...payload, password: '' },
      });

      throw new CustomHttpException('email already in use', HttpStatus.CONFLICT);
    }

    const hashedPassword = await hash(payload.password, 8);

    const newUser = await this.userService.create({
      ...payload,
      email: payload.email.trim().toLowerCase(),
      password: hashedPassword,
    });

    this.logger.info('Successful signup', {
      payload: { ...payload, password: '' },
      newUser,
    });

    const tokens = await this.getAuthTokens(newUser);
    return { message: "Successfully signed up", data: {newUser, tokens} };

  }

  async login(payload: LoginDto) {
    const user = await this.userService.findOne({
      email: payload.email.trim().toLowerCase(),
    });

    const isValidPassword = await compare(
      payload.password,
      user?.password ?? '',
    );
    if (!user || !isValidPassword) {
      this.logger.info('Failed login attempt', {
        payload: { ...payload, password: '' },
        user,
      });

      throw new CustomHttpException('invalid credentials', HttpStatus.FORBIDDEN);
    }

    const tokens = await this.getAuthTokens(user);
    this.logger.info('Successful login', {
      payload: { ...payload, password: '' },
      user,
    });
    return {message: "Successfully logged in", data: {user, tokens}};
  }

  async getAuthTokens(user: User) {

    const payload = { ...pick(user, ['id', 'email', 'username'])};
    const accessToken = this.jwtService.sign(payload);
    // const accessTokenExpires = this.getExpirationDateFromToken(accessToken);

    return {
      accessToken,
    };
  }

  getExpirationDateFromToken(token: string) {
    try {
      const [, payload] = token.split('.');
      const parsedPayload = Buffer.from(`${payload}==`, 'base64').toString();
      const payloadJSON = JSON.parse(parsedPayload);

      return moment(payloadJSON.exp * 1000).toDate();
    } catch (error) {
      this.logger.error('Failed to parse token expiration date', { error });

      return new Date('Invalid Date');
    }
  }
}
