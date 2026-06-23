import {
  isMentor,
  isStudent,
  type Mentor,
  type Student,
  type Tab,
  type User,
  type SortKey,
  type SortState,
} from "../types";
import { TableHeader } from "./TableHeader";
import {
  getColumnsForTab,
  type ColumnDef,
  type ColumnKey,
} from "./tableColumns";

type UserTableProps = {
  users: User[];
  activeTab: Tab;
  sortState: SortState;
  onSortClick: (key: SortKey) => void;
};

const EMPTY_OPTIONAL = "—";

const formatStringList = (items: string[]): string => {
  if (items.length === 0) {
    return EMPTY_OPTIONAL;
  }
  return items.join(", ");
};

const formatOptionalString = (value: string): string => {
  if (value === "") {
    return EMPTY_OPTIONAL;
  }
  return value;
};

const isColumnApplicable = (user: User, column: ColumnDef, activeTab: Tab): boolean => {
  if (activeTab !== "all") {
    return true;
  }
  if (column.role === "student") {
    return isStudent(user);
  }
  if (column.role === "mentor") {
    return isMentor(user);
  }
  return true;
};

const getStudentCellValue = (
  user: Student,
  key: ColumnKey,
): string => {
  switch (key) {
    case "studyMinutes":
      return String(user.studyMinutes);
    case "taskCode":
      return String(user.taskCode);
    case "studyLangs":
      return formatStringList(user.studyLangs);
    case "score":
      return String(user.score);
    case "availableMentors":
      // ステップ7で utils/match.ts と連携
      return EMPTY_OPTIONAL;
    default:
      return "";
  }
};

const getMentorCellValue = (user: Mentor, key: ColumnKey): string => {
  switch (key) {
    case "experienceDays":
      return String(user.experienceDays);
    case "useLangs":
      return formatStringList(user.useLangs);
    case "availableStartCode":
      return String(user.availableStartCode);
    case "availableEndCode":
      return String(user.availableEndCode);
    case "availableStudents":
      // ステップ7で utils/match.ts と連携
      return EMPTY_OPTIONAL;
    default:
      return "";
  }
};

const getCommonCellValue = (user: User, key: ColumnKey): string => {
  switch (key) {
    case "name":
      return user.name;
    case "role":
      return user.role;
    case "email":
      return user.email;
    case "age":
      return String(user.age);
    case "postCode":
      return user.postCode;
    case "phone":
      return user.phone;
    case "hobbies":
      return formatStringList(user.hobbies);
    case "url":
      return formatOptionalString(user.url);
    default:
      return "";
  }
};

const getCellValue = (user: User, column: ColumnDef, activeTab: Tab): string => {
  if (!isColumnApplicable(user, column, activeTab)) {
    return "";
  }

  if (column.role === "common") {
    return getCommonCellValue(user, column.key);
  }

  if (column.role === "student" && isStudent(user)) {
    return getStudentCellValue(user, column.key);
  }

  if (column.role === "mentor" && isMentor(user)) {
    return getMentorCellValue(user, column.key);
  }

  return "";
};

export const UserTable = ({
  users,
  activeTab,
  sortState,
  onSortClick,
}: UserTableProps) => {
  const columns = getColumnsForTab(activeTab);

  return (
    <div className="user-table-wrapper">
      <table className="user-table">
        <TableHeader
          activeTab={activeTab}
          sortState={sortState}
          onSortClick={onSortClick}
        />
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              {columns.map((column) => (
                <td key={column.key}>
                  {getCellValue(user, column, activeTab)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
