import { IsInt, IsDateString, IsOptional } from 'class-validator';

export class CreateBookingDTO {
  @IsInt()
  @IsOptional()
  userId?: number;

  @IsInt()
  parkingSpotId: number;

  @IsDateString()
  startDateTime: Date;
}

export class EditBookingDTO {
  @IsInt()
  @IsOptional()
  parkingSpotId: number;

  @IsDateString()
  @IsOptional()
  startDateTime: Date;
}