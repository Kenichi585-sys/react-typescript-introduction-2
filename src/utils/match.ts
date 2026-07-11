import {
  isMentor,
  isStudent,
  type Mentor,
  type Student,
  type User,
} from "../types";

export const getAvailableMentors = (
  student: Student,
  allUsers: User[],
): string[] => {
  return allUsers
    .filter(
      (user): user is Mentor =>
        isMentor(user) &&
        student.taskCode >= user.availableStartCode &&
        student.taskCode <= user.availableEndCode,
    )
    .map((mentor) => mentor.name);
};

export const getAvailableStudents = (
  mentor: Mentor,
  allUsers: User[],
): string[] => {
  return allUsers
    .filter(
      (user): user is Student =>
        isStudent(user) &&
        user.taskCode >= mentor.availableStartCode &&
        user.taskCode <= mentor.availableEndCode,
    )
    .map((student) => student.name);
};
