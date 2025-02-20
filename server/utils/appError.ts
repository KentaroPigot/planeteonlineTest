class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public name: string;

  constructor(message: string, statusCode: number, errorName?: string) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    this.name = errorName || "AppError";

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
