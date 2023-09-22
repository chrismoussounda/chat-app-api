import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('signin')
  async login(@Body() authDto: AuthDto, @Res() res: Response) {
    const accessToken = await this.authService.login(authDto, res);
    res.json({ accessToken });
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('signup')
  async signup(@Body() authDto: AuthDto, @Res() res: Response) {
    const accessToken = await this.authService.signup(authDto, res);
    res.json({ accessToken });
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('refresh_token');
    res.end();
  }
}
