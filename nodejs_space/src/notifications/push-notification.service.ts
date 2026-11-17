import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getMessaging, Messaging } from 'firebase-admin/messaging';
import * as http2 from 'http2';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class PushNotificationService implements OnModuleInit {
  private readonly logger = new Logger(PushNotificationService.name);
  private fcm?: Messaging;
  private apnsJwt?: { token: string; issuedAt: number };

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    const raw = process.env.FCM_SERVICE_ACCOUNT_B64;
    if (!raw) {
      this.logger.warn('FCM_SERVICE_ACCOUNT_B64 not set — Android push disabled');
      return;
    }
    try {
      const serviceAccount = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
      const app = getApps().length ? getApp() : initializeApp({ credential: cert(serviceAccount) });
      this.fcm = getMessaging(app);
      this.logger.log('FCM initialized successfully');
    } catch (e: any) {
      this.logger.error(`FCM init failed: ${e?.message}`);
    }
  }

  private apnsToken(): string | undefined {
    const { APNS_KEY_ID, APNS_TEAM_ID, APNS_PRIVATE_KEY_B64 } = process.env;
    if (!APNS_KEY_ID || !APNS_TEAM_ID || !APNS_PRIVATE_KEY_B64) return undefined;
    const now = Math.floor(Date.now() / 1000);
    if (this.apnsJwt && now - this.apnsJwt.issuedAt < 50 * 60) return this.apnsJwt.token;
    const key = Buffer.from(APNS_PRIVATE_KEY_B64, 'base64').toString('utf8');
    const token = jwt.sign({ iss: APNS_TEAM_ID, iat: now }, key, {
      algorithm: 'ES256',
      header: { alg: 'ES256', kid: APNS_KEY_ID } as any,
    });
    this.apnsJwt = { token, issuedAt: now };
    return token;
  }

  async sendAndroid(token: string, title: string, body: string, data: Record<string, string> = {}) {
    if (!this.fcm) return;
    try {
      await this.fcm.send({ token, notification: { title, body }, data, android: { priority: 'high' } });
    } catch (e: any) {
      if (
        e?.code === 'messaging/registration-token-not-registered' ||
        e?.code === 'messaging/invalid-registration-token'
      ) {
        await this.prisma.pushToken.deleteMany({ where: { token } });
      } else {
        this.logger.error(`FCM send failed: ${e?.message ?? e}`);
      }
    }
  }

  async sendIos(deviceToken: string, title: string, body: string, data: Record<string, any> = {}) {
    const bearer = this.apnsToken();
    const topic = process.env.IOS_BUNDLE_ID;
    if (!bearer || !topic) {
      this.logger.warn('APNS_* / IOS_BUNDLE_ID not set — iOS push disabled');
      return;
    }
    await new Promise<void>((resolve) => {
      const client = http2.connect('https://api.push.apple.com');
      const req = client.request({
        ':method': 'POST',
        ':path': `/3/device/${deviceToken}`,
        authorization: `bearer ${bearer}`,
        'apns-topic': topic,
        'apns-push-type': 'alert',
        'apns-priority': '10',
      });
      let status = 0;
      let responseBody = '';
      req.on('response', (headers) => { status = Number(headers[':status']); });
      req.on('data', (chunk) => { responseBody += chunk; });
      req.on('end', async () => {
        if (status === 410 || responseBody.includes('Unregistered') || responseBody.includes('BadDeviceToken')) {
          await this.prisma.pushToken.deleteMany({ where: { token: deviceToken } });
        } else if (status >= 400) {
          this.logger.error(`APNs ${status}: ${responseBody}`);
        }
        client.close();
        resolve();
      });
      req.on('error', (e) => { this.logger.error(`APNs request failed: ${e.message}`); client.close(); resolve(); });
      req.end(JSON.stringify({ aps: { alert: { title, body }, sound: 'default' }, ...data }));
    });
  }

  async sendToUser(userId: string, title: string, body: string, data: Record<string, string> = {}) {
    const tokens = await this.prisma.pushToken.findMany({ where: { userId } });
    if (tokens.length === 0) {
      this.logger.log(`No push tokens for user ${userId}`);
      return;
    }
    const promises = tokens.map((t) => {
      if (t.deviceType === 'android') return this.sendAndroid(t.token, title, body, data);
      if (t.deviceType === 'ios') return this.sendIos(t.token, title, body, data);
      return Promise.resolve();
    });
    await Promise.all(promises);
    this.logger.log(`Sent push notification to ${tokens.length} device(s) for user ${userId}`);
  }
}
