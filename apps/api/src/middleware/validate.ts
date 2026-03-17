import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

import { HttpError } from "../utils/httpError.js";

export function validateBody<TSchema extends ZodTypeAny>(schema: TSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsedBody = schema.safeParse(req.body);

    if (!parsedBody.success) {
      const issue = parsedBody.error.issues[0];
      next(new HttpError(400, issue?.message ?? "Invalid request body"));
      return;
    }

    req.body = parsedBody.data;
    next();
  };
}
