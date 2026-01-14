import { Task } from "./types/task.types";

export class Scheduler {
  constructor(
    private tasks: Task[]
  ) { }

  getTasks(): Task[] {
    return this.tasks;
  }
}