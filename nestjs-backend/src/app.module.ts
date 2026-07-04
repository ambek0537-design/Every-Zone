import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentsModule } from './payments/payments.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { MediaModule } from './media/media.module';
import { AdminModule } from './modules/admin/admin.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { KycModule } from './modules/kyc/kyc.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';

@Module({
  imports: [
    PrismaModule, 
    PaymentsModule, 
    VendorsModule, 
    MediaModule,
    AdminModule,
    AnalyticsModule,
    HealthModule,
    AuthModule,
    UsersModule,
    KycModule,
    SubscriptionsModule
  ],
})
export class AppModule {}

