import type { ListFieldItem } from "../types";

type ListFieldProps = {
  label: string;
  items: ListFieldItem[];
  onChange: (items: ListFieldItem[]) => void;
  error?: string;
};

const createListItem = (): ListFieldItem => ({
  id: crypto.randomUUID(),
  value: "",
});

export const ListField = ({
  label,
  items,
  onChange,
  error,
}: ListFieldProps) => {
  const handleValueChange = (id: string, value: string) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, value } : item)),
    );
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    onChange([...items, createListItem()]);
  };

  return (
    <fieldset className="form-field">
      <legend>{label}</legend>
      <div className="list-field">
        {items.map((item) => (
          <div key={item.id} className="list-field-row">
            <input
              type="text"
              value={item.value}
              onChange={(e) => handleValueChange(item.id, e.target.value)}
            />
            <button type="button" onClick={() => handleRemove(item.id)}>
              削除
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAdd}>
          追加
        </button>
      </div>
      {error && <p className="form-error">{error}</p>}
    </fieldset>
  );
};
