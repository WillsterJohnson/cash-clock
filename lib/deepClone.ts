import type { Empty } from "./calendar.js";

export function deepClone<T>(obj: T): T | Empty {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch {
    return {};
  }
}
