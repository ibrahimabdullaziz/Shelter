import {
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  verifyEmailSchema,
} from "./auth.validation";
import express from "express";
import { validate } from "../../common/middleware/validate";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  refresh,
  register,
  resetPassword,
  verifyEmail,
} from "./auth.controller";
import { authGuard } from "../../common/middleware/authGuard";
import { verifyEmailService } from "./auth.service";

const authRoutes = express.Router();

authRoutes.post("/register", validate(registerSchema), register);
authRoutes.post("/login", validate(loginSchema), login);
authRoutes.post("/refresh", validate(refreshTokenSchema), refresh);
authRoutes.post("/logout", validate(refreshTokenSchema), logout);
authRoutes.get("/me", authGuard, getMe);

// POST /api/auth/verify-email
// POST /api/auth/forgot-password
// POST /api/auth/reset-password

authRoutes.post("/verify-email", validate(verifyEmailSchema), verifyEmail);

authRoutes.post(
  "/forgot-password",
  validate(forgetPasswordSchema),
  forgotPassword,
);

authRoutes.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPassword,
);

export default authRoutes;
