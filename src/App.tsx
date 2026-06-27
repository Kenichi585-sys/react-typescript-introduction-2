import { useMemo, useState } from "react";
import "./App.css";
import { UserTable } from "./components/UserTable";
import { Toolbar } from "./components/Toolbar";
import { USER_LIST } from "./data";
import { applySort } from "./utils/sort";
import { applyFilter, collectFilterOptions } from "./utils/filter";
import {
  isMentor,
  isStudent,
  type FilterState,
  type SortKey,
  type SortState,
  type Tab,
  type User,
} from "./types";

const INITIAL_FILTER_STATE: FilterState = {
  hobbies: [],
  studyLangs: [],
  useLangs: [],
};

function App() {
  const [users, setUsers] = useState<User[]>(USER_LIST);
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [sortState, setSortState] = useState<SortState>(null);
  const [filterState, setFilterState] =
    useState<FilterState>(INITIAL_FILTER_STATE);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // タブ切替時はソート・フィルタをリセット（SPEC 準拠）
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setSortState(null);
    setFilterState(INITIAL_FILTER_STATE);
  };

  const handleSortClick = (key: SortKey) => {
    if (sortState?.key !== key) {
      setSortState({ key, direction: "asc" });
      return;
    }
    if (sortState.direction === "asc") {
      setSortState({ key, direction: "desc" });
      return;
    }
    setSortState(null);
  };

  const handleFilterChange = (filter: FilterState) => {
    setFilterState(filter);
  };

  // ステップ8で UserForm の onSubmit に渡す。定義だけ先に置いている。
  const handleAddUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
    setActiveTab("all");
    setSortState(null);
    setFilterState(INITIAL_FILTER_STATE);
    setIsFormOpen(false);
  };
  void handleAddUser; // ステップ8まで未使用。TypeScript の未使用警告回避。

  const filterOptions = useMemo(() => {
    const options = {
      hobbies: collectFilterOptions(users, "hobbies"),
      studyLangs: collectFilterOptions(users, "studyLangs"),
      useLangs: collectFilterOptions(users, "useLangs"),
    };
    console.log("=== filterOptions（チェックボックスの選択肢）===");
    console.log("趣味:", options.hobbies);
    console.log("勉強中の言語:", options.studyLangs);
    console.log("現場で使っている言語:", options.useLangs);
    return options;
  }, [users]);

  const displayUsers = useMemo(() => {
    let result = users;
    if (activeTab === "student") {
      result = result.filter(isStudent);
    } else if (activeTab === "mentor") {
      result = result.filter(isMentor);
    }
    result = applyFilter(result, filterState, activeTab);
    return applySort(result, sortState);
  }, [users, activeTab, filterState, sortState]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>ユーザー一覧管理</h1>
      </header>

      <main className="app-main">
        <Toolbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          filterState={filterState}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
        />

        {/* --- 開発用プレースホルダー（ステップ8: 新規作成） --- */}
        <section className="app-dev-placeholder">
          <button type="button" onClick={() => setIsFormOpen(true)}>
            [仮] 新規作成を開く
          </button>
        </section>

        <UserTable
          users={displayUsers}
          activeTab={activeTab}
          sortState={sortState}
          onSortClick={handleSortClick}
        />
      </main>

      {/* UserFormModal（ステップ8で実装） */}
      {isFormOpen && (
        <div className="app-modal-placeholder">
          <p>UserFormModal — ステップ8で実装</p>
          <button type="button" onClick={() => setIsFormOpen(false)}>
            閉じる
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
