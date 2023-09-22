import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthDto } from './dto/auth.dto';
import { UserService } from '@/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { jwtConstants } from './constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ name, password }: AuthDto, res: Response) {
    const user = await this.userService.findOneByName(name);
    if (!user) throw new NotFoundException('User not found');
    const match = await this.userService.checkPassword(user.password, password);
    if (!match) throw new UnauthorizedException('Wrong Password');
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });
    await this.userService.addToken(user.id, accessToken, 60 * 60 * 1000);
    return accessToken;
  }

  async signup(authDto: AuthDto, res: Response) {
    const user = await this.userService.create(authDto);
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });
    await this.userService.addToken(user.id, accessToken, 60 * 60 * 1000);
    return accessToken;
  }

  isAccessTokenExpired(accessToken: string) {
    try {
      const { exp } = this.jwtService.verify(accessToken) as {
        exp: number;
      };
      const expirationDate = new Date(exp * 1000);
      const thirtyMinutesFromNow = new Date(Date.now() + 30 * 60 * 1000);
      if (expirationDate < thirtyMinutesFromNow) {
        console.log('Less than 30 minutes until the token expires');
        return { expired: false, soon: true };
      }
      return { expired: false, soon: false };
    } catch (error) {
      this.userService.cleanTokens();
      return { expired: true, soon: false };
    }
  }

  async verifyToken(accessToken: string) {
    try {
      const { sub } = this.jwtService.verify(accessToken) as {
        sub: string;
      };
      const user = await this.userService.findOne(sub);
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  async refreshAccessToken(
    refreshToken: string,
    token: string,
  ): Promise<string> {
    const decodedRefreshToken = this.jwtService.verify(refreshToken, {
      secret: jwtConstants.refresh,
    }) as {
      sub: string;
    };
    if (!decodedRefreshToken || !decodedRefreshToken.sub)
      throw new Error('Invalid refresh token');
    await this.userService.removeToken(token);
    return this.jwtService.sign({
      sub: decodedRefreshToken.sub,
    });
  }

  generateRefreshToken(user: User) {
    return this.jwtService.signAsync(
      {
        sub: user.id,
        username: user.name,
      },
      {
        expiresIn: '30d',
        secret: jwtConstants.refresh,
      },
    );
  }

  generateAccessToken(user: User) {
    return this.jwtService.signAsync({
      sub: user.id,
      username: user.name,
    });
  }
}
