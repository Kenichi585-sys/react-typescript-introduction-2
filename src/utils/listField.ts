import type { ListFieldItem } from "../types";

export const createListItem = (): ListFieldItem => ({
  id: crypto.randomUUID(),
  value: "",
});
