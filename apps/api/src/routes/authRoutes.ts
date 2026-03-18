import { Router } from "express";

import { loginHandler, registerHandler } from "../controllers/authController.js";
import { validateBody } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../schemas/authSchemas.js";

export const authRouter = Router();

authRouter.post("/register", validateBody(registerSchema), registerHandler);
authRouter.post("/login", validateBody(loginSchema), loginHandler);
