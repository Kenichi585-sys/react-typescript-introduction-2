import type { Tab } from "../types";
import { getColumnsForTab } from "./tableColumns";

type TableHeaderProps = {
  activeTab: Tab;
};

export const TableHeader = ({ activeTab }: TableHeaderProps) => {
  const columns = getColumnsForTab(activeTab);

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <th key={column.key}>{column.label}</th>
        ))}
      </tr>
    </thead>
  );
};
