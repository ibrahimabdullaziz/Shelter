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
    update: (args: unknown) => Promise<AuthUserRecord | null>;
  };
};
