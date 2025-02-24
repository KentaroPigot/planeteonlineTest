import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import sequelize from "../../config/database";
import { addTaskHooks } from "./Task.hooks";
import User from "../User/User.model";

class Task extends Model<InferAttributes<Task>, InferCreationAttributes<Task>> {
  declare id: CreationOptional<number>;
  declare libelle: string;
  declare startTime: Date;
  declare endTime: Date;
  declare duration: number;
  declare assignedTo: ForeignKey<User["id"]> | null;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    libelle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Une tâche doit avoir un libelle",
        },
      },
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isValidTime(value: string) {
          const startDate = new Date(value);
          const hours = startDate.getUTCHours();
          if (hours < 8 || hours >= 18) {
            throw new Error("Une tâche doit commencer entre 08:00 et 17:59");
          }
        },
      },
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterStart(value: string) {
          if (new Date(value) <= new Date(this.startTime as Date)) {
            throw new Error("La fin d'une tâche doit être après son début");
          }
        },
        isValidEndTime(value: string) {
          const endDate = new Date(value);
          const hours = endDate.getUTCHours();
          const minutes = endDate.getUTCMinutes();
          if (hours < 8 || (hours === 18 && minutes > 0) || hours > 18) {
            throw new Error(
              "La fin d'une tâche doit être entre 08:00 et 18:00"
            );
          }
        },
      },
    },
    duration: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    assignedTo: {
      type: DataTypes.INTEGER.UNSIGNED, // ID de l'utilisateur
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    modelName: "Task",
  }
);

addTaskHooks(Task);

export default Task;
