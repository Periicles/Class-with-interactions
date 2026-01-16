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
    if (!name) {
      throw new Error("Task name cannot be null or undefined");
    }
    if (!periodicity) {
      throw new Error("Task periodicity cannot be null or undefined");
    }
    if (!callback) {
      throw new Error("Task callback cannot be null or undefined");
    }
    if (this.tasks.has(name)) {
      throw new Error(`Task with name ${name} already exists`);
    }
    const task = new Task(name, periodicity, callback);
    this.tasks.set(name, task);
  }

  /**
   * Function that updates an existing task in the scheduler
   * @param name - name of the task
   * @param periodicity - new cron expression for periodicity
   * @param callback - new callback function to execute
   */
  updateTask(
    name: string,
    periodicity: string,
    callback: () => void | Promise<void>
  ): void {
    if (!name) {
      throw new Error("Task name cannot be null or undefined");
    }
    if (!periodicity) {
      throw new Error("Task periodicity cannot be null or undefined");
    }
    if (!callback) {
      throw new Error("Task callback cannot be null or undefined");
    }
    if (!this.tasks.has(name)) {
      throw new Error(`Task with name ${name} does not exist`);
    }
    const task = new Task(name, periodicity, callback);
    this.tasks.set(name, task);
  }

  /**
   * Function that removes a task from the scheduler by name
   *
   * @param name - name of the task to remove
   */
  removeTask(name: string): void {
    if (!this.tasks.has(name)) {
      throw new Error(`Task with name ${name} does not exist`);
    }
    this.tasks.delete(name);
  }

  /**
   * Function that executes tasks based on their schedule
   */
  executeTasks(): void {
    const now = this.clock.now();

    this.tasks.forEach((task) => {
      if (task.shouldExecuteAt(now)) {
        try {
          task.getCallback()();
        } catch (error) {
          console.error(
            `Error executing task ${task.getName()}:`,
            (error as Error).message
          );
        }
      }
    })
  }
}
