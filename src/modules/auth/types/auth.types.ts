export type AuthUserRecord = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  isVerified: boolean;
};

export type AuthPrisma = {
  user: {
    findFirst: (args: unknown) => Promise<AuthUserRecord | null>;
    findUnique: (args: unknown) => Promise<AuthUserRecord | null>;
    update: (args: unknown) => Promise<AuthUserRecord | null>;
  };
};

export type AuthServiceDependencies = {
  createUser: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<AuthUserRecord>;
  findByEmail: (email: string) => Promise<AuthUserRecord | null>;
  findById: (id: string) => Promise<AuthUserRecord | null>;
  signAccessToken: (payload: { id: string; role: string }) => string;
  signRefreshToken: (payload: { id: string; role: string }) => string;
  verifyRefreshToken: (token: string) => {
    id: string;
    role: string;
  };
  hashRefreshToken: (token: string) => string;
  generateOtp: (email: string, purpose: string) => Promise<string>;
  verifyOtp: (email: string, code: string, purpose: string) => Promise<boolean>;
  sendMail: (options: { to: string; subject: string; html: string }) => void;
  bcrypt: {
    compare: (value: string, hash: string) => Promise<boolean>;
    hash: (value: string, rounds: number) => Promise<string>;
  };
  prisma: AuthPrisma;
  createRefreshSession: (
    userId: string,
    token: string,
    expiresAt: Date,
  ) => Promise<unknown>;
  rotateRefreshSession: (
    userId: string,
    token: string,
    nextToken: string,
    expiresAt: Date,
  ) => Promise<boolean>;
  revokeRefreshToken: (token: string) => Promise<unknown>;
  revokeAllRefreshSessions: (userId: string) => Promise<unknown>;
};
