import { User } from "../models";
import { Response, Request, NextFunction } from "express";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";

const restrictTo = (role: User["role"]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      return next(
        new AppError("Vous n'avez pas les privileges pour cette route", 401)
      );
    }
    next();
  });

export default restrictTo;
