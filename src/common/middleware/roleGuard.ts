import { Role } from "@prisma/client";

import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";

export const roleGuard = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      req.log?.warn(
        {
          event: "authorization_failure",
          userId: req.user?.id,
          actualRole: req.user?.role,
          requiredRoles: allowedRoles,
        },
        "Authorization failed",
      );
      throw new ApiError(
        403,
        "Access Denied: you can`t open this page due to authorization reasons",
      );
    }

    next();
  };
};
