import { useMemo, useState } from "react";
import "./App.css";
import { UserTable } from "./components/UserTable";
import { Toolbar } from "./components/Toolbar";
import { USER_LIST } from "./data";
import {
  isMentor,
  isStudent,
  type FilterState,
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

  const handleSortChange = (sort: SortState) => {
    setSortState(sort);
  };

  const handleFilterChange = (filter: FilterState) => {
    setFilterState(filter);
  };

  const handleAddUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
    setActiveTab("all");
    setSortState(null);
    setFilterState(INITIAL_FILTER_STATE);
    setIsFormOpen(false);
  };

  // ステップ3以降: Toolbar / UserTable / UserFormModal をここに配置
  // ステップ6以降: useMemo でタブ絞り込み → フィルタ → ソートのパイプラインを追加
  void handleAddUser;

  const displayUsers = useMemo(() => {
    if (activeTab === "student") {
      return users.filter(isStudent);
    }
    if (activeTab === "mentor") {
      return users.filter(isMentor);
    }
    return users;
  }, [users, activeTab]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>ユーザー一覧管理</h1>
      </header>

      <main className="app-main">
        <Toolbar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* --- 以下は開発用プレースホルダー（ステップ6: フィルタ / ステップ8: 新規作成） --- */}
        <section className="app-dev-placeholder">
          <p>
            sortState:{" "}
            {sortState ? `${sortState.key} ${sortState.direction}` : "なし"}
          </p>
          <p>
            filterState: hobbies={filterState.hobbies.length}, studyLangs=
            {filterState.studyLangs.length}, useLangs=
            {filterState.useLangs.length}
          </p>
          <div>
            <button
              type="button"
              onClick={() =>
                handleSortChange({ key: "score", direction: "asc" })
              }
            >
              [仮] スコア昇順
            </button>
            <button type="button" onClick={() => handleSortChange(null)}>
              [仮] ソート解除
            </button>
            <button
              type="button"
              onClick={() =>
                handleFilterChange({ ...filterState, hobbies: ["旅行"] })
              }
            >
              [仮] 趣味:旅行
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange(INITIAL_FILTER_STATE)}
            >
              [仮] フィルタ解除
            </button>
          </div>
          <button type="button" onClick={() => setIsFormOpen(true)}>
            [仮] 新規作成を開く
          </button>
        </section>

        <UserTable users={displayUsers} activeTab={activeTab} />
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
