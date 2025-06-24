import { AuthGuard } from "../middlewares/auth.guard";
// import { EmailVerificationGuard } from "@middlewares/verified.guard";
import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from "@nestjs/common";
import { JwtPayload } from "jsonwebtoken";

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.user as JwtPayload;
  },
);

// export const verifiedUser = () =>
//   applyDecorators(UseGuards(AuthGuard, EmailVerificationGuard));
export const verifiedUser = () =>
  applyDecorators(UseGuards(AuthGuard));
