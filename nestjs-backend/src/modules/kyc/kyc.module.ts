import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { KycRepository } from './kyc.repository';
import { FaydaService } from './services/fayda.service';
import { KycFraudProcessor } from './processors/kyc-fraud.processor';
import { KycOwnerGuard } from './guards/kyc-owner.guard';

@Module({
  imports: [PrismaModule],
  controllers: [KycController],
  providers: [
    KycService,
    KycRepository,
    FaydaService,
    KycFraudProcessor,
    KycOwnerGuard,
  ],
  exports: [KycService, KycRepository, FaydaService, KycFraudProcessor],
})
export class KycModule {}
