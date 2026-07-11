import type { User } from "../types";
import { UserForm } from "./UserForm";

type UserFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: User) => void;
};

export const UserFormModal = ({
  isOpen,
  onClose,
  onSubmit,
}: UserFormModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
      >
        <UserForm onSubmit={onSubmit} onCancel={onClose} />
      </div>
    </div>
  );
};
