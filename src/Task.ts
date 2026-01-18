import { isCronMatch, validateCron } from "./utils/parse-cron";

export class Task {
  private name: string;
  private periodicity: string;
  private callback: () => void | Promise<void>;

  constructor(name: string, periodicity: string, callback: () => void | Promise<void>) {
    validateCron(periodicity);
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
    validateCron(periodicity);
    this.periodicity = periodicity;
  }

  shouldExecuteAt(date: Date): boolean {
    return isCronMatch(this.periodicity, date);
  }

  setCallback(callback: () => void | Promise<void>): void {
    this.callback = callback;
  }
}
