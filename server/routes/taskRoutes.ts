import express from "express";
import taskController from "../controllers/taskController";
import { protect } from "../middlewares/authMiddleware";
import restrictTo from "../middlewares/restrictRoute";

const router = express.Router();

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(protect, restrictTo("ROLE_MANAGER"), taskController.createTask);

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(protect, restrictTo("ROLE_MANAGER"), taskController.updateTask)
  .delete(protect, restrictTo("ROLE_MANAGER"), taskController.deleteTask);

router
  .route("/:id/assignment/:userId")
  .patch(
    protect,
    restrictTo("ROLE_MANAGER"),
    taskController.updateTaskAssignment
  );

export default router;
