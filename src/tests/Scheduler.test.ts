import { describe, it, expect } from "@jest/globals";
import { Scheduler } from "../Scheduler";
import { Task } from "../types/task.types";
describe("Scheduler", () => {
  it("should create a Scheduler instance", () => {
    const scheduler = new Scheduler([]);
    expect(scheduler).toBeInstanceOf(Scheduler);
  })

  it("should set and get tasks in init", () => {
    const tasks: Task[] = []
    const scheduler = new Scheduler(tasks);
    const schedulerTasks = scheduler.getTasks();
    expect(schedulerTasks).toEqual(tasks);
  });

  it("should return an array of tasks", () => {
    const tasks: Task[] = [
      {
        name: "task1",
        periodicity: {},
        callback: () => { console.log("Task 1 executed"); }
      },
      {
        name: "task2",
        periodicity: {},
        callback: () => { console.log("Task 2 executed"); }
      },
      {
        name: "task3",
        periodicity: {},
        callback: () => { console.log("Task 3 executed"); }
      }
    ]

    const scheduler = new Scheduler(tasks);
    const schedulerTasks = scheduler.getTasks();
    expect(schedulerTasks).toEqual(tasks);
  })
})