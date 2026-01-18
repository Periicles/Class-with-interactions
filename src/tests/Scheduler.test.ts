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
      scheduler.setTask("task3", "15 * * * *", callback3);

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
      expect(() => scheduler.setTask("backup", "0 12 * * *", callback)).not.toThrow();

      const tasks = scheduler.getTasks();
      expect(tasks.size).toBe(1);
      expect(tasks.get("backup")!.getName()).toBe("backup");
      expect(tasks.get("backup")!.getPeriodicity()).toBe("0 12 * * *");
      expect(() => tasks.get("backup")!.getCallback()()).not.toThrow();
    })

    it('should modify task when setting with same name', () => {
      const scheduler = new Scheduler(mockClock);
      const callback1 = jest.fn<() => void>();
      const callback2 = jest.fn<() => void>();

      scheduler.setTask("backup", "0 12 * * *", callback1);
      
      const tasks = scheduler.getTasks();
      expect(tasks.size).toBe(1);
      expect(tasks.get("backup")!.getPeriodicity()).toBe("0 12 * * *");
      expect(tasks.get("backup")!.getCallback()).toBe(callback1);

      scheduler.setTask("backup", "0 12 * * *", callback2);

      expect(tasks.size).toBe(1);
      expect(tasks.get("backup")!.getName()).toBe("backup");
      expect(tasks.get("backup")!.getPeriodicity()).toBe("0 12 * * *");
      expect(tasks.get("backup")!.getCallback()).toBe(callback2);
    })

    it("should update a task", () => {
      const scheduler = new Scheduler(mockClock);
      const callback1 = jest.fn<() => void>();
      const callback2 = jest.fn<() => void>();

      scheduler.setTask("backup", "0 12 * * *", callback1);

      let tasks = scheduler.getTasks();
      expect(tasks.size).toBe(1);
      expect(tasks.get("backup")!.getPeriodicity()).toBe("0 12 * * *");

      scheduler.setTask("backup", "30 14 * * *", callback2);
      tasks = scheduler.getTasks();

      expect(tasks.size).toBe(1);
      expect(tasks.get("backup")!.getName()).toBe("backup");
      expect(tasks.get("backup")!.getPeriodicity()).toBe("30 14 * * *");
      expect(tasks.get("backup")!.getCallback()).toBe(callback2);
    })

    it("should throw an error if parameter is null", () => {
      const scheduler = new Scheduler(mockClock);
      const callback = jest.fn<() => void>();

      expect(() => scheduler.setTask(null as any, "0 12 * * *", callback)).toThrow();
      expect(() => scheduler.setTask("backup", null as any, callback)).toThrow();
      expect(() => scheduler.setTask("backup", "0 12 * * *", null as any)).toThrow();
    })
  });

  describe("task removal", () => {
    it("should remove a task", () => {
      const scheduler = new Scheduler(mockClock);
      const callback = jest.fn<() => void>();

      scheduler.setTask("backup", "0 12 * * *", callback);
      let tasks = scheduler.getTasks();
      expect(tasks.size).toBe(1);

      scheduler.removeTask("backup");
      tasks = scheduler.getTasks();
      expect(tasks.size).toBe(0);
    })

    it("should throw an error when removing a non-existing task", () => {
      const scheduler = new Scheduler(mockClock);
      expect(() => scheduler.removeTask("nonExistingTask")).toThrow();
    });
  });

  describe("cron validation", () => {
    it("should add task with valid cron expression", () => {
      const scheduler = new Scheduler(mockClock);
      const callback = jest.fn<() => void>();

      expect(() => scheduler.setTask("backup", "0 12 * * *", callback)).not.toThrow();

      const tasks = scheduler.getTasks();
      expect(tasks.size).toBe(1);
      expect(tasks.get("backup")).toBeDefined();
    })

    it("should throw error if adding task with wrong cron expression", () => {
      const scheduler = new Scheduler(mockClock);
      const callback = jest.fn<() => void>();

      expect(() => scheduler.setTask("backup", "0 0 12", callback)).toThrow();
      expect(() => scheduler.setTask("backup", "", callback)).toThrow();
      expect(() => scheduler.setTask("backup", "0 0 12 *", callback)).toThrow();
      expect(() => scheduler.setTask("backup", "0 26 * * *", callback)).toThrow();
      expect(() => scheduler.setTask("backup", "tous les jours", callback)).toThrow();

      const tasks = scheduler.getTasks();
      expect(tasks.size).toBe(0);
    })
  });

  describe("task execution", () => {
    it("should execute update without task", async () => {
      const scheduler = new Scheduler(mockClock);
      await scheduler.executeTasks();
    })

    it("should execute a task callback every minutes", async () => {
      const start = new Date("2026-01-16T10:00:00Z");
      const scheduler = new Scheduler(mockClock);
      const callback = jest.fn<() => void>();

      scheduler.setTask("backup", "* * * * *", callback);

      for (let i = 0; i < 5; i++) {
        (mockClock.now as jest.Mock).mockReturnValueOnce(new Date(start.getTime() + (i + 1) * 60000));
        await scheduler.executeTasks();
      }

      expect(callback).toHaveBeenCalledTimes(5);
    })

    it("should not execute a task callback if not scheduled", async () => {
      const start = new Date("2026-01-16T10:00:00Z");
      const scheduler = new Scheduler(mockClock);
      const callback = jest.fn<() => void>();

      scheduler.setTask("backup", "30 15 * * *", callback);

      for (let i = 0; i < 5; i++) {
        (mockClock.now as jest.Mock).mockReturnValueOnce(new Date(start.getTime() + (i + 1) * 60000));
        await scheduler.executeTasks();
      }

      expect(callback).toHaveBeenCalledTimes(0);
    })

    it("should retrieve error when task periodicity is invalid", async () => {
      const scheduler = new Scheduler(mockClock);
      const callback = jest.fn<() => void>();

      expect(() => scheduler.setTask("backup", "invalid cron", callback)).toThrow();
    })

    it("should run multiple tasks according to their periodicity", async () => {
      const startTime = new Date("2026-01-16T10:00:00Z");
      const mockClock: Clock = { now: jest.fn(() => startTime) };
      const scheduler = new Scheduler(mockClock);
      const callback1 = jest.fn<() => void>();
      const callback2 = jest.fn<() => void>();

      scheduler.setTask("backup", "* * * * *", callback1);
      scheduler.setTask("backup2", "0,5,10,15 * * * *", callback2);

      for (let i = 0; i < 16; i++) {
        (mockClock.now as jest.Mock).mockReturnValue(
          new Date(startTime.getTime() + i * 60000)
        );
        await scheduler.executeTasks();
      }

      expect(callback1).toHaveBeenCalledTimes(16);
      expect(callback2).toHaveBeenCalledTimes(4);
    })
  })
});
