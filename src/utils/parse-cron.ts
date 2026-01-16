const parsePart = (part: string | undefined, min: number, max: number): number[] => {
  if (!part) {
    throw new Error("Cron part is undefined");
  }
  if (part === "*") {
    return Array.from({ length: max - min + 1 }, (_, i) => i + min);
  }
  return part.split(",").map((value) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < min || num > max) {
      throw new Error(`Invalid cron part: ${part}`);
    }
    return num;
  });
};


export const parseCron = (cronExpression: string): {
  minutes: number[];
  hours: number[];
  dayOfMonth: number[];
  month: number[];
  dayOfWeek: number[];
} => {
  const parts = cronExpression.trim().split(" ");
  if (parts.length !== 5) {
    throw new Error("Invalid cron expression");
  }

  return {
    minutes: parsePart(parts[0], 0, 59),
    hours: parsePart(parts[1], 0, 23),
    dayOfMonth: parsePart(parts[2], 1, 31),
    month: parsePart(parts[3], 1, 12),
    dayOfWeek: parsePart(parts[4], 0, 6),
  };
}