import { Task } from "./Task";
import { Clock } from "./types/task.types";

export class Scheduler {
  private readonly clock: Clock;
  private readonly tasks: Task[];

  constructor(clock: Clock) {
    if (!clock) {
      throw new Error("Clock cannot be null or undefined");
    }
    this.clock = clock;
    this.tasks = [];
  }

  /**
   * Function that returns the list of tasks
   * @return list of tasks
   */
  getTasks(): Task[] {
    return this.tasks;
  }

  /**
   * Function that adds or updates a task in the scheduler
   * @param name - name of the task
   * @param periodicity - cron expression for periodicity
   * @param callback - callback function to execute
   */
  setTask(
    name: string,
    periodicity: string,
    callback: () => void | Promise<void>
  ): void {
    for (const task of this.tasks) {
      if (task.getName() === name) {
        task.setPeriodicity(periodicity);
        task.setCallback(callback);
        return;
      }
    }
    const newTask = new Task(name, periodicity, callback);
    this.tasks.push(newTask);
  }
}
