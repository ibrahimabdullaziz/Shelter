import "dotenv/config";

if (
  !process.env.DATABASE_URL ||
  !process.env.JWT_ACCESS_SECRET ||
  (process.env.NODE_ENV === "production" && !process.env.JWT_REFRESH_SECRET) ||
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET ||
  !process.env.MAIL_USER ||
  !process.env.SENDGRID_API_KEY
) {
  throw new Error("Missing Some Environment Variables. Check Your .env file");
}

if (process.env.NODE_ENV === "production" && !process.env.CORS_ORIGINS) {
  throw new Error("CORS_ORIGINS is required in production");
}

interface AppConfig {
  port: number;
  databaseUrl: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  adminEmail: string;
  adminPassword: string;
  cloudinaryName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
  mailUser: string;
  mailFrom: string;
  sendGridApiKey: string;
  nodeEnv: string;
  corsOrigins: string[];
}

const config: AppConfig = {
  port: parseInt(process.env.PORT as string, 10) || 3000,
  databaseUrl: process.env.DATABASE_URL as string,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,
  adminEmail: process.env.SYSTEM_ADMIN_EMAIL as string,
  adminPassword: process.env.SYSTEM_ADMIN_PASSWORD as string,
  cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME as string,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY as string,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET as string,
  mailUser: process.env.MAIL_USER as string,
  mailFrom: (process.env.MAIL_FROM || process.env.MAIL_USER) as string,
  sendGridApiKey: process.env.SENDGRID_API_KEY as string,
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export default config;
