import { useState, type FormEvent } from "react";
import type {
  MentorFormState,
  StudentFormState,
  User,
  UserFormState,
} from "../types";
import { validateUserForm, type UserFormErrors } from "../utils/validation";
import { createListItem } from "../utils/listField";
import { ListField } from "./ListField";

type UserFormProps = {
  onSubmit: (user: User) => void;
  onCancel: () => void;
};

// 初期データ（data.ts）の値を例として表示
const FORM_PLACEHOLDERS = {
  name: "例：鈴木太郎",
  email: "例：test1@happiness.com",
  age: "例：26",
  postCode: "例：100-0003",
  phone: "例：0120000001",
  hobby: "例：旅行",
  url: "例：https://aaa.com",
  studyMinutes: "例：3000",
  taskCode: "例：101",
  studyLang: "例：Rails",
  score: "例：68",
  experienceDays: "例：1850",
  useLang: "例：Next.js",
  availableStartCode: "例：201",
  availableEndCode: "例：302",
} as const;

const createInitialStudentForm = (): StudentFormState => ({
  role: "student",
  name: "",
  email: "",
  age: "",
  postCode: "",
  phone: "",
  hobbies: [createListItem()],
  url: "",
  studyMinutes: "",
  taskCode: "",
  studyLangs: [createListItem()],
  score: "",
});

const createInitialMentorForm = (): MentorFormState => ({
  role: "mentor",
  name: "",
  email: "",
  age: "",
  postCode: "",
  phone: "",
  hobbies: [createListItem()],
  url: "",
  experienceDays: "",
  useLangs: [createListItem()],
  availableStartCode: "",
  availableEndCode: "",
});

const listItemsToStrings = (items: { value: string }[]): string[] =>
  items.map((item) => item.value).filter((value) => value !== "");

const convertFormToUser = (form: UserFormState): User => {
  const base = {
    id: crypto.randomUUID(),
    name: form.name,
    email: form.email,
    age: Number(form.age),
    postCode: form.postCode,
    phone: form.phone,
    hobbies: listItemsToStrings(form.hobbies),
    url: form.url,
  };

  if (form.role === "student") {
    return {
      ...base,
      role: "student",
      studyMinutes: Number(form.studyMinutes),
      taskCode: Number(form.taskCode),
      studyLangs: listItemsToStrings(form.studyLangs),
      score: Number(form.score),
    };
  }

  return {
    ...base,
    role: "mentor",
    experienceDays: Number(form.experienceDays),
    useLangs: listItemsToStrings(form.useLangs),
    availableStartCode: Number(form.availableStartCode),
    availableEndCode: Number(form.availableEndCode),
  };
};

