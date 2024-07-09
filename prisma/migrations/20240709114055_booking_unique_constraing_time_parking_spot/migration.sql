/*
  Warnings:

  - A unique constraint covering the columns `[startDateTime,parkingSpotId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "idx_start_date_per_parking_spot";

-- CreateIndex
CREATE UNIQUE INDEX "Booking_startDateTime_parkingSpotId_key" ON "Booking"("startDateTime", "parkingSpotId");
