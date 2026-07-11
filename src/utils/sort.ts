import {
  isMentor,
  isStudent,
  type SortKey,
  type SortState,
  type User,
} from "../types";

const getNumericSortValue = (user: User, key: SortKey): number => {
  switch (key) {
    case "studyMinutes":
      return isStudent(user) ? user.studyMinutes : 0;
    case "score":
      return isStudent(user) ? user.score : 0;
    case "experienceDays":
      return isMentor(user) ? user.experienceDays : 0;
  }
};

export const applySort = (users: User[], sortState: SortState): User[] => {
  if (!sortState) {
    return users;
  }

  const { key, direction } = sortState;
  const multiplier = direction === "asc" ? 1 : -1;

  return [...users].sort(
    (a, b) =>
      (getNumericSortValue(a, key) - getNumericSortValue(b, key)) * multiplier,
  );
};
