import { parseCron } from "./utils/parse-cron";

export class Task {
  private name: string;
  private periodicity: string;
  private callback: () => void | Promise<void>;

  constructor(name: string, periodicity: string, callback: () => void | Promise<void>) {
    this.name = name;
    this.periodicity = periodicity;
    this.callback = callback;
  }

  getName(): string {
    return this.name;
  }

  getPeriodicity(): string {
    return this.periodicity;
  }

  getCallback(): () => void | Promise<void> {
    return this.callback;
  }

  setName(name: string): void {
    this.name = name;
  }

  setPeriodicity(periodicity: string): void {
    this.periodicity = periodicity;
  }

  shouldExecuteAt(date: Date): boolean {
    try {
      const cronResult = parseCron(this.periodicity)
      const minutes = cronResult.minutes;

      if (!minutes.includes(date.getMinutes())) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      throw new Error(`Invalid cron expression: ${this.periodicity}`);
    }
  }

  setCallback(callback: () => void | Promise<void>): void {
    this.callback = callback;
  }
}
