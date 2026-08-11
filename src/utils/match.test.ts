import { describe, expect, it } from "vitest";
import type { Mentor, Student, User } from "../types";
import { getAvailableMentors, getAvailableStudents } from "./match";

const student: Student = {
  id: "student-1",
  name: "テスト生徒",
  role: "student",
  email: "student@example.com",
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

const mentorInRange: Mentor = {
  id: "mentor-1",
  name: "範囲内メンター",
  role: "mentor",
  email: "mentor1@example.com",
  age: 30,
  postCode: "100-0002",
  phone: "0123456780",
  hobbies: ["旅行"],
  url: "",
  experienceDays: 1000,
  useLangs: ["TypeScript"],
  availableStartCode: 101,
  availableEndCode: 200,
};

const mentorOutOfRange: Mentor = {
  ...mentorInRange,
  id: "mentor-2",
  name: "範囲外メンター",
  email: "mentor2@example.com",
  availableStartCode: 300,
  availableEndCode: 400,
};

const allUsers: User[] = [student, mentorInRange, mentorOutOfRange];

describe("getAvailableMentors", () => {
  it("課題番号が担当範囲内ならメンター名が返る", () => {
    expect(getAvailableMentors(student, allUsers)).toEqual(["範囲内メンター"]);
  });

  it("どのメンターの担当範囲にも入らない課題番号なら空配列が返る", () => {
    const studentWithoutMentor: Student = { ...student, taskCode: 999 };

    expect(getAvailableMentors(studentWithoutMentor, allUsers)).toEqual([]);
  });

  it("境界値：課題番号が担当開始番号（101）と同じでも、メンターに含まれる", () => {
    const studentAtStart: Student = { ...student, taskCode: 101 };

    expect(getAvailableMentors(studentAtStart, allUsers)).toContain(
      "範囲内メンター",
    );
  });

  it("境界値：課題番号が担当終了番号（200）と同じでも、メンターに含まれる", () => {
    const studentAtEnd: Student = { ...student, taskCode: 200 };

    expect(getAvailableMentors(studentAtEnd, allUsers)).toContain(
      "範囲内メンター",
    );
  });
});

describe("getAvailableStudents", () => {
  it("担当範囲内の課題番号を持つ生徒名が返る", () => {
    expect(getAvailableStudents(mentorInRange, allUsers)).toEqual([
      "テスト生徒",
    ]);
  });

  it("担当範囲内の生徒がいなければ空配列が返る", () => {
    const mentorWithNoStudents: Mentor = {
      ...mentorInRange,
      availableStartCode: 500,
      availableEndCode: 600,
    };

    expect(getAvailableStudents(mentorWithNoStudents, allUsers)).toEqual([]);
  });
});
