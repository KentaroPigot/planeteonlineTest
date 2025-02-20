import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
} from "sequelize";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import sequelize from "../../config/database";
import { addUserHooks } from "./User.hooks";
import Task from "../Task/Task.model";
import { calculateDuration } from "../../utils/timeUtils";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare firstname: string;
  declare email: string;
  declare password: string;
  declare passwordConfirm?: string; // Temporaire
  declare passwordChangedAt: CreationOptional<Date>;
  declare passwordResetToken: CreationOptional<string>;
  declare passwordResetExpires: CreationOptional<Date>;
  declare role: CreationOptional<"ROLE_USER" | "ROLE_MANAGER">;
  declare refreshToken: CreationOptional<string>;
  declare active: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getTasks: HasManyGetAssociationsMixin<Task>;

  async correctPassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  changedPasswordAfter(JWTTimestamp: number): boolean {
    if (this.passwordChangedAt) {
      const changedTimestamp = Math.floor(
        this.passwordChangedAt.getTime() / 1000
      );
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  }

  createPasswordResetToken(): string {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    return resetToken;
  }

  async calculateDailyWorkload(): Promise<number> {
    const tasks = (await this.getTasks()) as Task[];
    return tasks.reduce((total: number, task: Task) => {
      const duration = calculateDuration(task.startTime, task.endTime);
      return total + duration;
    }, 0);
  }

  toJSON() {
    const values = { ...this.get() };
    const {
      password,
      refreshToken,
      passwordResetToken,
      passwordResetExpires,
      passwordChangedAt,
      ...safeValues
    } = values;
    return safeValues;
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Name requis" },
        notEmpty: { msg: "Name ne peut pas être vide" },
      },
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Firstname requis" },
        notEmpty: { msg: "Firstname ne peut pas êtrevide" },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        name: "unique_email",
        msg: "Cette adresse email est déjà utilisée",
      },
      allowNull: false,
      validate: {
        isEmail: { msg: "Veuillez fournir un adresse email" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 32],
          msg: "Password doît être entre 8-32 characters de long",
        },
      },
    },
    passwordConfirm: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        isConfirmed(value: string) {
          if (value !== this.password) {
            throw new Error("Les password ne concordent pas");
          }
        },
      },
    },
    passwordChangedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
    role: {
      type: DataTypes.ENUM("ROLE_USER", "ROLE_MANAGER"),
      defaultValue: "ROLE_MANAGER",
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    refreshToken: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    defaultScope: {
      attributes: {
        exclude: ["passwordResetToken", "passwordResetExpires"],
      },
    },
  }
);

addUserHooks(User);

export default User;
