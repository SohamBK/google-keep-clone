import React, { type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
      onClick={onClose} // Allows clicking the backdrop to close the modal (best practice)
    >
      <div
        className="max-w-xl w-full p-6 bg-white rounded-lg shadow-2xl relative" // <-- PADDING ADDED HERE
        onClick={(e) => e.stopPropagation()} // Prevents clicks inside the modal from closing it
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
