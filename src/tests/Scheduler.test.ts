import { describe, it, expect } from "@jest/globals";
describe("Scheduler", () => {
  it("should create a Scheduler instance", () => {
    const scheduler = new Scheduler();
    expect(scheduler).toBeInstanceOf(Scheduler);
  })
})