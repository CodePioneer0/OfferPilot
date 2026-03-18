import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

export interface AuthTokenPayload {
  userId: number;
  email: string;
}

const TOKEN_TTL = "7d";

export function issueAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}
