import { expect, test } from "@playwright/test";
import { getFirstColumnNames, getTableRowCount } from "./helpers/table";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("初期表示で全員8人が一覧に出る", async ({ page }) => {
  await expect(
    page.getByRole("heading", { name: "ユーザー一覧管理" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "全員" })).toHaveClass(
    /is-active/,
  );
  await expect(page.getByRole("cell", { name: "鈴木太郎", exact: true })).toBeVisible();
  await expect(await getTableRowCount(page)).toBe(8);
});

test("タブ切替で人数が変わり、フィルタがリセットされる", async ({ page }) => {
  await page.getByRole("button", { name: "生徒のみ" }).click();
  await expect(await getTableRowCount(page)).toBe(4);

  await page.getByRole("checkbox", { name: "旅行" }).check();
  await expect(await getTableRowCount(page)).toBe(2);
  await expect(page.getByRole("cell", { name: "鈴木太郎", exact: true })).toBeVisible();
  await expect(page.getByRole("cell", { name: "鈴木三郎", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "メンターのみ" }).click();
  await expect(await getTableRowCount(page)).toBe(4);
  await expect(page.getByRole("checkbox", { name: "旅行" })).not.toBeChecked();
});

test("生徒タブで勉強時間ヘッダーを3回クリックすると昇順→降順→解除", async ({
  page,
}) => {
  await page.getByRole("button", { name: "生徒のみ" }).click();

  const studyMinutesHeader = page.getByRole("button", { name: /勉強時間/ });

  await studyMinutesHeader.click();
  await expect(await getFirstColumnNames(page)).toEqual([
    "鈴木太郎",
    "鈴木七郎",
    "鈴木五郎",
    "鈴木三郎",
  ]);
  await expect(studyMinutesHeader).toContainText("▲");

  await studyMinutesHeader.click();
  await expect(await getFirstColumnNames(page)).toEqual([
    "鈴木三郎",
    "鈴木五郎",
    "鈴木七郎",
    "鈴木太郎",
  ]);
  await expect(studyMinutesHeader).toContainText("▼");

  await studyMinutesHeader.click();
  await expect(await getFirstColumnNames(page)).toEqual([
    "鈴木太郎",
    "鈴木三郎",
    "鈴木五郎",
    "鈴木七郎",
  ]);
  await expect(studyMinutesHeader).not.toContainText("▲");
  await expect(studyMinutesHeader).not.toContainText("▼");
});

test("趣味で旅行とサッカーを選ぶとOR結合で絞り込まれる", async ({ page }) => {
  await page.getByRole("checkbox", { name: "旅行" }).check();
  await page.getByRole("checkbox", { name: "サッカー" }).check();

  await expect(await getTableRowCount(page)).toBe(6);
  await expect(
    page.locator("tbody tr td:first-child", { hasText: "鈴木五郎" }),
  ).toHaveCount(0);
});

test("生徒タブで趣味と勉強言語のAND結合で絞り込まれる", async ({ page }) => {
  await page.getByRole("button", { name: "生徒のみ" }).click();
  await page.getByRole("checkbox", { name: "旅行" }).check();
  await page.getByRole("checkbox", { name: "Rails" }).check();

  await expect(await getTableRowCount(page)).toBe(2);
  await expect(page.getByRole("cell", { name: "鈴木太郎", exact: true })).toBeVisible();
  await expect(page.getByRole("cell", { name: "鈴木三郎", exact: true })).toBeVisible();
  await expect(
    page.locator("tbody tr td:first-child", { hasText: "鈴木七郎" }),
  ).toHaveCount(0);
});
