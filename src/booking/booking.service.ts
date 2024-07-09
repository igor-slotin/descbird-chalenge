import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User, UserId, UserRole } from 'src/common/types/User';
import { DbService } from 'src/db/db.service';

@Injectable()
export class BookingService {
  constructor(
    private db: DbService, 
  ){}

  async getAllActiveBookings({
    userId,
    userRole
  }: {
    userId: UserId
    userRole: UserRole
  }) {
    let requestConditions = {
      where: {
        startDateTime: {
          gte: new Date(new Date().setUTCHours(0,0,0,0))
        }
      }
    }
    if (userRole === UserRole.USER) {
      requestConditions = Object.assign(requestConditions, {
        where: {
          ...requestConditions.where,
          createdByUser: {
            id: userId
          }
        },
        include: {
          createdByUser: true
        }
      })
    }
    return this.db.booking.findMany(requestConditions);
  }

  async createNewBooking({
    parkingSpotId,
    startingDate,
    userId
  }: {
    parkingSpotId: number;
    userId: UserId;
    startingDate: Date | string
  }) {
    const parkingSpot = await this.db.parkingSpot.findUnique({
      where: {
        id: parkingSpotId
      }
    });

    if (!parkingSpot) {
      throw new NotFoundException("Parking spot not found");
    }

    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const startDateTime = startingDate ? 
      new Date(new Date(startingDate).setUTCHours(0,0,0,0)) : new Date(new Date().setUTCHours(0,0,0,0));

    try {
      const booking = await this.db.booking.create({
        data: {
          startDateTime,
          createdByUser: {
            connect: {
              id: user.id
            }
          },
          parkingSpot: {
            connect: {
              id: parkingSpot.id
            }
          },
        }
      });
      return booking;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BadRequestException("Parking spot already booked for this day")
      }
      throw error;
    }
  }

  async editBooking({
    bookingId,
    startDateTime,
    parkingSpotId
  }: {
    bookingId: number;
    startDateTime?: Date | string;
    parkingSpotId?: number;
  }) {
    const booking = await this.db.booking.findUnique({
      where: {
        id: bookingId
      },
      include: {
        parkingSpot: true,
      }
    });

    try {
      return await this.db.booking.update({
        where: {
          id: bookingId
        },
        data: {
          parkingSpot: {
            connect: {
              id: parkingSpotId ?? booking.parkingSpot.id
            }
          },
          startDateTime: startDateTime ? new Date(new Date(startDateTime).setUTCHours(0,0,0,0)) : booking.startDateTime,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BadRequestException("Parking spot already booked for this day")
      }
      throw error;
    }
  }

  async deleteBooking({bookingId}: {bookingId: number}) {
    return this.db.booking.delete({
      where: {
        id: bookingId
      }
    })
  }
}
