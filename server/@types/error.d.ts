import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode: number;
  status: string;
  isOperational?: boolean;
}
