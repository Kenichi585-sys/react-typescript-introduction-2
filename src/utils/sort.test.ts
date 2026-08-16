import { describe, expect, it } from "vitest";
import type { Mentor, Student, User } from "../types";
import { applySort } from "./sort";

const studentLow: Student = {
  id: "student-low",
  name: "生徒・勉強時間少",
  role: "student",
  email: "low@example.com",
  age: 20,
  postCode: "100-0001",
  phone: "0123456789",
  hobbies: [],
  url: "",
  studyMinutes: 1000,
  taskCode: 101,
  studyLangs: ["TypeScript"],
  score: 70,
};

const studentHigh: Student = {
  id: "student-high",
  name: "生徒・勉強時間多",
  role: "student",
  email: "high@example.com",
  age: 22,
  postCode: "100-0002",
  phone: "0123456780",
  hobbies: [],
  url: "",
  studyMinutes: 5000,
  taskCode: 102,
  studyLangs: ["TypeScript"],
  score: 90,
};

const mentorLow: Mentor = {
  id: "mentor-low",
  name: "メンター・経験少",
  role: "mentor",
  email: "mentor-low@example.com",
  age: 30,
  postCode: "100-0003",
  phone: "0123456781",
  hobbies: [],
  url: "",
  experienceDays: 500,
  useLangs: ["TypeScript"],
  availableStartCode: 101,
  availableEndCode: 200,
};

const mentorHigh: Mentor = {
  id: "mentor-high",
  name: "メンター・経験多",
  role: "mentor",
  email: "mentor-high@example.com",
  age: 35,
  postCode: "100-0004",
  phone: "0123456782",
  hobbies: [],
  url: "",
  experienceDays: 3000,
  useLangs: ["TypeScript"],
  availableStartCode: 101,
  availableEndCode: 200,
};

const usersInFixedOrder: User[] = [
  studentHigh,
  mentorLow,
  studentLow,
  mentorHigh,
];

const namesOf = (users: User[]): string[] => users.map((user) => user.name);

describe("applySort", () => {
  it("ソート未指定なら元の順序のまま返る", () => {
    expect(applySort(usersInFixedOrder, null)).toEqual(usersInFixedOrder);
  });

  it("勉強時間の昇順で並ぶ", () => {
    expect(
      namesOf(
        applySort(usersInFixedOrder, {
          key: "studyMinutes",
          direction: "asc",
        }),
      ),
    ).toEqual([
      "メンター・経験少",
      "メンター・経験多",
      "生徒・勉強時間少",
      "生徒・勉強時間多",
    ]);
  });

  it("勉強時間の降順で並ぶ", () => {
    expect(
      namesOf(
        applySort(usersInFixedOrder, {
          key: "studyMinutes",
          direction: "desc",
        }),
      ),
    ).toEqual([
      "生徒・勉強時間多",
      "生徒・勉強時間少",
      "メンター・経験少",
      "メンター・経験多",
    ]);
  });

  it("ハピネススコアの昇順で並ぶ", () => {
    expect(
      namesOf(
        applySort([studentHigh, studentLow], {
          key: "score",
          direction: "asc",
        }),
      ),
    ).toEqual(["生徒・勉強時間少", "生徒・勉強時間多"]);
  });

  it("実務経験月数の昇順で並ぶ", () => {
    expect(
      namesOf(
        applySort(usersInFixedOrder, {
          key: "experienceDays",
          direction: "asc",
        }),
      ),
    ).toEqual([
      "生徒・勉強時間多",
      "生徒・勉強時間少",
      "メンター・経験少",
      "メンター・経験多",
    ]);
  });

  it("applySort を呼んでも渡した配列の順序は保たれることの確認", () => {
    const original = [...usersInFixedOrder];

    applySort(usersInFixedOrder, {
      key: "studyMinutes",
      direction: "asc",
    });

    expect(usersInFixedOrder).toEqual(original);
  });
});
