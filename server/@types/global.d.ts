// @types/express/index.d.ts
import { Request } from "express";
import { User } from "../models";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Ou un type spécifique pour `user`, comme `User` ou autre
    }
  }
}

interface AuthenticatedRequest extends Request {
  user?: User; // Ou un type spécifique pour `user`, comme `User` ou autre
  file?: any;
}
