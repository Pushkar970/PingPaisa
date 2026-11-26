import { Controller, Post, Headers, UnauthorizedException, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { PushNotificationService } from './push-notification.service';
import { InactivityReminderResponseDto } from './dto/notification.dto';

@ApiTags('Notifications')
@Controller('api/notifications')
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(
    private prisma: PrismaService,
    private pushService: PushNotificationService,
    private configService: ConfigService,
  ) {}

  @Post('send-inactivity-reminders')
  async sendInactivityReminders(
    @Headers('x-api-key') apiKey: string,
  ): Promise<InactivityReminderResponseDto> {
    // Protect with constant-time API key check
    const expectedKey = this.configService.get<string>('CRON_API_KEY') ?? '';
    const keyBuf = Buffer.from(apiKey ?? '');
    const expectedBuf = Buffer.from(expectedKey);
    if (!expectedKey || keyBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(keyBuf, expectedBuf)) {
      throw new UnauthorizedException('Invalid API key');
    }

    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    // Find users with push tokens who haven't logged an expense in 2+ days
    const usersWithTokens = await this.prisma.pushToken.findMany({
      select: { userId: true },
      distinct: ['userId'],
    });

    let notified = 0;
    let skipped = 0;

    for (const { userId } of usersWithTokens) {
      // Check the user's most recent expense
      const latestExpense = await this.prisma.expense.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      });

      // Also check income and subscriptions activity
      const [latestIncome, latestSub] = await Promise.all([
        this.prisma.income.findFirst({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true },
        }),
        this.prisma.subscription.findFirst({
          where: { userId },
          orderBy: { updatedAt: 'desc' },
          select: { updatedAt: true },
        }),
      ]);

      const lastActivity = [
        latestExpense?.createdAt,
        latestIncome?.createdAt,
        latestSub?.updatedAt,
      ]
        .filter(Boolean)
        .sort((a, b) => (b as Date).getTime() - (a as Date).getTime())[0];

      // If user has never logged anything, or last activity was 2+ days ago
      if (!lastActivity || (lastActivity as Date) < twoDaysAgo) {
        try {
          await this.pushService.sendToUser(
            userId,
            'Time to track! \uD83D\uDCB0',
            'Have any recent transactions? Tap to Smart Paste them from your bank SMS.',
            { screen: '/expense/smart-paste' },
          );
          notified++;
        } catch (e: any) {
          this.logger.error(`Failed to notify user ${userId}: ${e?.message}`);
          skipped++;
        }
      } else {
        skipped++;
      }
    }

    this.logger.log(`Inactivity reminders: ${notified} notified, ${skipped} skipped out of ${usersWithTokens.length}`);
    return {
      usersNotified: notified,
      usersSkipped: skipped,
      totalUsers: usersWithTokens.length,
    };
  }
}
