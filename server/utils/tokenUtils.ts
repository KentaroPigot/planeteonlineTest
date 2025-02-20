import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models";
import { Response } from "express";
import AppError from "./appError";

// console.log(process.env.JWT_SECRET);

// Vérifie que JWT_SECRET est bien défini
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

const signToken = (id: number, expiresIn: string): string => {
  if (!expiresIn) {
    throw new Error("Expiration time is required for signing the token.");
  }

  const secret = process.env.JWT_SECRET;
  if (typeof secret !== "string") {
    throw new Error("JWT_SECRET must be a string.");
  }

  return jwt.sign({ id }, secret, { expiresIn });
};

const setCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  // Vérification et conversion des durées d'expiration
  const accessCookieExpires =
    parseInt(process.env.JWT_COOKIE_EXPIRES_IN ?? "3600", 10) * 1000;
  const refreshCookieExpires =
    parseInt(process.env.JWT_REFRESH_COOKIE_EXPIRES_IN ?? "3600", 10) * 1000;

  // Défini les cookies
  res.cookie("auth_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(Date.now() + accessCookieExpires),
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(Date.now() + refreshCookieExpires),
  });
};

// Créer et envoie les tokens
const createSendToken = async (user: User, res: Response, statusCode = 200) => {
  // Vérification que JWT_EXPIRES_IN est bien défini
  const accessTokenExpiresIn = process.env.JWT_EXPIRES_IN ?? "3600"; // Valeur par défaut (en secondes)
  const refreshTokenExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ?? "3600"; // Valeur par défaut (en secondes)

  const accessToken = signToken(user.id, accessTokenExpiresIn);
  let refreshToken = user.refreshToken;

  // Vérification ou régénération du refresh token
  if (!refreshToken || !(await verifyToken(refreshToken))) {
    refreshToken = signToken(user.id, refreshTokenExpiresIn);
    user.refreshToken = refreshToken;
    await user.save();
  }

  setCookies(res, accessToken, refreshToken);

  res.status(statusCode).json({
    status: "success",
    token: accessToken,
    data: {
      user,
    },
  });
};

// Fonction pour vérifier le token
const verifyToken = async (token: string) => {
  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT_SECRET is not defined", 500);
  }
  try {
    const decoded: JwtPayload = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
        if (err || !decoded) {
          return reject(jwtErrorType(err));
        }
        resolve(decoded as JwtPayload);
      });
    });

    return decoded;
  } catch (err) {
    throw err;
  }
};

const jwtErrorType = (err: any) => {
  switch (err.name) {
    case "TokenExpiredError":
      return new AppError("Le token a expiré", 401, err.name);
    case "JsonWebTokenError":
      return new AppError("Token invalide", 401, err.name);
    default:
      return new AppError(
        "Erreur authentification. Veuillez vous reconnecter",
        401
      );
  }
};

export default {
  signToken,
  setCookies,
  verifyToken,
  createSendToken,
};
