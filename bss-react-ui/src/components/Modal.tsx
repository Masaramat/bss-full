import React from 'react';
import CircularProgress from "@mui/material/CircularProgress";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (e: never) => void;
  title: string;
  confirmText: string;
  confirmColor: string;
  loading: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onConfirm, title, confirmText, confirmColor, loading, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3 p-5">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        <div className="flex justify-end">
          <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2 w-1/2" onClick={onClose}>
            Cancel
          </button>
          <button className={`${confirmColor} text-white px-4 py-2 rounded w-1/2`} onClick={onConfirm}>
            {loading ? <CircularProgress size={18} color={"inherit"}/> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
