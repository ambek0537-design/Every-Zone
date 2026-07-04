import { Module } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { VendorsRepository } from './vendors.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VendorsController],
  providers: [VendorsService, VendorsRepository],
  exports: [VendorsService, VendorsRepository],
})
export class VendorsModule {}
