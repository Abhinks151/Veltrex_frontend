import { MapPin, Clock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { OpenTicketItemProps } from '../types/components';

export const OpenTicketItem = ({
  ticket: t,
  actionLoading,
  onAssign,
}: OpenTicketItemProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {t.machine?.name} ({t.machine?.brand})
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            OPEN UNIT
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

      <Button
        onClick={() => onAssign(t.id)}
        disabled={actionLoading}
        className="w-full mt-5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl py-2 font-bold shadow-sm flex items-center justify-center gap-2"
      >
        <span>Accept Job</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
