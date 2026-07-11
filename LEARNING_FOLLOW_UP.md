# 学習フォローアップメモ

AI・実装者向け：以下のタイミングでユーザーと一緒に作業する。

## 1. ステップ8の直前（UserForm 実装前）

**やること**: React 19 フォーム（`form action` / `useActionState`）について相談し、古典派（`useState` + `onSubmit`）で実装する理由を確認する。

**AI への相談テンプレ（パターン3）**:

```
このユーザー管理アプリのフォーム部分だけ、
React 19 の新しい書き方にすると何が楽になりますか？
ListField（行の追加削除）がある点も考慮してください。
```

**その後**: 古典派で UserForm を実装する（設計どおり）。

---

## 2. 課題完成後（半日程度）

**やること**: 完成した `UserForm` を題材に、React 19 版（`form action` + `useActionState`）への書き換え練習を行う。

**目的**: Next.js の Server Actions 学習前のキャッチアップ。転職キャッチアップ用。

**進め方の目安**:

1. 送信処理まわりだけ `<form action={formAction}>` + `useActionState` に置き換え
2. 入力 state は当面 `useState` のまま（`ListField` があるため）
3. 慣れてきたら単純な input を uncontrolled（`name` 属性のみ）に寄せる

---

## 参考：React 19 優先度（Next.js 学習前）

| 優先度 | 機能 | いつ触る |
|---|---|---|
| ★★★ | `<form action>` + Server Actions | Next.js 序盤 |
| ★★★ | `useActionState` | ステップ8後 / Next.js |
| ★★☆ | `use()` | Next.js |
| ★★☆ | RSC（Server Components） | Next.js の核心 |
