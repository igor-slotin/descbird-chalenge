import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { DbModule } from 'src/db/db.module';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
  imports: [DbModule, PermissionsModule],
  providers: [BookingService],
  controllers: [BookingController]
})
export class BookingModule {}
