import { useMemo, useState } from "react";
import "./App.css";
import { UserFormModal } from "./components/UserFormModal";
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

const App = () => {
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

  const handleAddUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
    setActiveTab("all");
    setSortState(null);
    setFilterState(INITIAL_FILTER_STATE);
    setIsFormOpen(false);
  };

  const filterOptions = useMemo(
    () => ({
      hobbies: collectFilterOptions(users, "hobbies"),
      studyLangs: collectFilterOptions(users, "studyLangs"),
      useLangs: collectFilterOptions(users, "useLangs"),
    }),
    [users],
  );

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
          onOpenForm={() => setIsFormOpen(true)}
        />

        <UserTable
          users={displayUsers}
          allUsers={users}
          activeTab={activeTab}
          sortState={sortState}
          onSortClick={handleSortClick}
        />
      </main>

      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddUser}
      />
    </div>
  );
};

export default App;
