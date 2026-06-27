import {
  isMentor,
  isStudent,
  type FilterCategory,
  type FilterState,
  type Tab,
  type User,
} from "../types";

export const FILTER_CATEGORY_LABELS: Record<FilterCategory, string> = {
  hobbies: "趣味",
  studyLangs: "勉強中の言語",
  useLangs: "現場で使っている言語",
};

export const getFilterCategoriesForTab = (activeTab: Tab): FilterCategory[] => {
  if (activeTab === "student") {
    return ["hobbies", "studyLangs"];
  }
  if (activeTab === "mentor") {
    return ["hobbies", "useLangs"];
  }
  return ["hobbies"];
};

export const collectFilterOptions = (
  users: User[],
  category: FilterCategory,
): string[] => {
  const values = new Set<string>();

  for (const user of users) {
    switch (category) {
      case "hobbies":
        for (const hobby of user.hobbies) {
          values.add(hobby);
        }
        break;
      case "studyLangs":
        if (isStudent(user)) {
          for (const lang of user.studyLangs) {
            values.add(lang);
          }
        }
        break;
      case "useLangs":
        if (isMentor(user)) {
          for (const lang of user.useLangs) {
            values.add(lang);
          }
        }
        break;
    }
  }

  return [...values].sort();
};

const userMatchesCategory = (
  user: User,
  category: FilterCategory,
  selected: string[],
): boolean => {
  if (selected.length === 0) {
    return true;
  }

  switch (category) {
    case "hobbies":
      return user.hobbies.some((hobby) => selected.includes(hobby));
    case "studyLangs":
      return (
        isStudent(user) &&
        user.studyLangs.some((lang) => selected.includes(lang))
      );
    case "useLangs":
      return (
        isMentor(user) &&
        user.useLangs.some((lang) => selected.includes(lang))
      );
  }
};

export const applyFilter = (
  users: User[],
  filterState: FilterState,
  activeTab: Tab,
): User[] => {
  const categories = getFilterCategoriesForTab(activeTab);

  return users.filter((user) =>
    categories.every((category) =>
      userMatchesCategory(user, category, filterState[category]),
    ),
  );
};
