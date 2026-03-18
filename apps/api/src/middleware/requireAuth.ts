import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/httpError.js";
import { verifyAuthToken } from "../utils/token.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next(new HttpError(401, "Authorization header is required"));
    return;
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    next(new HttpError(401, "Invalid authorization format"));
    return;
  }

  try {
    const payload = verifyAuthToken(token);
    req.auth = {
      userId: payload.userId,
      email: payload.email
    };
    next();
  } catch (_error) {
    next(new HttpError(401, "Invalid or expired token"));
  }
}
