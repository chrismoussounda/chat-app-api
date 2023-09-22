import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from './constant';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { UserService } from '@/user/user.service';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UserService,
    private authService: AuthService,
  ) {}
  executionContext: 'after';

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const response = context.switchToHttp().getResponse();
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    let token = this.extractTokenFromHeader(request);
    if (token && (await this.userService.valideToken(token))) {
      const { expired, soon } = this.authService.isAccessTokenExpired(token);
      if (expired) {
        this.userService.cleanTokens();
        const refreshToken = response.req.signedCookies['refresh_token'];
        if (refreshToken) {
          try {
            const newAccessToken = await this.authService.refreshAccessToken(
              refreshToken,
              token,
            );
            response.setHeader('X-New-Access-Token', newAccessToken);
            await this.userService.removeToken(refreshToken);
            token = newAccessToken;
          } catch (error) {
            console.log(error.message);
          }
        }
      }
    } else throw new UnauthorizedException();
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      const user = await this.userService.findOne(payload.sub);
      request['user'] = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
