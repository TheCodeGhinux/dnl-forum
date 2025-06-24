import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import config from 'src/config/config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // JwtModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     secret: configService.get<string>('JWT_SECRET'),
    //     signOptions: { expiresIn: '1h' },
    //   }),
    //   inject: [ConfigService],
    // }),    
  UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