export const UserForm = ({ onSubmit, onCancel }: UserFormProps) => {
  const [formState, setFormState] = useState<UserFormState>(
    createInitialStudentForm,
  );
  const [errors, setErrors] = useState<UserFormErrors>({});

  const handleRoleChange = (role: "student" | "mentor") => {
    if (role === formState.role) {
      return;
    }

    setFormState((prev) => {
      const base = {
        name: prev.name,
        email: prev.email,
        age: prev.age,
        postCode: prev.postCode,
        phone: prev.phone,
        hobbies: prev.hobbies,
        url: prev.url,
      };

      if (role === "student") {
        return { ...createInitialStudentForm(), ...base };
      }

      return { ...createInitialMentorForm(), ...base };
    });
    setErrors({});
  };

  // role は handleRoleChange 専用。updateForm では role を渡さない不変条件のため、
  // スプレッド後も実行時は常に UserFormState だが TypeScript は推論できないので as が必要。
  const updateForm = (updates: Partial<UserFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }) as UserFormState);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateUserForm(formState);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    onSubmit(convertFormToUser(formState));
  };

  return (
    <form noValidate className="user-form" onSubmit={handleSubmit}>
      <h2 id="user-form-title">新規ユーザー作成</h2>

      <fieldset className="form-field">
        <legend>ロール</legend>
        <div className="form-role-toggle">
          <label>
            <input
              type="radio"
              name="role"
              checked={formState.role === "student"}
              onChange={() => handleRoleChange("student")}
            />
            生徒
          </label>
          <label>
            <input
              type="radio"
              name="role"
              checked={formState.role === "mentor"}
              onChange={() => handleRoleChange("mentor")}
            />
            メンター
          </label>
        </div>
      </fieldset>

      <label className="form-field">
        名前（必須）
        <input
          type="text"
          value={formState.name}
          placeholder={FORM_PLACEHOLDERS.name}
          onChange={(e) => updateForm({ name: e.target.value })}
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </label>

      <label className="form-field">
        メールアドレス（必須）
        <input
          type="email"
          value={formState.email}
          placeholder={FORM_PLACEHOLDERS.email}
          onChange={(e) => updateForm({ email: e.target.value })}
        />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </label>

      <label className="form-field">
        年齢（必須）
        <input
          type="text"
          inputMode="numeric"
          value={formState.age}
          placeholder={FORM_PLACEHOLDERS.age}
          onChange={(e) => updateForm({ age: e.target.value })}
        />
        {errors.age && <p className="form-error">{errors.age}</p>}
      </label>

      <label className="form-field">
        郵便番号（必須）
        <input
          type="text"
          value={formState.postCode}
          placeholder={FORM_PLACEHOLDERS.postCode}
          onChange={(e) => updateForm({ postCode: e.target.value })}
        />
        {errors.postCode && <p className="form-error">{errors.postCode}</p>}
      </label>

      <label className="form-field">
        電話番号（必須）
        <input
          type="text"
          inputMode="numeric"
          value={formState.phone}
          placeholder={FORM_PLACEHOLDERS.phone}
          onChange={(e) => updateForm({ phone: e.target.value })}
        />
        {errors.phone && <p className="form-error">{errors.phone}</p>}
      </label>

      <ListField
        label="趣味（任意）"
        items={formState.hobbies}
        onChange={(items) => updateForm({ hobbies: items })}
        // 下記のエラーの中身は常に undefined になるため実害はありません。将来もし趣味にバリデーションを戻したくなったとき使えるので残します。
        error={errors.hobbies}
      />

      <label className="form-field">
        URL（任意）
        <input
          type="url"
          value={formState.url}
          placeholder={FORM_PLACEHOLDERS.url}
          onChange={(e) => updateForm({ url: e.target.value })}
        />
        {errors.url && <p className="form-error">{errors.url}</p>}
      </label>

      {formState.role === "student" ? (
        <>
          <label className="form-field">
            勉強時間（必須）
            <input
              type="text"
              inputMode="numeric"
              value={formState.studyMinutes}
              placeholder={FORM_PLACEHOLDERS.studyMinutes}
              onChange={(e) => updateForm({ studyMinutes: e.target.value })}
            />
            {errors.studyMinutes && (
              <p className="form-error">{errors.studyMinutes}</p>
            )}
          </label>

          <label className="form-field">
            課題番号（必須）
            <input
              type="text"
              inputMode="numeric"
              value={formState.taskCode}
              placeholder={FORM_PLACEHOLDERS.taskCode}
              onChange={(e) => updateForm({ taskCode: e.target.value })}
            />
            {errors.taskCode && <p className="form-error">{errors.taskCode}</p>}
          </label>

          <ListField
            label="勉強中の言語（必須）"
            items={formState.studyLangs}
            onChange={(items) => updateForm({ studyLangs: items })}
            placeholder={FORM_PLACEHOLDERS.studyLang}
            error={errors.studyLangs}
          />

          <label className="form-field">
            ハピネススコア（必須）
            <input
              type="text"
              inputMode="numeric"
              value={formState.score}
              placeholder={FORM_PLACEHOLDERS.score}
              onChange={(e) => updateForm({ score: e.target.value })}
            />
            {errors.score && <p className="form-error">{errors.score}</p>}
          </label>
        </>
      ) : (
        <>
          <label className="form-field">
            実務経験月数（必須）
            <input
              type="text"
              inputMode="numeric"
              value={formState.experienceDays}
              placeholder={FORM_PLACEHOLDERS.experienceDays}
              onChange={(e) => updateForm({ experienceDays: e.target.value })}
            />
            {errors.experienceDays && (
              <p className="form-error">{errors.experienceDays}</p>
            )}
          </label>

          <ListField
            label="現場で使っている言語（必須）"
            items={formState.useLangs}
            onChange={(items) => updateForm({ useLangs: items })}
            placeholder={FORM_PLACEHOLDERS.useLang}
            error={errors.useLangs}
          />

          <label className="form-field">
            担当できる課題番号初め（必須）
            <input
              type="text"
              inputMode="numeric"
              value={formState.availableStartCode}
              placeholder={FORM_PLACEHOLDERS.availableStartCode}
              onChange={(e) =>
                updateForm({ availableStartCode: e.target.value })
              }
            />
            {errors.availableStartCode && (
              <p className="form-error">{errors.availableStartCode}</p>
            )}
          </label>

          <label className="form-field">
            担当できる課題番号終わり（必須）
            <input
              type="text"
              inputMode="numeric"
              value={formState.availableEndCode}
              placeholder={FORM_PLACEHOLDERS.availableEndCode}
              onChange={(e) => updateForm({ availableEndCode: e.target.value })}
            />
            {errors.availableEndCode && (
              <p className="form-error">{errors.availableEndCode}</p>
            )}
          </label>
        </>
      )}

      <div className="form-actions">
        <button type="button" onClick={onCancel}>
          キャンセル
        </button>
        <button type="submit">作成</button>
      </div>
    </form>
  );
};
