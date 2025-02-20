import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
// import xss from "xss";
import hpp from "hpp";

import userRouter from "./routes/userRoutes";
import taskRouter from "./routes/taskRoutes";
import AppError from "./utils/appError";
import errorController from "./controllers/errorController";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddleware(): void {
    // Sécurisation des en-têtes HTTP
    this.app.use(helmet());

    const corsOptions = {
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      origin: process.env.CLIENT_URL,
    };
    this.app.use(cors(corsOptions));

    // Limite les requêtes pour éviter les attaques DOS
    const limiter = rateLimit({
      max: 1000,
      windowMs: 60 * 60 * 1000,
      message: "Trop de requêtes pour cet IP, réessayez plus tard",
    });
    this.app.use("/api", limiter);

    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(hpp());
  }

  private configureRoutes(): void {
    this.app.use("/api/v1/tasks", taskRouter);
    this.app.use("/api/v1/users", userRouter);
  }

  private configureErrorHandling(): void {
    this.app.use("*", (req, res, next) => {
      next(new AppError(`${req.originalUrl} n'existe pas sur ce server!`, 404));
    });

    this.app.use(errorController);
  }
}

export default new App().app;
