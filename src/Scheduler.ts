import { Task } from "./types/task.types";

export class Scheduler {
  constructor(
    private tasks: Task[]
  ) {
    for (const task of tasks) {
      if (!task.name || !task.periodicity || !task.callback) {
        throw new Error("Each task must have name, periodicity and callback properties.");
      }
    }
  }

  getTasks(): Task[] {
    return this.tasks;
  }
}