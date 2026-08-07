import { Clock, FileText, User, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { MaintenanceTicket } from '../types';

const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-700 border-blue-200',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 border-amber-200',
  CLOSED: 'bg-green-100 text-green-700 border-green-200',
};

interface TicketListProps {
  tickets: MaintenanceTicket[];
  onDelete: (id: string) => void;
}

const TicketList = ({ tickets, onDelete }: TicketListProps) => {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl p-16 text-center text-gray-400">
        <FileText className="h-12 w-12 text-gray-300 mb-3" />
        <p className="font-semibold">No maintenance tickets reported yet</p>
        <p className="text-xs text-gray-400 mt-1 max-w-[280px]">
          Any issues you report will show up here to track progress.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="p-5 border border-gray-100 rounded-2xl hover:bg-gray-50/50 hover:border-gray-200 transition-all shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-gray-900 font-sans text-sm">
                  {ticket.machine?.name || 'Unknown'} ({ticket.machine?.brand})
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors[ticket.status]}`}
                >
                  {ticket.status.replace('_', ' ')}
                </span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(ticket.id)}
                >
                  Delete
                </Button>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">
                {ticket.issue}
              </h3>
              {ticket.description && (
                <p className="text-sm text-gray-500 whitespace-pre-wrap break-words leading-relaxed max-w-xl">
                  {ticket.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-400 pt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gray-300" />
                  Reported:{' '}
                  {new Date(ticket.reportedAt).toLocaleString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                {ticket.estimatedDurationMinutes && (
                  <span className="flex items-center gap-1.5 text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                    Est: {ticket.estimatedDurationMinutes} mins
                  </span>
                )}
                {ticket.actualDurationMinutes && (
                  <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Actual: {ticket.actualDurationMinutes} mins
                  </span>
                )}
              </div>
            </div>

            {/* Status detail panel */}
            <div className="flex flex-col gap-2 shrink-0 sm:text-right">
              {ticket.status === 'IN_PROGRESS' && ticket.assignee && (
                <div className="text-xs bg-amber-50 text-amber-700 px-3 py-2 rounded-xl border border-amber-100 flex items-center sm:justify-end gap-1.5 font-medium">
                  <User className="h-3.5 w-3.5" />
                  <span>
                    Assigned to: <strong>{ticket.assignee.name}</strong>
                  </span>
                </div>
              )}
              {ticket.status === 'CLOSED' && (
                <div className="text-xs bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl border border-emerald-100 flex flex-col sm:items-end gap-1 font-medium">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    <span>
                      Resolved by: <strong>{ticket.resolver?.name}</strong>
                    </span>
                  </div>
                  {ticket.reason && (
                    <span
                      className="text-[10px] text-gray-500 font-normal italic mt-1 max-w-[200px] truncate block"
                      title={ticket.reason}
                    >
                      "{ticket.reason}"
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketList;
