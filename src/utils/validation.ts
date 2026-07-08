import type {
  ListFieldItem,
  MentorFormState,
  StudentFormState,
  UserFormBase,
  UserFormState,
} from "../types";

export type UserFormErrorKey =
  | keyof UserFormBase
  | keyof Omit<StudentFormState, keyof UserFormBase | "role">
  | keyof Omit<MentorFormState, keyof UserFormBase | "role">;

export type UserFormErrors = Partial<Record<UserFormErrorKey, string>>;

const isNonNegativeInteger = (value: string): boolean => {
  if (value === "") {
    return false;
  }
  const num = Number(value);
  return Number.isInteger(num) && num >= 0;
};

const isPositiveInteger = (value: string): boolean => {
  if (value === "") {
    return false;
  }
  const num = Number(value);
  return Number.isInteger(num) && num >= 1;
};

const isScoreInteger = (value: string): boolean => {
  if (value === "") {
    return false;
  }
  const num = Number(value);
  return Number.isInteger(num) && num >= 0 && num <= 100;
};

const hasEmptyListItem = (items: ListFieldItem[]): boolean =>
  items.some((item) => item.value === "");

const hasNonEmptyListItem = (items: ListFieldItem[]): boolean =>
  items.some((item) => item.value !== "");

const validateCommonFields = (
  form: UserFormBase,
  errors: UserFormErrors,
): void => {
  if (form.name.trim() === "") {
    errors.name = "名前を入力してください";
  }

  if (form.email.trim() === "") {
    errors.email = "メールアドレスを入力してください";
  } else if (!form.email.includes("@")) {
    errors.email = "メールアドレスの形式が正しくありません";
  }

  if (form.age === "") {
    errors.age = "年齢を入力してください";
  } else if (!isNonNegativeInteger(form.age)) {
    errors.age = "0以上の数を入力してください";
  }

  if (form.postCode === "") {
    errors.postCode = "郵便番号を入力してください";
  } else if (!/^\d{3}-\d{4}$/.test(form.postCode)) {
    errors.postCode = "郵便番号は NNN-NNNN 形式で入力してください";
  }

  if (form.phone === "") {
    errors.phone = "電話番号を入力してください";
  } else if (!/^\d{10,11}$/.test(form.phone)) {
    errors.phone = "電話番号は10〜11桁の数字で入力してください";
  }

  if (
    form.url !== "" &&
    !form.url.startsWith("http://") &&
    !form.url.startsWith("https://")
  ) {
    errors.url = "URLは http:// または https:// で始めてください";
  }
};

const validateStudentFields = (
  form: StudentFormState,
  errors: UserFormErrors,
): void => {
  if (form.studyMinutes === "") {
    errors.studyMinutes = "勉強時間を入力してください";
  } else if (!isNonNegativeInteger(form.studyMinutes)) {
    errors.studyMinutes = "0以上の数を入力してください";
  }

  if (form.taskCode === "") {
    errors.taskCode = "課題番号を入力してください";
  } else if (!isPositiveInteger(form.taskCode)) {
    errors.taskCode = "1以上の数を入力してください";
  }

  if (!hasNonEmptyListItem(form.studyLangs)) {
    errors.studyLangs = "勉強中の言語を1つ以上入力してください";
  } else if (hasEmptyListItem(form.studyLangs)) {
    errors.studyLangs = "空の行を削除するか、言語を入力してください";
  }

  if (form.score === "") {
    errors.score = "ハピネススコアを入力してください";
  } else if (!isScoreInteger(form.score)) {
    errors.score = "0〜100の範囲で入力してください";
  }
};

const validateMentorFields = (
  form: MentorFormState,
  errors: UserFormErrors,
): void => {
  if (form.experienceDays === "") {
    errors.experienceDays = "実務経験月数を入力してください";
  } else if (!isNonNegativeInteger(form.experienceDays)) {
    errors.experienceDays = "0以上の数を入力してください";
  }

  if (!hasNonEmptyListItem(form.useLangs)) {
    errors.useLangs = "現場で使っている言語を1つ以上入力してください";
  } else if (hasEmptyListItem(form.useLangs)) {
    errors.useLangs = "空の行を削除するか、言語を入力してください";
  }

  if (form.availableStartCode === "") {
    errors.availableStartCode = "担当課題番号（初め）を入力してください";
  } else if (!isPositiveInteger(form.availableStartCode)) {
    errors.availableStartCode = "1以上の数を入力してください";
  }

  if (form.availableEndCode === "") {
    errors.availableEndCode = "担当課題番号（終わり）を入力してください";
  } else if (!isPositiveInteger(form.availableEndCode)) {
    errors.availableEndCode = "1以上の数を入力してください";
  } else if (
    isPositiveInteger(form.availableStartCode) &&
    Number(form.availableEndCode) < Number(form.availableStartCode)
  ) {
    errors.availableEndCode = "開始番号以上の値を入力してください";
  }
};

export const validateUserForm = (form: UserFormState): UserFormErrors => {
  const errors: UserFormErrors = {};

  validateCommonFields(form, errors);

  if (form.role === "student") {
    validateStudentFields(form, errors);
  } else {
    validateMentorFields(form, errors);
  }

  return errors;
};
