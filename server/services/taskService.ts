import { Task, User } from "../models";
import { Op } from "sequelize";

class TaskService {
  static async updateAssignment(taskId: number, userId: number) {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error("Tâche introuvable");
    }

    if (task.assignedTo) {
      if (task.assignedTo !== userId) {
        throw new Error(
          "Tâche déjà assignée à un utilisateur. Désassignez la d'abord"
        );
      }

      const updatedTask = await TaskService.unassignTask(taskId);
      return { updatedTask, action: "unassign" };
    } else {
      const updatedTask = await TaskService.assignTask(taskId, userId);
      return { updatedTask, action: "assign" };
    }
  }

  static async assignTask(taskId: number, userId: number) {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error("Tâche introuvable");
    }

    // Vérifier les chevauchements de tâches
    const hasOverlap = await TaskService.checkTaskOverlap(
      userId,
      task.startTime,
      task.endTime
    );
    if (hasOverlap) {
      throw new Error("L'utilisateur a déjà une tâche sur ce creneau");
    }

    // Vérifier si la charge de travail dépasse 8 heures
    const newTaskDuration = task.duration; // Récupérer la durée
    // console.log(newTaskDuration);
    const exceedsWorkload = await TaskService.checkDailyWorkload(
      userId,
      newTaskDuration
    );
    if (exceedsWorkload) {
      throw new Error(
        "La charge de travail journalière d'un utilisateur ne peut pas dépasser 8 heures"
      );
    }

    task.assignedTo = userId; // Assigner la tâche
    await task.save();
    return task;
  }

  // Désassigner une tâche d'un utilisateur
  static async unassignTask(taskId: number) {
    const task = await Task.findByPk(taskId);
    if (!task) {
      throw new Error("Tâche introuvable");
    }

    task.assignedTo = null;
    await task.save();
    return task;
  }

  // Vérifie si une tâche chevauche une autre
  static async checkTaskOverlap(
    userId: number,
    startTime: Date,
    endTime: Date
  ) {
    const overlappingTasks = await Task.findAll({
      where: {
        assignedTo: userId,
        [Op.or]: [
          {
            startTime: { [Op.lt]: endTime },
            endTime: { [Op.gt]: startTime },
          },
          {
            startTime: { [Op.gt]: startTime },
            endTime: { [Op.lt]: endTime },
          },
        ],
      },
    });

    return overlappingTasks.length > 0;
  }

  // Vérifie si la charge de travail d'un utilisateur dépasse 8 heures
  static async checkDailyWorkload(userId: number, newTaskDuration: number) {
    const user = await User.findByPk(userId, { include: ["tasks"] });
    if (!user) {
      throw new Error("Utilisateur introuvable");
    }

    const dailyWorkload = await user.calculateDailyWorkload(); // Charge quotidienne existante
    // console.log(dailyWorkload);
    return dailyWorkload + newTaskDuration > 8; // Vérifie si ça dépasse 8h
  }
}

export default TaskService;
