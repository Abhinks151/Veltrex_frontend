import { AlertTriangle, PlusCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import type { MachinistMachine } from '../types';

interface ReportFormProps {
  machines: MachinistMachine[];
  machineId: string;
  issue: string;
  description: string;
  estimatedDuration: string;
  actionLoading: boolean;
  onMachineChange: (value: string) => void;
  onIssueChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onEstimatedDurationChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ReportForm = ({
  machines,
  machineId,
  issue,
  description,
  estimatedDuration,
  actionLoading,
  onMachineChange,
  onIssueChange,
  onDescriptionChange,
  onEstimatedDurationChange,
  onSubmit,
}: ReportFormProps) => {
  return (
    <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit">
      <div className="p-5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white flex items-center gap-2">
        <PlusCircle className="h-5 w-5" />
        <h2 className="font-bold text-lg">Report Malfunction</h2>
      </div>
      <form onSubmit={onSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
            Machine *
          </label>
          {machines.length === 0 ? (
            <div className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                No machines currently assigned via shift jobs. You cannot file
                maintenance tickets.
              </span>
            </div>
          ) : (
            <select
              value={machineId}
              onChange={(e) => onMachineChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors bg-white font-medium text-gray-800"
              required
            >
              <option value="">Select Machine</option>
              {machines.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.brand}) - {m.status}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
            Issue Summary *
          </label>
          <input
            type="text"
            value={issue}
            onChange={(e) => onIssueChange(e.target.value)}
            placeholder="e.g., Coolant leak, Spindle vibration"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors font-medium text-gray-800"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
            Detailed Description
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={4}
            placeholder="Describe what happened, error codes displayed, etc."
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors font-medium text-gray-800 whitespace-pre-wrap"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
            Est. Duration (Minutes)
          </label>
          <input
            type="number"
            value={estimatedDuration}
            onChange={(e) => onEstimatedDurationChange(e.target.value)}
            placeholder="Optional"
            min="1"
            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors font-medium text-gray-800"
          />
        </div>

        <Button
          type="submit"
          disabled={actionLoading || machines.length === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 font-bold shadow-md hover:shadow-lg transition-all"
        >
          {actionLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            'Submit Ticket'
          )}
        </Button>
      </form>
    </div>
  );
};

export default ReportForm;
