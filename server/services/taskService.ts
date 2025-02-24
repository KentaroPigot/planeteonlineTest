import { Task, User } from "../models";
import { Op } from "sequelize";

class TaskService {
  private task!: Task | null;
  private user!: User | null;

  constructor(taskId: string) {
    this.init(taskId);
  }

  private async init(taskId: string) {
    const task = await Task.findByPk<Task>(taskId);
    if (!task) throw new Error("Tache introuvable");
    this.task = task;
    return this;
  }

  public async updateAssignment(userId: string) {
    this.user = await User.findByPk(userId, { include: ["tasks"] });
    if (!this.user) throw new Error("Pas d'utilisateur avec cet Id");

    // Si la tache a déjà un autre user, throw error
    if (this.task!.assignedTo && this.task!.assignedTo !== this.user.id) {
      throw new Error("La tâche a déjà un autre user");
    }

    // Check si a tache est déjà assigné ou pas.
    const action = this.task!.assignedTo ? "unassigned" : "assigned";
    this.task!.assignedTo ? await this.unassignTask() : await this.assignTask();

    return { updatedTask: this.task, action };
  }

  private async assignTask() {
    // Vérifier si la tâche overlay les taches existentes du user
    if (await this.isTaskOverlapping())
      throw new Error("Il y a déjà une tâche sur ce créneau");
    // Vérifier si le total dépasse les 8h de boulot
    if ((await this.user!.calculateDailyWorkload()) + this.task!.duration > 8)
      throw new Error("Worload dépasse 8 heures.");

    this.task!.assignedTo = this.user!.id;
    await this.task!.save();
  }

  // Désassigner une tâche d'un utilisateur
  private async unassignTask() {
    this.task!.assignedTo = null;
    await this.task!.save();
  }

  // Vérifie si une tâche chevauche une autre
  async isTaskOverlapping() {
    const overlappingTasks = await Task.findAll({
      where: {
        assignedTo: this.user!.id,
        [Op.or]: [
          {
            startTime: { [Op.lt]: this.task?.endTime },
            endTime: { [Op.gt]: this.task?.startTime },
          },
          {
            startTime: { [Op.gt]: this.task?.endTime },
            endTime: { [Op.lt]: this.task?.startTime },
          },
        ],
      },
    });

    return overlappingTasks.length > 0;
  }
}

export default TaskService;
