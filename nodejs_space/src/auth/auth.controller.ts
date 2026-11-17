import { Controller, Post, Get, Body, UseGuards, Req, Res, Query, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, MeResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('api')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() dto: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signup(dto.email, dto.password, dto.name);
  }

  @Post('auth/login')
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/me')
  async me(@Req() req: Request): Promise<MeResponseDto> {
    const user = req.user as { id: string };
    return this.authService.getMe(user.id);
  }

  @Get('auth/google')
  async googleAuth(@Query('redirect_uri') redirectUri: string, @Res() res: Response): Promise<void> {
    const url = this.authService.getGoogleAuthUrl(redirectUri ?? '');
    res.redirect(url);
  }

  @Get('auth/google/callback')
  async googleCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response): Promise<void> {
    try {
      const result = await this.authService.handleGoogleCallback(code, state);
      const userJson = encodeURIComponent(JSON.stringify(result.user));
      const redirectUrl = new URL(result.redirectUri || '/');
      redirectUrl.searchParams.set('token', result.token);
      redirectUrl.searchParams.set('user', userJson);
      res.redirect(redirectUrl.toString());
    } catch (error: any) {
      this.logger.error('Google callback error', error?.message);
      res.redirect(`/auth/login?error=${encodeURIComponent(error?.message ?? 'Google login failed')}`);
    }
  }
}
