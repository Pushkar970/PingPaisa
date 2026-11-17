import { Controller, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePushTokenDto, PushTokenResponseDto } from './dto/push-token.dto';

@ApiTags('Push Tokens')
@UseGuards(JwtAuthGuard)
@Controller('api/push-tokens')
export class PushTokensController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async register(@Req() req: Request, @Body() dto: CreatePushTokenDto): Promise<PushTokenResponseDto> {
    const user = req.user as { id: string };
    await this.prisma.pushToken.upsert({
      where: { token: dto.token },
      update: { userId: user.id, deviceType: dto.deviceType },
      create: { token: dto.token, deviceType: dto.deviceType, userId: user.id },
    });
    return { success: true };
  }

  @Delete(':token')
  async remove(@Req() req: Request, @Param('token') token: string): Promise<PushTokenResponseDto> {
    const user = req.user as { id: string };
    await this.prisma.pushToken.deleteMany({ where: { token, userId: user.id } });
    return { success: true };
  }
}
