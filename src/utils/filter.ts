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
    console.log(`  [${category}] 選択なし → 無条件で通過`);
    return true;
  }

  let result = false;
  switch (category) {
    case "hobbies":
      result = user.hobbies.some((hobby) => selected.includes(hobby));
      console.log(`  [hobbies] ${user.name}の趣味=${JSON.stringify(user.hobbies)}, 選択=${JSON.stringify(selected)} → ${result ? "✅マッチ" : "❌不一致"}`);
      return result;
    case "studyLangs":
      result = isStudent(user) && user.studyLangs.some((lang) => selected.includes(lang));
      console.log(`  [studyLangs] ${user.name} → ${result ? "✅マッチ" : "❌不一致"}`);
      return result;
    case "useLangs":
      result = isMentor(user) && user.useLangs.some((lang) => selected.includes(lang));
      console.log(`  [useLangs] ${user.name} → ${result ? "✅マッチ" : "❌不一致"}`);
      return result;
  }
};

export const applyFilter = (
  users: User[],
  filterState: FilterState,
  activeTab: Tab,
): User[] => {
  const categories = getFilterCategoriesForTab(activeTab);

  console.log("--- applyFilter 開始 ---");
  console.log("タブ:", activeTab);
  console.log("使うカテゴリ:", categories);
  console.log("filterState:", JSON.stringify(filterState));
  console.log("フィルタ前の人数:", users.length, "人");

  const result = users.filter((user) => {
    console.log(`▶ ${user.name} を判定中...`);
    const pass = categories.every((category) =>
      userMatchesCategory(user, category, filterState[category]),
    );
    console.log(`  → ${user.name}: ${pass ? "✅残す" : "❌除外"}`);
    return pass;
  });

  console.log("フィルタ後の人数:", result.length, "人");
  console.log("--- applyFilter 終了 ---");
  return result;
};
