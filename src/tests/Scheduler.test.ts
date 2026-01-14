import { describe, it, expect } from "@jest/globals";
import { Scheduler } from "../Scheduler";
describe("Scheduler", () => {
  it("should create a Scheduler instance", () => {
    const scheduler = new Scheduler();
    expect(scheduler).toBeInstanceOf(Scheduler);
  })

  it("should set and get tasks in init", () => {
    const tasks = []
    const scheduler = new Scheduler();
    const schedulerTasks = scheduler.getTasks();
    expect(schedulerTasks).toEqual(tasks);
  })

})