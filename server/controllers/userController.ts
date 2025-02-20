import handlerFactory from "./handlerFactory";
import { Request, Response, NextFunction } from "express";
import { User, Task } from "../models";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { AuthenticatedRequest } from "../@types/global";

const filterObj = (
  obj: { [key: string]: any },
  ...allowedFields: string[]
): { [key: string]: any } => {
  const newObj: { [key: string]: any } = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

const getMe = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
};

const updateMe = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Créer une erreur si l'utilisateur envoie des données de mot de passe
    if (req.body.password || req.body.passwordConfirm || !req.user) {
      return next(
        new AppError(
          "Cette route n'est pas destinée à la mise à jour du mot de passe. Veuillez utiliser /updateMyPassword.",
          400
        )
      );
    }

    // Filtre les champs non autorisés pour la mise à jour
    const filteredBody = filterObj(req.body, "name", "email");
    if (req.file) filteredBody.photo = req.file.filename;

    // met à jour l'utilisateur dans la base de données
    const updatedUser = await User.update(filteredBody, {
      where: { id: req.user.id },
    });

    if (!updatedUser) {
      return next(
        new AppError("Impossible de mettre à jour l'utilisateur", 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  }
);

const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await User.update(
      { active: false },
      { where: { id: req.user.id } }
    );

    if (!result) {
      return next(new AppError("Utilisateur introuvable", 404));
    }

    res.status(204).json({ status: "success", data: null });
  }
);

const getAllUsers = handlerFactory.getAll(User, {
  include: [
    {
      model: Task,
      as: "tasks",
      attributes: ["id", "duration"],
    },
  ],
});
const getUser = handlerFactory.getOne(User);
const updateUser = handlerFactory.updateOne(User);
const deleteUser = handlerFactory.deleteOne(User);

const getTasksByUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tasks = await Task.findAll({
      where: { assignedTo: req.params.id },
    });

    if (!tasks) {
      return next(new AppError("Taches introuvables", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        tasks,
      },
    });
  }
);

export default {
  getMe,
  updateMe,
  deleteMe,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getTasksByUser,
};
