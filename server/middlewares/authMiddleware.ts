import { Request, Response, NextFunction } from "express";
import { User } from "../models";
import AppError from "../utils/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import tokenUtils from "../utils/tokenUtils";

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.cookies.auth_token;

    if (!accessToken) {
      throw new AppError("Veuillez vous connecter", 401);
    }

    try {
      return await handleTokenVerif(accessToken, req, res, next);
    } catch (err: any) {
      return await handleError(err, req, res, next);
    }
  }
);

const handleTokenVerif = async (
  token: string,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const decoded: JwtPayload = await tokenUtils.verifyToken(token);
  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    throw new AppError(
      "L'utilisateur a qui appartient ce token n'existe plus",
      401
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat!)) {
    throw new AppError("Mot de passe changé récemment. Reconnectez vous", 401);
  }

  req.user = currentUser;
  return next();
};

const handleError = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err.name !== "TokenExpiredError") return next(err);
  try {
    return await refreshAccessToken(req, res, next);
  } catch (err: any) {
    if (err.name === "JsonWebTokenError")
      return next(
        new AppError("Refresh Token invalide. Veuillez vous reconnecter", 401)
      );
    return next(err);
  }
};

const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    throw new AppError("Refresh token non défini. Connectez vous", 401);
  }

  const decoded = await tokenUtils.verifyToken(refreshToken);
  const user = await User.findByPk(decoded.id);

  if (!user) {
    throw new AppError("Utilisateur introuvable", 404);
  }

  const { dataValues: userData } = user;

  if (userData.refreshToken !== refreshToken) {
    throw new AppError("Refresh token invalide", 401);
  }

  const id = decoded.id.toString();
  const expiresIn = process.env.JWT_EXPIRES_IN as string;
  const newAccessToken = jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn,
  });

  const accessCookieExpires =
    parseInt(process.env.JWT_COOKIE_EXPIRES_IN as string) * 1000;

  res.cookie("auth_token", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(Date.now() + accessCookieExpires),
  });

  req.user = userData;
  return next();
};
