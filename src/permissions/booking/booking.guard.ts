import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DbService } from 'src/db/db.service';
import { Request } from 'express';

@Injectable()
export class BookingGuard implements CanActivate {
  constructor(
    private db: DbService 
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    if (!req.headers["token"]) {
      throw new UnauthorizedException();
    }
    const user = await this.db.user.findFirst({
      where: {
        token: req.headers["token"] as string
      }
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    
    req["user"] = user;
    
    if (req.method === "GET") {
      return true;
    }
    
    if (user.role === "ADMIN") {
      return true;
    }

    if (req.method === "POST") {
      if (req.body["userId"] && req.body["userId"] !== user.id) {
        throw new UnauthorizedException();
      }
      return true;
    }

    const bookingId = Number(req.params["bookingId"]);
    if (!Number.isFinite(bookingId)) {
      throw new BadRequestException();
    }

    const existingBooking = await this.db.booking.findFirst({
      where: {
        id: bookingId
      }, 
      include: {
        createdByUser: true
      }
    });

    if (existingBooking && existingBooking.createdByUser && existingBooking.createdByUser.id !== user.id) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
