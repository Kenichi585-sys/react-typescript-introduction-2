import type { Page } from "@playwright/test";

type StudentFormInput = {
  name: string;
  email: string;
  age: string;
  postCode: string;
  phone: string;
  studyMinutes: string;
  taskCode: string;
  studyLang: string;
  score: string;
};

type MentorFormInput = {
  name: string;
  email: string;
  age: string;
  postCode: string;
  phone: string;
  experienceDays: string;
  useLang: string;
  availableStartCode: string;
  availableEndCode: string;
};

const fillCommonFields = async (
  page: Page,
  input: Pick<
    StudentFormInput,
    "name" | "email" | "age" | "postCode" | "phone"
  >,
): Promise<void> => {
  await page.getByLabel("名前（必須）").fill(input.name);
  await page.getByLabel("メールアドレス（必須）").fill(input.email);
  await page.getByLabel("年齢（必須）").fill(input.age);
  await page.getByLabel("郵便番号（必須）").fill(input.postCode);
  await page.getByLabel("電話番号（必須）").fill(input.phone);
};

export const fillStudentForm = async (
  page: Page,
  input: StudentFormInput,
): Promise<void> => {
  await fillCommonFields(page, input);
  await page.getByLabel("勉強時間（必須）").fill(input.studyMinutes);
  await page.getByLabel("課題番号（必須）").fill(input.taskCode);
  await page
    .getByRole("group", { name: "勉強中の言語（必須）" })
    .getByRole("textbox")
    .fill(input.studyLang);
  await page.getByLabel("ハピネススコア（必須）").fill(input.score);
};

export const fillMentorForm = async (
  page: Page,
  input: MentorFormInput,
): Promise<void> => {
  await fillCommonFields(page, input);
  await page.getByLabel("実務経験月数（必須）").fill(input.experienceDays);
  await page
    .getByRole("group", { name: "現場で使っている言語（必須）" })
    .getByRole("textbox")
    .fill(input.useLang);
  await page
    .getByLabel("担当できる課題番号初め（必須）")
    .fill(input.availableStartCode);
  await page
    .getByLabel("担当できる課題番号終わり（必須）")
    .fill(input.availableEndCode);
};

export const defaultStudentInput = (): StudentFormInput => ({
  name: "E2Eテスト生徒",
  email: "e2e-student@example.com",
  age: "20",
  postCode: "100-0001",
  phone: "0123456789",
  studyMinutes: "1000",
  taskCode: "101",
  studyLang: "TypeScript",
  score: "80",
});

export const defaultMentorInput = (): MentorFormInput => ({
  name: "E2Eテストメンター",
  email: "e2e-mentor@example.com",
  age: "30",
  postCode: "100-0002",
  phone: "0123456780",
  experienceDays: "1000",
  useLang: "Go",
  availableStartCode: "101",
  availableEndCode: "200",
});
