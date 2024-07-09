import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { BookingGuard } from 'src/permissions/booking/booking.guard';
import { Request } from 'express';
import { BookingService } from './booking.service';
import { User } from 'src/common/types/User';
import { CreateBookingDTO, EditBookingDTO } from './dto';

@Controller('booking')
export class BookingController {
  constructor(
    private bookingService: BookingService
  ) {}
  @UseGuards(BookingGuard)
  @Get("")
  async getBookings(@Req() request: Request) {
    const user = request["user"] as User;
    return this.bookingService.getAllActiveBookings({
      userId: user.id,
      userRole: user.role
    });
  }

  @UseGuards(BookingGuard)
  @Post("")
  async createBooking(
    @Req() request: Request,
    @Body() body: CreateBookingDTO,
  ) {
    const user = request["user"] as User;
    return this.bookingService.createNewBooking({
      userId: body.userId ?? user.id,
      parkingSpotId: body.parkingSpotId,
      startingDate: body.startDateTime
    })
  }

  @UseGuards(BookingGuard)
  @Put(":bookingId")
  async editBooking(
    @Param('bookingId') bookingId: string,
    @Body() body: EditBookingDTO,
  ) {
    return this.bookingService.editBooking({...body, bookingId: Number(bookingId)})
  }

  @UseGuards(BookingGuard)
  @Delete(":bookingId")
  async deleteBooking(
    @Param('bookingId') bookingId: string,
  ) {
    return this.bookingService.deleteBooking({bookingId: Number(bookingId)});
  }
}
