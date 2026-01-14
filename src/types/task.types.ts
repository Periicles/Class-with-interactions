export type Task = {
  name: string;
  periodicity: string;
  callback: () => void | Promise<void>;
};

export interface Clock {
  now(): Date;
}