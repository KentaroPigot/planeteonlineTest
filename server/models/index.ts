import User from "./User/User.model";
import Task from "./Task/Task.model";

// Initialise les modèles et leurs relations
const setupRelations = () => {
  // Relation de User à Task
  User.hasMany(Task, {
    as: "tasks",
    foreignKey: "assignedTo",
    onDelete: "CASCADE",
  });

  // Relation de Task à User
  Task.belongsTo(User, {
    as: "assignedUser",
    foreignKey: "assignedTo",
  });
};

export { User, Task, setupRelations };
