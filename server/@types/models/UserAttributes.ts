import { Optional } from "sequelize";

export interface UserAttributes {
  id: number;
  name: string;
  firstname: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role: "ROLE_USER" | "ROLE_MANAGER";
  refreshToken?: string;
}

export interface UserCreationAttributes
  extends Optional<
    UserAttributes,
    | "id"
    | "passwordChangedAt"
    | "passwordResetToken"
    | "passwordResetExpires"
    | "refreshToken"
  > {}
