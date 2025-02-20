import { calculateDuration } from "../../utils/timeUtils";
import Task from "./Task.model";

export function addTaskHooks(TaskModel: typeof Task) {
  // Calcule la valeur de task Duration et l'ajoute à l'objet
  TaskModel.addHook("beforeValidate", async (task: any) => {
    task.duration = await calculateDuration(task.startTime, task.endTime);
  });
}
