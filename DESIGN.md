# 設計ドキュメント

## Step 1: 型設計

### ドメイン型

```ts
type UserBase = {
  id: string;
  name: string;
  email: string;
  age: number;
  postCode: string;
  phone: string;
  hobbies: string[];
  url: string;
};

type Student = UserBase & {
  role: "student";
  studyMinutes: number;
  taskCode: number;
  studyLangs: string[];
  score: number;
};

type Mentor = UserBase & {
  role: "mentor";
  experienceDays: number;
  useLangs: string[];
  availableStartCode: number;
  availableEndCode: number;
};

type User = Student | Mentor;
```

- `UserBase` は共通フィールドのみ。`role` は持たない
- `Student` / `Mentor` が各自 `role` リテラルを持つ（判別可能ユニオン）
- `user.role === "student"` でナローイングできるため、型アサーション（`as Student` 等）が不要
- `id` は `string`（UUID）で統一。初期データも UUID 文字列に変換する
- 新規作成時は `crypto.randomUUID()` で生成

### UI 状態型

```ts
type Tab = "all" | "student" | "mentor";

type SortKey = "studyMinutes" | "score" | "experienceDays";
type SortDirection = "asc" | "desc";
type SortState = { key: SortKey; direction: SortDirection } | null;

type FilterCategory = "hobbies" | "studyLangs" | "useLangs";
type FilterState = Record<FilterCategory, string[]>;
```

- `SortState` は `null` でソート未適用を表す（asc → desc → 解除の3段階）
- `FilterState` は各カテゴリに選択された値の配列。空配列でフィルタなし

### フォーム入力型

```ts
type ListFieldItem = {
  id: string;    // crypto.randomUUID() で生成。React の key に使う
  value: string;
};

type UserFormBase = {
  name: string;
  email: string;
  age: string;
  postCode: string;
  phone: string;
  hobbies: ListFieldItem[];
  url: string;
};

type StudentFormState = UserFormBase & {
  role: "student";
  studyMinutes: string;
  taskCode: string;
  studyLangs: ListFieldItem[];
  score: string;
};

type MentorFormState = UserFormBase & {
  role: "mentor";
  experienceDays: string;
  useLangs: ListFieldItem[];
  availableStartCode: string;
  availableEndCode: string;
};

type UserFormState = StudentFormState | MentorFormState;
```

- フォーム入力中は数値フィールドも `string`（HTML input の値が文字列のため）
- リスト入力（趣味・言語）は `ListFieldItem[]` で管理し、送信時に `string[]` へ変換
- `ListFieldItem.id` により `key={index}` を回避し、行の追加・削除時に React が正しく追跡できる

---

## Step 2: コンポーネント構成と責務

### コンポーネントツリー

```
App
├── Toolbar
│   ├── タブ切替ボタン
│   ├── フィルタ（チェックボックス群）
│   └── 「新規作成」ボタン
├── UserTable
│   ├── TableHeader（ヘッダー行 — ソート操作）
│   └── テーブル本体（データ行）
└── UserFormModal
    └── UserForm
        └── ListField（趣味・言語のリスト入力）
```

### 各コンポーネントの責務

| コンポーネント | 責務 |
|---|---|
| `App` | state 管理（users, activeTab, sortState, filterState, isFormOpen）。ソート・フィルタ適用後の表示用リストを計算して子に渡す。ユーザー追加処理 |
| `Toolbar` | タブ切替ボタン、フィルタチェックボックス、新規作成ボタンの表示。自分では state を持たず、props と callbacks で動作 |
| `UserTable` | 受け取ったユーザーリストをテーブルとして描画。タブに応じてカラムを切り替える |
| `TableHeader` | カラム名・ソートアイコン（⇅/▲/▼）の表示。ヘッダークリック時のソート操作を親に伝える |
| `UserFormModal` | モーダルの枠（オーバーレイ、開閉制御）。中身の UserForm を包む |
| `UserForm` | フォーム入力状態とバリデーションエラーを自前で管理。送信時にドメイン型へ変換して親に渡す |
| `ListField` | 趣味・言語のリスト入力の共通部品。行の追加・削除・値変更を扱う |

### 設計判断メモ

- `UserForm` が自前 state を持つ理由：入力途中のデータはアプリ全体に関係のない一時的な状態。送信時だけ `App` に渡せばよい
- `UserFormModal` と `UserForm` を分ける理由：モーダルの枠（UI）とフォームのロジック（入力・バリデーション）は別の関心事

---

## Step 3: State 設計

### App が持つ state

| state | 型 | 理由 |
|---|---|---|
| `users` | `User[]` | テーブル表示・フォーム送信後の追加に必要 |
| `activeTab` | `Tab` | Toolbar（タブボタン）と UserTable（カラム切替）の両方が使う |
| `sortState` | `SortState` | TableHeader（ソート操作）と表示用リスト計算の両方が使う |
| `filterState` | `FilterState` | Toolbar（チェックボックス）と表示用リスト計算の両方が使う |
| `isFormOpen` | `boolean` | Toolbar（ボタン）と UserFormModal（表示/非表示）が使う |

### UserForm が持つ state

| state | 型 | 理由 |
|---|---|---|
| `formState` | `UserFormState` | 入力途中のデータ。フォーム内でしか使わない |
| `errors` | 後述（Step 4 で決定） | バリデーションエラー。フォーム内でしか使わない |

### state を持たないコンポーネント

Toolbar, UserTable, TableHeader, UserFormModal, ListField — すべて props と callbacks のみで動作

### props の流れ

```
App (users, activeTab, sortState, filterState, isFormOpen)
│
├─ Toolbar
│   props: activeTab, filterState, フィルタ選択肢
│   callbacks: onTabChange, onFilterChange, onOpenForm
│
├─ UserTable
│   props: 表示用ユーザーリスト, activeTab, sortState
│   │
│   └─ TableHeader
│       props: activeTab, sortState
│       callbacks: onSortChange
│
└─ UserFormModal
    props: isFormOpen
    callbacks: onClose
    │
    └─ UserForm (自前 state: formState, errors)
        callbacks: onSubmit → App の users に追加
```

- ソート・フィルタの適用は App 内で行い、結果（表示用ユーザーリスト）だけを UserTable に渡す
- state の配置原則：その state を使うコンポーネントたちの、一番近い共通の親に置く

---

## Step 4: ロジックの分離とファイル構成

（未決定 — Step 4 完了後に追記）
