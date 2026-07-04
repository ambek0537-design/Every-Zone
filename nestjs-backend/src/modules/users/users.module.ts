import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController, FavoritesController, UserVendorsController } from './users.controller';
import { UsersRepository } from './users.repository';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController, FavoritesController, UserVendorsController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
