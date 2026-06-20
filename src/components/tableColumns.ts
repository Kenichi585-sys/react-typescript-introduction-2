import type { Tab } from "../types";

export type ColumnKey =
  | "name"
  | "role"
  | "email"
  | "age"
  | "postCode"
  | "phone"
  | "hobbies"
  | "url"
  | "studyMinutes"
  | "taskCode"
  | "studyLangs"
  | "score"
  | "availableMentors"
  | "experienceDays"
  | "useLangs"
  | "availableStartCode"
  | "availableEndCode"
  | "availableStudents";

export type ColumnRole = "common" | "student" | "mentor";

export type ColumnDef = {
  key: ColumnKey;
  label: string;
  role: ColumnRole;
};

const COMMON_COLUMNS: ColumnDef[] = [
  { key: "name", label: "名前", role: "common" },
  { key: "role", label: "ロール", role: "common" },
  { key: "email", label: "メールアドレス", role: "common" },
  { key: "age", label: "年齢", role: "common" },
  { key: "postCode", label: "郵便番号", role: "common" },
  { key: "phone", label: "電話番号", role: "common" },
  { key: "hobbies", label: "趣味", role: "common" },
  { key: "url", label: "URL", role: "common" },
];

const STUDENT_COLUMNS: ColumnDef[] = [
  { key: "studyMinutes", label: "勉強時間", role: "student" },
  { key: "taskCode", label: "課題番号", role: "student" },
  { key: "studyLangs", label: "勉強中の言語", role: "student" },
  { key: "score", label: "ハピネススコア", role: "student" },
  { key: "availableMentors", label: "対応可能なメンター", role: "student" },
];

const MENTOR_COLUMNS: ColumnDef[] = [
  { key: "experienceDays", label: "実務経験月数", role: "mentor" },
  { key: "useLangs", label: "現場で使っている言語", role: "mentor" },
  { key: "availableStartCode", label: "担当できる課題番号初め", role: "mentor" },
  { key: "availableEndCode", label: "担当できる課題番号終わり", role: "mentor" },
  { key: "availableStudents", label: "対応可能な生徒", role: "mentor" },
];

export const getColumnsForTab = (activeTab: Tab): ColumnDef[] => {
  if (activeTab === "student") {
    return [...COMMON_COLUMNS, ...STUDENT_COLUMNS];
  }
  if (activeTab === "mentor") {
    return [...COMMON_COLUMNS, ...MENTOR_COLUMNS];
  }
  return [...COMMON_COLUMNS, ...STUDENT_COLUMNS, ...MENTOR_COLUMNS];
};
