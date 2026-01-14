import { describe, it, expect, beforeEach } from "@jest/globals";
import { Scheduler } from "../Scheduler";
import { Clock } from "../types/task.types";

describe("Scheduler", () => {
  let mockClock: Clock;

  beforeEach(() => {
    mockClock = { now: jest.fn(() => new Date()) };
  });

  it("should create a Scheduler instance", () => {
    const scheduler = new Scheduler(mockClock);
    expect(scheduler).toBeInstanceOf(Scheduler);
    expect(scheduler.getTasks()).toEqual([]);
  })

  it("should not create a Scheduler instance", () => {
    expect(() => new Scheduler(null as unknown as Clock)).toThrow();
  })

  it("should return an empty task list", () => {
    const scheduler = new Scheduler(mockClock);
    expect(scheduler.getTasks()).not.toBeNull();
    expect(scheduler.getTasks()).toHaveLength(0);
  })

  it("should set and get tasks in init", () => {
    const scheduler = new Scheduler(mockClock);
    const schedulerTasks = scheduler.getTasks();
    expect(schedulerTasks).toEqual([]);
  });

  it("should return an array of tasks", () => {
    const scheduler = new Scheduler(mockClock);
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();

    scheduler.setTask("task1", "0 0 * * *", callback1);
    scheduler.setTask("task2", "0 * * * *", callback2);
    scheduler.setTask("task3", "*/15 * * * *", callback3);

    const schedulerTasks = scheduler.getTasks();
    expect(schedulerTasks).toHaveLength(3);
    expect(schedulerTasks[0].name).toBe("task1");
    expect(schedulerTasks[1].name).toBe("task2");
    expect(schedulerTasks[2].name).toBe("task3");
  })

  it("should return an error when Clock is null", () => {
    expect(() => new Scheduler(null as unknown as Clock)).toThrow();
  })

  it("should add a task", () => {
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