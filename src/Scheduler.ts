import { Task, Clock } from "./types/task.types";

export class Scheduler {
  private tasks: Task[] = [];

  constructor(
    private clock: Clock
  ) {
    if (!clock) {
      throw new Error("Clock cannot be null or undefined");
    }
  }

  setTask(name: string, periodicity: string, callback: () => void | Promise<void>): void {
    const existingIndex = this.tasks.findIndex(task => task.name === name);
    
    if (existingIndex !== -1) {
      this.tasks[existingIndex] = { name, periodicity, callback };
    } else {
      this.tasks.push({ name, periodicity, callback });
    }
  }

  getTasks(): Task[] {
    return this.tasks;
  }
}