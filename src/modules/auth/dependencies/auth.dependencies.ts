import bcrypt from "bcryptjs";
import prisma from "../../../db/prisma";
import {
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../../common/utils/jwt";
import { createUser, findByEmail, findById } from "../../users/users.service";
import { generateOtp, verifyOtp } from "../../otp/otp.service";
import { sendMail } from "../../mail/mail.service";
import type { AuthPrisma, AuthUserRecord } from "../types/auth.types";

const authPrisma: AuthPrisma = {
  user: {
    findFirst: (args) =>
      prisma.user.findFirst(
        args as Parameters<typeof prisma.user.findFirst>[0],
      ) as Promise<AuthUserRecord | null>,
    findUnique: (args) =>
      prisma.user.findUnique(
        args as Parameters<typeof prisma.user.findUnique>[0],
      ) as Promise<AuthUserRecord | null>,
    update: (args) =>
      prisma.user.update(
        args as Parameters<typeof prisma.user.update>[0],
      ) as Promise<AuthUserRecord | null>,
  },
};

export const authServiceDependencies = {
  createUser,
  findByEmail,
  findById,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashRefreshToken,
  createRefreshSession: (userId: string, token: string, expiresAt: Date) =>
    prisma.refreshSession.create({
      data: { userId, tokenHash: hashRefreshToken(token), expiresAt },
    }),
  rotateRefreshSession: async (
    userId: string,
    token: string,
    nextToken: string,
    expiresAt: Date,
  ) =>
    prisma.$transaction(async (tx) => {
      const session = await tx.refreshSession.findFirst({
        where: {
          userId,
          tokenHash: hashRefreshToken(token),
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
      });

      if (!session) return false;

      const updated = await tx.refreshSession.updateMany({
        where: { id: session.id, revokedAt: null },
        data: {
          revokedAt: new Date(),
          replacedByTokenHash: hashRefreshToken(nextToken),
        },
      });

      if (updated.count !== 1) return false;

      await tx.refreshSession.create({
        data: {
          userId,
          tokenHash: hashRefreshToken(nextToken),
          expiresAt,
        },
      });

      return true;
    }),
  revokeRefreshToken: (token: string) =>
    prisma.refreshSession.updateMany({
      where: { tokenHash: hashRefreshToken(token), revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  revokeAllRefreshSessions: (userId: string) =>
    prisma.refreshSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  generateOtp,
  verifyOtp,
  sendMail,
  bcrypt,
  prisma: authPrisma,
};
