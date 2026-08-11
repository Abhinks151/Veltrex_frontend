import { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { notifyError } from '@/shared/utils/toasterUtils';
import type { CloseTicketModalProps } from '../types/components';

export const CloseTicketModal = ({
  ticketId,
  onClose,
  onSubmit,
  actionLoading,
}: CloseTicketModalProps) => {
  const [resolutionReason, setResolutionReason] = useState('');
  const [actualDuration, setActualDuration] = useState('');

  if (!ticketId) return null;

  const handleCloseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (resolutionReason.trim().length < 5) {
      notifyError('Please write a resolution summary (at least 5 characters).');
      return;
    }

    const duration = actualDuration ? Number(actualDuration) : undefined;
    await onSubmit(ticketId, resolutionReason.trim(), duration);

    setResolutionReason('');
    setActualDuration('');
  };

  const handleCancel = () => {
    setResolutionReason('');
    setActualDuration('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-50 text-emerald-800">
          <h3 className="font-extrabold text-base flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            Finish Repair & Close Ticket
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleCloseSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Resolution Summary * (Min 5 characters)
            </label>
            <textarea
              value={resolutionReason}
              onChange={(e) => setResolutionReason(e.target.value)}
              rows={4}
              placeholder="Explain the cause, parts replaced, and test results..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors font-medium text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
              Actual Duration (Minutes)
            </label>
            <input
              type="number"
              value={actualDuration}
              onChange={(e) => setActualDuration(e.target.value)}
              placeholder="Actual minutes spent repairing"
              min="1"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors font-medium text-gray-800"
            />
          </div>

          <div className="flex gap-3 justify-end pt-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="rounded-xl border border-gray-200 text-xs px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={actionLoading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs px-5 font-bold shadow-md hover:shadow-lg transition-all"
            >
              {actionLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Record Closure'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
