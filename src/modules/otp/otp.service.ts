import ApiError from "../../common/utils/ApiError";
import { otpServiceDependencies } from "./dependencies/otp.dependencies";
export { otpServiceDependencies } from "./dependencies/otp.dependencies";

export async function generateOtp(email: string, purpose: string) {
  const generatedCode = otpServiceDependencies
    .randomInt(100000, 1000000)
    .toString();

  const expireDate = new Date(
    otpServiceDependencies.now().getTime() + 10 * 60 * 1000,
  );

  const otp = await otpServiceDependencies.prisma.otp.upsert({
    create: {
      email: email,
      code: generatedCode,
      purpose: purpose,
      expiresAt: expireDate,
    },
    update: {
      code: generatedCode,
      purpose: purpose,
      expiresAt: expireDate,
      usedAt: null,
      attempts: 0,
    },
    where: {
      email_purpose: { email, purpose },
    },
  });

  if (!otp) {
    throw new ApiError(500, "Server Error");
  }
  return otp.code;
}

export async function verifyOtp(email: string, code: string, purpose: string) {
  const now = otpServiceDependencies.now();
  const consumed = await otpServiceDependencies.prisma.otp.updateMany({
    where: {
      email: email,
      code: code,
      purpose: purpose,
      usedAt: null,
      expiresAt: { gt: now },
      attempts: { lt: 5 },
    },
    data: { usedAt: now },
  });

  if (consumed.count === 1) {
    return true;
  }

  await otpServiceDependencies.prisma.otp.updateMany({
    where: {
      email: email,
      purpose: purpose,
      usedAt: null,
      expiresAt: { gt: now },
      attempts: { lt: 5 },
    },
    data: { attempts: { increment: 1 } },
  });

  throw new ApiError(400, "Invalid or expired OTP");
}
