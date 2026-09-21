import prisma from "../../../db/prisma";
import crypto from "node:crypto";

export const otpServiceDependencies: any = {
  prisma: {
    otp: {
      upsert: (args: any) => prisma.otp.upsert(args),
      updateMany: (args: any) => prisma.otp.updateMany(args),
    },
  },
  now: () => new Date(),
  randomInt: (min: number, max: number) => crypto.randomInt(min, max),
};
