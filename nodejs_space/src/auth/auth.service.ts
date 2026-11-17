import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(email: string, password: string, name: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already in use');
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashed,
        name,
        plan: {
          create: { tier: 'FREE', aiQueriesUsed: 0, subscriptionCount: 0 },
        },
      },
    });
    const token = this.generateToken(user.id, user.email);
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.generateToken(user.id, user.email);
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { plan: true },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.plan?.tier ?? 'FREE',
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }

  getGoogleAuthUrl(redirectUri: string): string {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID') ?? 'PLACEHOLDER_CLIENT_ID';
    const appOrigin = (this.configService.get<string>('APP_ORIGIN') ?? 'http://localhost:3000').replace(/\/$/, '');
    const callbackUrl = `${appOrigin}/api/auth/google/callback`;
    const secret = this.configService.getOrThrow<string>('JWT_SECRET');
    const statePayload = JSON.stringify({ redirectUri, ts: Date.now() });
    const hmac = crypto.createHmac('sha256', secret).update(statePayload).digest('hex');
    const state = Buffer.from(JSON.stringify({ payload: statePayload, sig: hmac })).toString('base64url');

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      access_type: 'offline',
      prompt: 'consent',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async handleGoogleCallback(code: string, stateStr: string): Promise<{ token: string; redirectUri: string; user: { id: string; email: string; name: string } }> {
    const secret = this.configService.getOrThrow<string>('JWT_SECRET');
    let redirectUri: string;
    try {
      const stateObj = JSON.parse(Buffer.from(stateStr, 'base64url').toString());
      const expectedHmac = crypto.createHmac('sha256', secret).update(stateObj.payload).digest('hex');
      if (expectedHmac !== stateObj.sig) throw new Error('Invalid state signature');
      const payload = JSON.parse(stateObj.payload);
      redirectUri = payload.redirectUri;
    } catch {
      throw new UnauthorizedException('Invalid state parameter');
    }

    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID') ?? 'PLACEHOLDER_CLIENT_ID';
    const clientSecret = this.configService.get<string>('GOOGLE_CLIENT_SECRET') ?? 'PLACEHOLDER_CLIENT_SECRET';
    const appOrigin = (this.configService.get<string>('APP_ORIGIN') ?? 'http://localhost:3000').replace(/\/$/, '');
    const callbackUrl = `${appOrigin}/api/auth/google/callback`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.id_token) throw new UnauthorizedException('Failed to get Google token');

    const userInfoRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userInfo = await userInfoRes.json();
    if (!userInfo.email) throw new UnauthorizedException('No email from Google');

    let user = await this.prisma.user.findUnique({ where: { email: userInfo.email } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name ?? userInfo.email.split('@')[0],
          googleId: userInfo.sub,
          plan: { create: { tier: 'FREE', aiQueriesUsed: 0, subscriptionCount: 0 } },
        },
      });
    } else if (!user.googleId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { googleId: userInfo.sub },
      });
    }

    const token = this.generateToken(user.id, user.email);
    return { token, redirectUri, user: { id: user.id, email: user.email, name: user.name } };
  }
}
