ALTER TABLE "Otp" DROP CONSTRAINT IF EXISTS "Otp_email_key";
ALTER TABLE "Otp" ADD COLUMN "attempts" INTEGER NOT NULL DEFAULT 0;
CREATE UNIQUE INDEX "Otp_email_purpose_key" ON "Otp"("email", "purpose");
CREATE INDEX "Otp_email_purpose_expiresAt_idx" ON "Otp"("email", "purpose", "expiresAt");