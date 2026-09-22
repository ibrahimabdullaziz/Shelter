import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";
import { verifyAccessToken } from "../utils/jwt";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    req.log?.warn({ event: "authentication_failure", reason: "missing_token" }, "Authentication failed");
    throw new ApiError(401, "Access Denied: No Token Provided");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    req.log?.warn({ event: "authentication_failure", reason: "missing_token" }, "Authentication failed");
    throw new ApiError(401, "Access Denied: No Token Provided");
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.id,
      role: payload.role as NonNullable<typeof req.user>["role"],
    };
  } catch (err) {
    req.log?.warn({ event: "authentication_failure", reason: "invalid_token" }, "Authentication failed");
    throw new ApiError(401, "Access Denied: No Token Provided");
  }

  next();
};
