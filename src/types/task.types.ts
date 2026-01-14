export type Task = {
  name: string;
  periodicity: unknown;
  callback: () => void | Promise<void>;
}