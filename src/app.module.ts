import { Module } from '@nestjs/common';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [BookingModule],
  providers: [],
})
export class AppModule {}
