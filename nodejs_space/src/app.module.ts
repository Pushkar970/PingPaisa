import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ExpensesModule } from './expenses/expenses.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AiModule } from './ai/ai.module';
import { UserModule } from './user/user.module';
import { IncomeModule } from './income/income.module';
import { ExportModule } from './export/export.module';
import { PushTokensModule } from './push-tokens/push-tokens.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    SubscriptionsModule,
    ExpensesModule,
    IncomeModule,
    DashboardModule,
    AiModule,
    UserModule,
    ExportModule,
    PushTokensModule,
    NotificationsModule,
  ],
})
export class AppModule {}
