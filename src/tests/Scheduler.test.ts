import { describe, it, expect } from "@jest/globals";
import { Scheduler } from "../Scheduler";
describe("Scheduler", () => {
  it("should create a Scheduler instance", () => {
    const scheduler = new Scheduler();
    expect(scheduler).toBeInstanceOf(Scheduler);
  })
})