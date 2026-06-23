import type { SortKey } from "../types";
import type { Tab } from "../types";
import type { ColumnKey } from "./tableColumns";

export const isSortKey = (key: ColumnKey): key is SortKey =>
  key === "studyMinutes" || key === "score" || key === "experienceDays";

export const isColumnSortable = (activeTab: Tab, key: ColumnKey): boolean => {
  if (activeTab === "student") {
    return key === "studyMinutes" || key === "score";
  }
  if (activeTab === "mentor") {
    return key === "experienceDays";
  }
  return false;
};
