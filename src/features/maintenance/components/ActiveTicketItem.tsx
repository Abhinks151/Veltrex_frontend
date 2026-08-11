import { MapPin, Clock, User, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { ActiveTicketItemProps } from '../types/components';

export const ActiveTicketItem = ({
  ticket: t,
  actionLoading,
  onRelease,
  onClose,
}: ActiveTicketItemProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {t.machine?.name} ({t.machine?.brand})
          </span>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
            IN PROGRESS
          </span>
        </div>

        <h3 className="font-bold text-gray-800 text-base leading-snug">
          {t.issue}
        </h3>

        {t.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
            {t.description}
          </p>
        )}

        <div className="h-px bg-gray-50 pt-2" />

        <div className="flex flex-col gap-1.5 text-xs text-gray-400 font-medium">
          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-gray-300" />
            Reported:{' '}
            {new Date(t.reportedAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {t.assignedAt && (
            <span className="flex items-center gap-1.5 text-amber-600 font-medium">
              Started:{' '}
              {new Date(t.assignedAt).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          )}
          {t.estimatedDurationMinutes && (
            <span className="flex items-center gap-1.5 text-gray-400 font-semibold bg-gray-50 px-2 py-0.5 rounded-md w-fit">
              Est. Duration: {t.estimatedDurationMinutes} mins
            </span>
          )}
          <span className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-md px-2 py-0.5 w-fit">
            <User className="h-3.5 w-3.5" />
            By: {t.creator?.name}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <Button
          onClick={() => onRelease(t.id)}
          disabled={actionLoading}
          variant="secondary"
          className="rounded-xl py-2 font-bold text-xs flex items-center justify-center gap-1.5 border border-gray-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Release
        </Button>
        <Button
          onClick={() => onClose(t.id)}
          disabled={actionLoading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-2 font-bold text-xs flex items-center justify-center gap-1.5"
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Close Ticket
        </Button>
      </div>
    </div>
  );
};
