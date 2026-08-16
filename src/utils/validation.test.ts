import { describe, expect, it } from "vitest";
import type { ListFieldItem, MentorFormState, StudentFormState } from "../types";
import { validateUserForm } from "./validation";

const listItem = (value: string, id = "item-1"): ListFieldItem => ({ id, value });

const validStudent = (): StudentFormState => ({
  role: "student",
  name: "テスト生徒",
  email: "test@example.com",
  age: "20",
  postCode: "100-0001",
  phone: "0123456789",
  hobbies: [],
  url: "",
  studyMinutes: "1000",
  taskCode: "101",
  studyLangs: [listItem("TypeScript")],
  score: "80",
});

const validMentor = (): MentorFormState => ({
  role: "mentor",
  name: "テストメンター",
  email: "mentor@example.com",
  age: "30",
  postCode: "100-0002",
  phone: "0123456780",
  hobbies: [],
  url: "",
  experienceDays: "1000",
  useLangs: [listItem("Go")],
  availableStartCode: "101",
  availableEndCode: "200",
});

describe("validateUserForm", () => {
  it("正しい生徒フォームならエラーは空", () => {
    expect(validateUserForm(validStudent())).toEqual({});
  });

  it("正しいメンターフォームならエラーは空", () => {
    expect(validateUserForm(validMentor())).toEqual({});
  });

  it("名前が空なら名前のエラーメッセージが返る", () => {
    const form = { ...validStudent(), name: "" };

    expect(validateUserForm(form).name).toBe("名前を入力してください");
  });

  it("ハピネススコアが0と100ならエラーは空", () => {
    expect(validateUserForm({ ...validStudent(), score: "0" })).toEqual({});
    expect(validateUserForm({ ...validStudent(), score: "100" })).toEqual({});
  });

  it("ハピネススコアが101なら範囲外エラーが返る", () => {
    const form = { ...validStudent(), score: "101" };

    expect(validateUserForm(form).score).toBe("0〜100の範囲で入力してください");
  });

  it("ハピネススコアが未入力なら入力を促すエラーが返る", () => {
    const form = { ...validStudent(), score: "" };

    expect(validateUserForm(form).score).toBe(
      "ハピネススコアを入力してください",
    );
  });

  it("メールアドレスに@がなければ形式エラーが返る", () => {
    const form = { ...validStudent(), email: "invalid.example.com" };

    expect(validateUserForm(form).email).toBe(
      "メールアドレスの形式が正しくありません",
    );
  });

  it("課題番号が0なら1以上を促すエラーが返る", () => {
    const form = { ...validStudent(), taskCode: "0" };

    expect(validateUserForm(form).taskCode).toBe("1以上の数を入力してください");
  });

  it("URLがhttpまたはhttpsで始まらなければ形式エラーが返る", () => {
    const form = { ...validStudent(), url: "example.com" };

    expect(validateUserForm(form).url).toBe(
      "URLは http:// または https:// で始めてください",
    );
  });

  it("担当終了番号が開始番号より小さいとエラーが返る", () => {
    const form = {
      ...validMentor(),
      availableStartCode: "200",
      availableEndCode: "101",
    };

    expect(validateUserForm(form).availableEndCode).toBe(
      "開始番号以上の値を入力してください",
    );
  });

  it("勉強中の言語に空行があれば入力を促すエラーが返る", () => {
    const form = {
      ...validStudent(),
      studyLangs: [listItem("TypeScript"), listItem("")],
    };

    expect(validateUserForm(form).studyLangs).toBe(
      "空の行を削除するか、言語を入力してください",
    );
  });

  it("勉強中の言語が1つも入力されていなければエラーが返る", () => {
    const form = {
      ...validStudent(),
      studyLangs: [listItem(""), listItem("")],
    };

    expect(validateUserForm(form).studyLangs).toBe(
      "勉強中の言語を1つ以上入力してください",
    );
  });

  it("現場で使っている言語が1つも入力されていなければエラーが返る", () => {
    const form = {
      ...validMentor(),
      useLangs: [listItem("")],
    };

    expect(validateUserForm(form).useLangs).toBe(
      "現場で使っている言語を1つ以上入力してください",
    );
  });

  it("担当開始番号が未入力なら入力を促すエラーが返る", () => {
    const form = { ...validMentor(), availableStartCode: "" };

    expect(validateUserForm(form).availableStartCode).toBe(
      "担当課題番号（初め）を入力してください",
    );
  });

  it("担当終了番号が未入力なら入力を促すエラーが返る", () => {
    const form = { ...validMentor(), availableEndCode: "" };

    expect(validateUserForm(form).availableEndCode).toBe(
      "担当課題番号（終わり）を入力してください",
    );
  });

  it("現場で使っている言語に空行があれば入力を促すエラーが返る", () => {
    const form = {
      ...validMentor(),
      useLangs: [listItem("Go"), listItem("")],
    };

    expect(validateUserForm(form).useLangs).toBe(
      "空の行を削除するか、言語を入力してください",
    );
  });
});
