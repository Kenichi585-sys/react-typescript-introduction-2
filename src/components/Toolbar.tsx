import type {
  FilterCategory,
  FilterState,
  Tab,
} from "../types";
import {
  FILTER_CATEGORY_LABELS,
  getFilterCategoriesForTab,
} from "../utils/filter";

type ToolbarProps = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  filterState: FilterState;
  filterOptions: Record<FilterCategory, string[]>;
  onFilterChange: (filter: FilterState) => void;
  onOpenForm: () => void;
};

const TABS: { value: Tab; label: string }[] = [
  { value: "all", label: "全員" },
  { value: "student", label: "生徒のみ" },
  { value: "mentor", label: "メンターのみ" },
];

export const Toolbar = ({
  activeTab,
  onTabChange,
  filterState,
  filterOptions,
  onFilterChange,
  onOpenForm,
}: ToolbarProps) => {
  const categories = getFilterCategoriesForTab(activeTab);

  const handleCheckboxChange = (
    category: FilterCategory,
    value: string,
    checked: boolean,
  ) => {
    const selected = filterState[category];
    const nextSelected = checked
      ? [...selected, value]
      : selected.filter((item) => item !== value);

    onFilterChange({ ...filterState, [category]: nextSelected });
  };

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

      <button type="button" className="toolbar-create-button" onClick={onOpenForm}>
        新規作成
      </button>

      <div className="toolbar-filters">
        {categories.map((category) => (
          <fieldset key={category} className="toolbar-filter-group">
            <legend>{FILTER_CATEGORY_LABELS[category]}</legend>
            {filterOptions[category].length === 0 ? (
              <p className="toolbar-filter-empty">選択肢なし</p>
            ) : (
              <div className="toolbar-filter-options">
                {filterOptions[category].map((option) => (
                  <label key={option} className="toolbar-filter-option">
                    <input
                      type="checkbox"
                      checked={filterState[category].includes(option)}
                      onChange={(e) =>
                        handleCheckboxChange(
                          category,
                          option,
                          e.target.checked,
                        )
                      }
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </fieldset>
        ))}
      </div>
    </div>
  );
};
