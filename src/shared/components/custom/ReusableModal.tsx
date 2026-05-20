import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  showFooter?: boolean;
  onSubmit?: () => void;
  submitText?: string;
  loading?: boolean;
  maxWidth?: string;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  showFooter = false,
  onSubmit,
  submitText = 'Submit',
  loading = false,
  maxWidth = 'max-w-md',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${maxWidth} overflow-hidden transform transition-all animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(100vh-200px)]">
          {children}
        </div>

        {/* Footer */}
        {showFooter && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="px-6"
            >
              Cancel
            </Button>
            {onSubmit && (
              <Button
                type="button"
                variant="primary"
                onClick={onSubmit}
                disabled={loading}
                className="px-6 min-w-[100px]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  submitText
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReusableModal;
