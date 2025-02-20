import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

const sendErrorDev = (err: AppError, req: Request, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, req: Request, res: Response) => {
  res.status(err.statusCode).json({
    status: "error",
    message: err.message,
  });
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err?.statusCode || 500;
  err.status = err?.status || "error";

  if (!(err instanceof AppError)) {
    if (err.name === "SequelizeUniqueConstraintError") {
      err = new AppError(err.errors[0].message, 400, err.name);
    } else if (err.name === "SequelizeValidationError") {
      err = new AppError(
        err.errors.map((e: any) => e.message).join(", "),
        400,
        err.name
      );
    } else {
      err = new AppError("Une erreur inconnue est survenue.", 500);
    }
  }

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, req, res);
  }
};
