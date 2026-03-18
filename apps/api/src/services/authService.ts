import type { AuthResponse, LoginPayload, RegisterPayload } from "@offerpilot/shared";

import { findUserByEmail, createUser } from "../repositories/userRepository.js";
import { HttpError } from "../utils/httpError.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { issueAuthToken } from "../utils/token.js";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const email = normalizeEmail(payload.email);
  const existingUser = findUserByEmail(email);

  if (existingUser) {
    throw new HttpError(409, "An account with this email already exists");
  }

  const passwordHash = await hashPassword(payload.password);
  const user = createUser(payload.name.trim(), email, passwordHash);

  const token = issueAuthToken({
    userId: user.id,
    email: user.email
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const email = normalizeEmail(payload.email);
  const user = findUserByEmail(email);

  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const isPasswordValid = await comparePassword(payload.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new HttpError(401, "Invalid email or password");
  }

  const token = issueAuthToken({
    userId: user.id,
    email: user.email
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
}
