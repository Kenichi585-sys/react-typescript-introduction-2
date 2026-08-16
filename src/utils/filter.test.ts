import { describe, expect, it } from "vitest";
import type { FilterState, Mentor, Student, User } from "../types";
import { applyFilter, collectFilterOptions } from "./filter";

const EMPTY_FILTER: FilterState = {
  hobbies: [],
  studyLangs: [],
  useLangs: [],
};

const studentBookTypeScript: Student = {
  id: "student-book-ts",
  name: "生徒・読書TypeScript",
  role: "student",
  email: "book-ts@example.com",
  age: 20,
  postCode: "100-0001",
  phone: "0123456789",
  hobbies: ["読書"],
  url: "",
  studyMinutes: 1000,
  taskCode: 101,
  studyLangs: ["TypeScript"],
  score: 80,
};

const studentTravelPython: Student = {
  id: "student-travel-py",
  name: "生徒・旅行Python",
  role: "student",
  email: "travel-py@example.com",
  age: 21,
  postCode: "100-0002",
  phone: "0123456780",
  hobbies: ["旅行"],
  url: "",
  studyMinutes: 2000,
  taskCode: 102,
  studyLangs: ["Python"],
  score: 85,
};

const mentorBookGo: Mentor = {
  id: "mentor-book-go",
  name: "メンター・読書Go",
  role: "mentor",
  email: "book-go@example.com",
  age: 30,
  postCode: "100-0003",
  phone: "0123456781",
  hobbies: ["読書"],
  url: "",
  experienceDays: 1000,
  useLangs: ["Go"],
  availableStartCode: 101,
  availableEndCode: 200,
};

const mentorTravelTypeScript: Mentor = {
  id: "mentor-travel-ts",
  name: "メンター・旅行TypeScript",
  role: "mentor",
  email: "travel-ts@example.com",
  age: 35,
  postCode: "100-0004",
  phone: "0123456782",
  hobbies: ["旅行"],
  url: "",
  experienceDays: 2000,
  useLangs: ["TypeScript"],
  availableStartCode: 101,
  availableEndCode: 200,
};

const allUsers: User[] = [
  studentBookTypeScript,
  studentTravelPython,
  mentorBookGo,
  mentorTravelTypeScript,
];

const namesOf = (users: User[]): string[] => users.map((user) => user.name);

describe("applyFilter", () => {
  it("フィルタ未選択なら全員残る", () => {
    expect(namesOf(applyFilter(allUsers, EMPTY_FILTER, "all"))).toEqual([
      "生徒・読書TypeScript",
      "生徒・旅行Python",
      "メンター・読書Go",
      "メンター・旅行TypeScript",
    ]);
  });

  it("趣味で1つ選ぶと該当ユーザーのみ残る", () => {
    expect(
      namesOf(
        applyFilter(allUsers, { ...EMPTY_FILTER, hobbies: ["読書"] }, "all"),
      ),
    ).toEqual(["生徒・読書TypeScript", "メンター・読書Go"]);
  });

  it("同カテゴリ内はOR結合でどれかに該当すれば残る", () => {
    expect(
      namesOf(
        applyFilter(
          allUsers,
          { ...EMPTY_FILTER, hobbies: ["読書", "旅行"] },
          "all",
        ),
      ),
    ).toEqual([
      "生徒・読書TypeScript",
      "生徒・旅行Python",
      "メンター・読書Go",
      "メンター・旅行TypeScript",
    ]);
  });

  it("生徒タブでは趣味と勉強言語がAND結合になる", () => {
    expect(
      namesOf(
        applyFilter(
          allUsers,
          {
            ...EMPTY_FILTER,
            hobbies: ["読書"],
            studyLangs: ["TypeScript"],
          },
          "student",
        ),
      ),
    ).toEqual(["生徒・読書TypeScript"]);
  });

  it("「メンターのみ」タブで「現場で使っている言語」のチェックを入れたら、その言語を使っているメンターだけが表に残る", () => {
    expect(
      namesOf(
        applyFilter(allUsers, { ...EMPTY_FILTER, useLangs: ["Go"] }, "mentor"),
      ),
    ).toEqual(["メンター・読書Go"]);
  });
});

describe("collectFilterOptions", () => {
  it("重複を除き、昇順で選択肢を返す", () => {
    expect(collectFilterOptions(allUsers, "hobbies")).toEqual(["旅行", "読書"]);
    expect(collectFilterOptions(allUsers, "studyLangs")).toEqual([
      "Python",
      "TypeScript",
    ]);
    expect(collectFilterOptions(allUsers, "useLangs")).toEqual([
      "Go",
      "TypeScript",
    ]);
  });
});
