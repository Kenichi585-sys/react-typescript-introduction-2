import type { SortKey, SortState, Tab } from "../types";
import { isColumnSortable, isSortKey } from "./sortableColumns";
import { getColumnsForTab, type ColumnKey } from "./tableColumns";

type TableHeaderProps = {
  activeTab: Tab;
  sortState: SortState;
  onSortClick: (key: SortKey) => void;
};

const getSortIcon = (key: ColumnKey, sortState: SortState): string | null => {
  if (!sortState || sortState.key !== key) {
    return "⇅";
  }
  return sortState.direction === "asc" ? "▲" : "▼";
};

export const TableHeader = ({
  activeTab,
  sortState,
  onSortClick,
}: TableHeaderProps) => {
  const columns = getColumnsForTab(activeTab);

  return (
    <thead>
      <tr>
        {columns.map((column) => {
          const sortable = isColumnSortable(activeTab, column.key);

          if (!sortable) {
            return <th key={column.key}>{column.label}</th>;
          }

          const icon = getSortIcon(column.key, sortState);
          const isActive = sortState?.key === column.key;

          return (
            <th key={column.key}>
              <button
                type="button"
                className="sort-header-button"
                onClick={() => {
                  if (!isSortKey(column.key)) return;
                  onSortClick(column.key);
                }}
              >
                {column.label}
                <span
                  className={
                    isActive ? "sort-icon is-active" : "sort-icon is-idle"
                  }
                >
                  {icon}
                </span>
              </button>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};
