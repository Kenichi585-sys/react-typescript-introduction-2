// --- ドメイン型 ---

export type UserBase = {
  id: string;
  name: string;
  email: string;
  age: number;
  postCode: string;
  phone: string;
  hobbies: string[];
  url: string;
};

export type Student = UserBase & {
  role: "student";
  studyMinutes: number;
  taskCode: number;
  studyLangs: string[];
  score: number;
};

export type Mentor = UserBase & {
  role: "mentor";
  experienceDays: number;
  useLangs: string[];
  availableStartCode: number;
  availableEndCode: number;
};

export type User = Student | Mentor;

// --- UI 状態型 ---

export type Tab = "all" | "student" | "mentor";

export type SortKey = "studyMinutes" | "score" | "experienceDays";
export type SortDirection = "asc" | "desc";
export type SortState = { key: SortKey; direction: SortDirection } | null;

export type FilterCategory = "hobbies" | "studyLangs" | "useLangs";
export type FilterState = Record<FilterCategory, string[]>;

// --- フォーム入力型 ---

export type ListFieldItem = {
  id: string;
  value: string;
};

export type UserFormBase = {
  name: string;
  email: string;
  age: string;
  postCode: string;
  phone: string;
  hobbies: ListFieldItem[];
  url: string;
};

export type StudentFormState = UserFormBase & {
  role: "student";
  studyMinutes: string;
  taskCode: string;
  studyLangs: ListFieldItem[];
  score: string;
};

export type MentorFormState = UserFormBase & {
  role: "mentor";
  experienceDays: string;
  useLangs: ListFieldItem[];
  availableStartCode: string;
  availableEndCode: string;
};

export type UserFormState = StudentFormState | MentorFormState;

// --- 型ガード ---

export const isStudent = (user: User): user is Student =>
  user.role === "student";

export const isMentor = (user: User): user is Mentor =>
  user.role === "mentor";
