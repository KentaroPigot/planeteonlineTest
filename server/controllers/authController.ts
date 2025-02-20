import { User } from "../models";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import tokenUtils from "../utils/tokenUtils";

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, firstname, email, password, passwordConfirm } = req.body;

    if (!name || !firstname || !email || !password || !passwordConfirm) {
      return next(new AppError("Veuillez fournir tous les champs requis", 400));
    }

    const newUser = await User.create({
      name,
      firstname,
      email,
      password,
      passwordConfirm,
    });

    tokenUtils.createSendToken(newUser, res);
  }
);

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: { email: string; password: string } = req.body;

    if (!email || !password) {
      return next(
        new AppError("Veuillez fournir un email et un mot de passe", 400)
      );
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.correctPassword(password))) {
      return next(new AppError("Email ou mot de passe incorrect", 401));
    }

    tokenUtils.createSendToken(user, res);
  }
);

const logout = (req: Request, res: Response) => {
  res.cookie("auth_token", "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.cookie("refresh_token", "loggedOut", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ status: "success" });
};

export default {
  signup,
  login,
  logout,
};
