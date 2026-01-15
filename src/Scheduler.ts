import { Task } from "./Task";
import { Clock } from "./types/task.types";

export class Scheduler {
  private readonly clock: Clock;
  private readonly tasks: Map<string, Task>;

  constructor(clock: Clock) {
    if (!clock) {
      throw new Error("Clock cannot be null or undefined");
    }
    this.clock = clock;
    this.tasks = new Map();
  }

  /**
   * Function that returns the map of tasks
   *
   * @return map of tasks indexed by name
   */
  getTasks(): Map<string, Task> {
    return this.tasks;
  }

  /**
   * Function that adds or updates a task in the scheduler
   *
   * @param name - name of the task
   * @param periodicity - cron expression for periodicity
   * @param callback - callback function to execute
   */
  setTask(
    name: string,
    periodicity: string,
    callback: () => void | Promise<void>
  ): void {
    const task = new Task(name, periodicity, callback);
    this.tasks.set(name, task);
  }
}
