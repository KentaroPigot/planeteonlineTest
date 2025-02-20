import { Request, Response, NextFunction } from "express";

import { Task, User } from "../models";
import TaskService from "../services/taskService";
import handlerFactory from "./handlerFactory";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";

const getAllTasks = handlerFactory.getAll(Task, {
  include: [
    {
      model: User,
      as: "assignedUser",
      attributes: ["firstname", "id"],
    },
  ],
});
const createTask = handlerFactory.createOne(Task);
const updateTask = handlerFactory.updateOne(Task);
const getTask = handlerFactory.getOne(Task);
const deleteTask = handlerFactory.deleteOne(Task);

const updateTaskAssignment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: taskId, userId } = req.params;

    try {
      const { updatedTask, action } = await TaskService.updateAssignment(
        Number(taskId),
        Number(userId)
      );
      res.status(200).json({
        status: "success",
        action, // "assign" ou "unassign" selon l'action effectuée
        data: { task: updatedTask },
      });
    } catch (error: any) {
      return next(new AppError(error.message, 400));
    }
  }
);

export default {
  getAllTasks,
  createTask,
  updateTask,
  getTask,
  deleteTask,
  updateTaskAssignment,
};
