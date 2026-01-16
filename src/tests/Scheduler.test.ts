import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Scheduler } from "../Scheduler";
import { Clock } from "../types/task.types";

describe("Scheduler", () => {
  let mockClock: Clock;

  beforeEach(() => {
    mockClock = { now: jest.fn(() => new Date()) };
  });

  describe("construction", () => {
    it("should create a Scheduler instance", () => {
      const scheduler = new Scheduler(mockClock);
      expect(scheduler).toBeInstanceOf(Scheduler);
      expect(scheduler.getTasks().size).toBe(0);
    })

    it("should not create a Scheduler instance", () => {
      expect(() => new Scheduler(null as unknown as Clock)).toThrow();
    })

    it("should return an empty task list", () => {
      const scheduler = new Scheduler(mockClock);
      expect(scheduler.getTasks()).not.toBeNull();
      expect(scheduler.getTasks().size).toBe(0);
    })
  });

  describe("task listing", () => {
    it("should set and get tasks in init", () => {
      const scheduler = new Scheduler(mockClock);
      const schedulerTasks = scheduler.getTasks();
      expect(schedulerTasks.size).toBe(0);
    });

    it("should return an array of tasks", () => {
      const scheduler = new Scheduler(mockClock);
      const callback1 = jest.fn<() => void>();
      const callback2 = jest.fn<() => void>();
      const callback3 = jest.fn<() => void>();

      scheduler.setTask("task1", "0 0 * * *", callback1);
      scheduler.setTask("task2", "0 * * * *", callback2);
      scheduler.setTask("task3", "*/15 * * * *", callback3);

      const schedulerTasks = scheduler.getTasks();
      expect(schedulerTasks.size).toBe(3);
      expect(schedulerTasks.get("task1")!.getName()).toBe("task1");
      expect(schedulerTasks.get("task2")!.getName()).toBe("task2");
      expect(schedulerTasks.get("task3")!.getName()).toBe("task3");
    })
  });

  describe("task set/update", () => {
    it("should return an error when Clock is null", () => {
      expect(() => new Scheduler(null as unknown as Clock)).toThrow();
    })

    it("should add a task", () => {
      const scheduler = new Scheduler(mockClock);
      const callback = jest.fn<() => void>();
      expect(() => scheduler.setTask("backup", "* * 12 1/1 * ? *", callback)).not.toThrow();

      const tasks = scheduler.getTasks();
      expect(tasks.size).toBe(1);
      expect(tasks.get("backup")!.getName()).toBe("backup");
      expect(tasks.get("backup")!.getPeriodicity()).toBe("* * 12 1/1 * ? *");
      expect(() => tasks.get("backup")!.getCallback()()).not.toThrow();
    })

    it('should retrive error when adding a task with existing name', () => {
      const scheduler = new Scheduler(mockClock);
      const callback1 = jest.fn<() => void>();
      const callback2 = jest.fn<() => void>();

      scheduler.setTask("backup", "* * 12 1/1 * ? *", callback1);
      expect(() => scheduler.setTask("backup", "* * 12 1/1 * ? *", callback2)).toThrow();

      const tasks = scheduler.getTasks();
      expect(tasks.size).toBe(1);
      expect(tasks.get("backup")!.getName()).toBe("backup");
      expect(tasks.get("backup")!.getPeriodicity()).toBe("* * 12 1/1 * ? *");
      expect(tasks.get("backup")!.getCallback()).toBe(callback1);
    })

    it("should update a task", () => {
      const scheduler = new Scheduler(mockClock);
      const callback1 = jest.fn<() => void>();
      const callback2 = jest.fn<() => void>();

      scheduler.setTask("backup", "* * 12 1/1 * ? *", callback1);

      let tasks = scheduler.getTasks();
      expect(tasks.size).toBe(1);
      expect(tasks.get("backup")!.getPeriodicity()).toBe("* * 12 1/1 * ? *");

      scheduler.updateTask("backup", "* * 12 1/2 * ? *", callback2);
      tasks = scheduler.getTasks();

      expect(tasks.size).toBe(1);
      expect(tasks.get("backup")!.getName()).toBe("backup");
      expect(tasks.get("backup")!.getPeriodicity()).toBe("* * 12 1/2 * ? *");
      expect(tasks.get("backup")!.getCallback()).toBe(callback2);
    })

    it("should throw an error if parameter is null", () => {
      const scheduler = new Scheduler(mockClock);
      const callback = jest.fn<() => void>();

      expect(() => scheduler.setTask(null as any, "* * 12 1/1 * ? *", callback)).toThrow();
      expect(() => scheduler.setTask("backup", null as any, callback)).toThrow();
      expect(() => scheduler.setTask("backup", "* * 12 1/1 * ? *", null as any)).toThrow();
    })
  });

  describe("task removal", () => {
    it("should remove a task", () => {
      const scheduler = new Scheduler(mockClock);
      const callback = jest.fn<() => void>();

      scheduler.setTask("backup", "* * 12 1/1 * ? *", callback);
      let tasks = scheduler.getTasks();
      expect(tasks.size).toBe(1);

      scheduler.removeTask("backup");
      tasks = scheduler.getTasks();
      expect(tasks.size).toBe(0);
    })
  });
});
