import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  businessName: string;
}

const DeleteConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  businessName,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-100 p-4 backdrop-blur-sm">
      <div className="bg-[#1A1A1A] rounded-[30px] p-8 max-w-md w-full border border-white/10 relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-6">
            <AlertTriangle size={32} />
          </div>

          <h2 className="text-2xl font-light text-white mb-2">
            Delete Business?
          </h2>
          <p className="text-white/60 text-sm mb-8 leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="text-white font-medium">"{businessName}"</span>?
            This action cannot be undone and will remove all associated data.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-4 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-4 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
