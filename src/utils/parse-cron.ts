import * as parser from "cron-parser";

const normalizeCron = (cronExpression: string): string => {
  const parts = cronExpression.trim().split(/\s+/);
  if (parts.length === 5) {
    return `0 ${parts.join(" ")}`;
  }
  return cronExpression.trim();
};

/**
 * Validates a cron expression using cron-parser. Throws on invalid expressions.
 */
export const validateCron = (cronExpression: string): void => {
  if (!cronExpression) {
    throw new Error("Cron expression is empty");
  }
  try {
    parser.parseExpression(normalizeCron(cronExpression));
  } catch (error) {
    throw new Error(`Invalid cron expression: ${cronExpression}`);
  }
};

/**
 * Checks whether the provided date matches the cron expression.
 * Milliseconds are ignored to avoid spurious mismatches.
 */
export const isCronMatch = (cronExpression: string, date: Date): boolean => {
  const current = new Date(date.getTime());
  current.setMilliseconds(0);

  try {
    const iterator = parser.parseExpression(normalizeCron(cronExpression), {
      currentDate: new Date(current.getTime() - 1000),
    });
    const next = iterator.next();
    return next.getTime() === current.getTime();
  } catch (error) {
    throw new Error(`Invalid cron expression: ${cronExpression}`);
  }
};