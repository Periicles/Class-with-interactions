import { describe, it, expect } from "@jest/globals";
import { Scheduler } from "../Scheduler";
import { Task } from "../types/task.types";

describe("Scheduler", () => {
  it("should create a Scheduler instance", () => {
    const scheduler = new Scheduler([]);
    expect(scheduler).toBeInstanceOf(Scheduler);
    expect(scheduler.getTasks()).toEqual([]);
  })

  it("should not create a Scheduler instance", () => {
    expect(() => new Scheduler(null as unknown as Task[])).toThrow();
  })

  it("should return an empty task list", () => {
    const scheduler = new Scheduler([]);
    expect(scheduler.getTasks()).not.toBeNull();
    expect(scheduler.getTasks()).toHaveLength(0);
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

  it("should return an error when have missing task properties", () => {
    const tasks: any[] = [
      {
        name: "task1",
        callback: () => { console.log("Task 1 executed"); }
      },
      {
        periodicity: {},
        callback: () => { console.log("Task 2 executed"); }
      },
      {
        name: "task3",
        periodicity: {}
      }
    ]

    expect(() => new Scheduler(tasks)).toThrow();
  })

  it("should add a task", () => {
    const mockClock = { now: jest.fn(() => new Date()) };
    const scheduler = new Scheduler(mockClock);
    const callback = jest.fn();
    scheduler.setTask("backup", "* * 12 1/1 * ? *", callback);
    const tasks = scheduler.getTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].name).toBe("backup");
    expect(tasks[0].periodicity).toBe("* * 12 1/1 * ? *");
    expect(() => tasks[0].callback()).not.toThrow();
  })
})