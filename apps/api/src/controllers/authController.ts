import type { Request, Response } from "express";

import { login, register } from "../services/authService.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const registerHandler = asyncHandler(async (req: Request, res: Response) => {
  const response = await register(req.body);
  res.status(201).json(response);
});

export const loginHandler = asyncHandler(async (req: Request, res: Response) => {
  const response = await login(req.body);
  res.status(200).json(response);
});
