-- Add missing optional phone field on User.
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "phone" TEXT;

-- Enforce doctor slot uniqueness at DB level.
CREATE UNIQUE INDEX IF NOT EXISTS "Appointment_doctorId_date_startTime_key"
ON "Appointment" ("doctorId", "date", "startTime");
