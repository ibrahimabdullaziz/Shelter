import { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import ApiError from "../utils/ApiError";
import config from "../../config/env";

function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let message = "Internal Server Error";
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof MulterError) {
    statusCode = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "File too large. Max size is 5MB"
        : err.message;
  }

  if (config.nodeEnv === "production" && statusCode >= 500) {
    message = "Internal Server Error";
  }

  const logFields = {
    requestId: req.id,
    statusCode,
    errorName: err instanceof Error ? err.name : "UnknownError",
    ...(config.nodeEnv === "production"
      ? {}
      : { errorMessage: err instanceof Error ? err.message : "Unknown error" }),
  };

  if (statusCode < 500) {
    req.log.warn(logFields, "Request rejected");
  } else {
    req.log.error(logFields, "Request failed");
  }

  return res.status(statusCode).json({ success: false, message });
}
export default errorHandler;
