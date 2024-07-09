-- DropIndex
DROP INDEX "idx_start_date_per_booking_id";

-- CreateIndex
CREATE INDEX "idx_start_date_per_parking_spot" ON "Booking"("startDateTime", "parkingSpotId");
