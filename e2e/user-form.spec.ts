import { expect, test } from "@playwright/test";
import {
  defaultMentorInput,
  defaultStudentInput,
  fillMentorForm,
  fillStudentForm,
} from "./helpers/form";
import { getTableRowCount } from "./helpers/table";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("名前空のまま作成するとエラーが表示されモーダルが閉じない", async ({
  page,
}) => {
  await page.getByRole("button", { name: "新規作成" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.getByRole("dialog").getByRole("button", { name: "作成" }).click();

  await expect(page.getByText("名前を入力してください")).toBeVisible();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(await getTableRowCount(page)).toBe(8);
});

test("合法な生徒データで作成すると全員タブに追加される", async ({ page }) => {
  await page.getByRole("button", { name: "新規作成" }).click();
  await fillStudentForm(page, defaultStudentInput());
  await page.getByRole("dialog").getByRole("button", { name: "作成" }).click();

  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "全員" })).toHaveClass(
    /is-active/,
  );
  await expect(page.getByRole("cell", { name: "E2Eテスト生徒", exact: true })).toBeVisible();
  await expect(await getTableRowCount(page)).toBe(9);
});

test("合法なメンターデータで作成すると全員タブに追加される", async ({
  page,
}) => {
  await page.getByRole("button", { name: "新規作成" }).click();
  await page.getByRole("radio", { name: "メンター" }).check();
  await fillMentorForm(page, defaultMentorInput());
  await page.getByRole("dialog").getByRole("button", { name: "作成" }).click();

  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("cell", { name: "E2Eテストメンター", exact: true })).toBeVisible();

  const mentorRow = page.locator("tbody tr", {
    has: page.getByRole("cell", { name: "E2Eテストメンター", exact: true }),
  });
  await expect(mentorRow).toContainText("mentor");
  await expect(await getTableRowCount(page)).toBe(9);
});
