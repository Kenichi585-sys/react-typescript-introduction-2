import type { Tab } from "../types";

type ToolbarProps = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const TABS: { value: Tab; label: string }[] = [
  { value: "all", label: "全員" },
  { value: "student", label: "生徒のみ" },
  { value: "mentor", label: "メンターのみ" },
];

export const Toolbar = ({ activeTab, onTabChange }: ToolbarProps) => {
  return (
    <div className="toolbar">
      <div className="toolbar-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            className={
              activeTab === tab.value ? "toolbar-tab is-active" : "toolbar-tab"
            }
            onClick={() => onTabChange(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
