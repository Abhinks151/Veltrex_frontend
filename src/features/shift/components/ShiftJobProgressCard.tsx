import React, { useState } from 'react';
import { useAppDispatch } from '@/app/store/hooks';
import { updateShiftJobProgress } from '../shiftThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import type { ShiftJob } from '../types';
import { ShiftJobStatus } from '../types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { partService } from '@/services/partService';
import type { Part } from '@/features/part/types';
import {
  Eye,
  X,
  FileText,
  Layers,
  Clock,
  Lock,
  Pencil,
  Download,
} from 'lucide-react';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

interface ShiftJobProgressCardProps {
  job: ShiftJob;
  onUpdated?: () => void;
  shiftDate?: string;
  isAdmin?: boolean;
}

const statusColors: Record<ShiftJobStatus, string> = {
  [ShiftJobStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
  [ShiftJobStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700',
  [ShiftJobStatus.COMPLETED]: 'bg-green-100 text-green-700',
};

function isPastShift(dateStr?: string): boolean {
  if (!dateStr) return false;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const shiftDay = new Date(dateStr);
  shiftDay.setUTCHours(0, 0, 0, 0);
  return shiftDay < today;
}

const ShiftJobProgressCard: React.FC<ShiftJobProgressCardProps> = ({
  job,
  onUpdated,
  shiftDate,
  isAdmin = false,
}) => {
  const dispatch = useAppDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [incrementQty, setIncrementQty] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const [partDetails, setPartDetails] = useState<Part | null>(null);
  const [partLoading, setPartLoading] = useState(false);
  const [showPartModal, setShowPartModal] = useState(false);

  const remaining = Math.max(0, job.assignedQuantity - job.completedQuantity);
  const progressPct = Math.min(
    100,
    Math.round((job.completedQuantity / job.assignedQuantity) * 100),
  );

  const past = isPastShift(shiftDate);
  const canUpdate =
    !isAdmin && !past && job.status !== ShiftJobStatus.COMPLETED;

  const previewTotal = Math.min(
    job.assignedQuantity,
    job.completedQuantity + incrementQty,
  );
  const previewRemaining = Math.max(0, job.assignedQuantity - previewTotal);

  const openEditor = () => {
    setIncrementQty(0);
    setIsEditing(true);
  };

  const cancelEditor = () => {
    setIsEditing(false);
    setIncrementQty(0);
  };

  const handleUpdate = async () => {
    if (incrementQty <= 0) {
      notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.INVALID_INCREMENT_QUANTITY);
      return;
    }
    try {
      setLoading(true);
      const result = await dispatch(
        updateShiftJobProgress({ id: job.id, completedQuantity: previewTotal }),
      ).unwrap();
      if (result.success) {
        notifySuccess(
          FRONTEND_MESSAGE_CONSTANTS.SUCCESS.SHIFT_JOB_PROGRESS_UPDATED,
        );
        setIsEditing(false);
        setIncrementQty(0);
        onUpdated?.();
      }
    } catch (error) {
      notifyError(
        (error as string) ||
          FRONTEND_MESSAGE_CONSTANTS.ERROR.SHIFT_JOB_PROGRESS_UPDATE_FAILED,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewPart = async () => {
    const partId = job.job?.partId;
    if (!partId) {
      notifyError(
        FRONTEND_MESSAGE_CONSTANTS.ERROR.PART_INFORMATION_NOT_AVAILABLE,
      );
      return;
    }
    try {
      setPartLoading(true);
      setShowPartModal(true);
      const res = await partService.getById(partId);
      if (res.data.success && res.data.data) {
        setPartDetails(res.data.data);
      }
    } catch {
      notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.FAILED_TO_LOAD_PART_DETAILS);
      setShowPartModal(false);
    } finally {
      setPartLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">
              #{job.sequence}. {job.job?.part?.name || 'Job'}
            </p>
            <p className="text-xs text-gray-400 font-mono">
              {job.job?.part?.partNumber}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[job.status]}`}
            >
              {job.status.replace('_', ' ')}
            </span>
            {job.job?.partId && (
              <button
                onClick={handleViewPart}
                className="flex items-center gap-1 text-xs text-[#4f46e5] font-semibold hover:underline"
                title="View Part Details"
              >
                <Eye size={13} />
                View
              </button>
            )}
          </div>
        </div>

        {/* Done / Left summary */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>
            Assigned:{' '}
            <strong className="text-gray-700">{job.assignedQuantity}</strong>
          </span>
          <span className="text-gray-200">|</span>
          <span>
            Done:{' '}
            <strong className="text-gray-700">{job.completedQuantity}</strong>
          </span>
          <span className="text-gray-200">|</span>
          <span>
            Left:{' '}
            <strong
              className={remaining === 0 ? 'text-green-600' : 'text-gray-700'}
            >
              {remaining}
            </strong>
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progressPct === 100 ? 'bg-green-500' : 'bg-[#4f46e5]'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="text-[11px] text-gray-400 text-right -mt-2">
          {progressPct}% complete
        </p>

        {canUpdate && !isEditing && (
          <Button
            variant="secondary"
            size="sm"
            onClick={openEditor}
            className="flex items-center gap-1.5 text-xs w-full justify-center"
          >
            <Pencil size={13} />
            Update Quantity
          </Button>
        )}

        {canUpdate && isEditing && (
          <div className="space-y-2 pt-1 bg-gray-50 border border-gray-100 rounded-lg p-3">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Qty completed now (since last update)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                max={remaining}
                value={incrementQty}
                onChange={(e) =>
                  setIncrementQty(Math.max(0, Number(e.target.value)))
                }
                autoFocus
                className="w-24 text-sm"
              />
              <span className="text-xs text-gray-400">of {remaining} left</span>
            </div>

            {/* Live preview so it's clear what will be sent */}
            <p className="text-xs text-gray-600">
              New total:{' '}
              <strong className="text-gray-800">{previewTotal}</strong> /{' '}
              {job.assignedQuantity}
              {'  '}·{'  '}
              Remaining after:{' '}
              <strong
                className={
                  previewRemaining === 0 ? 'text-green-600' : 'text-gray-800'
                }
              >
                {previewRemaining}
              </strong>
            </p>

            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpdate}
                disabled={loading || incrementQty <= 0}
                className="text-xs"
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={cancelEditor}
                disabled={loading}
                className="text-xs"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Read-only notices */}
        {!canUpdate && job.status !== ShiftJobStatus.COMPLETED && (
          <p className="flex items-center gap-1 text-[11px] text-gray-400 pt-0.5">
            <Lock size={11} />
            {isAdmin
              ? 'Admins cannot update job progress'
              : past
                ? 'Past shifts are read-only'
                : ''}
          </p>
        )}
      </div>

      {/* Part Details Modal */}
      {showPartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Part Details
                </h2>
                {partDetails && (
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    {partDetails.partNumber}
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowPartModal(false);
                  setPartDetails(null);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {partLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-[#4f46e5]/30 border-t-[#4f46e5] rounded-full animate-spin" />
                </div>
              ) : partDetails ? (
                <>
                  {/* Basic Info */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Basic Info
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">
                          Name
                        </p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">
                          {partDetails.name}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">
                          Part No.
                        </p>
                        <p className="text-sm font-mono font-semibold text-gray-800 mt-0.5">
                          {partDetails.partNumber}
                        </p>
                      </div>
                      {partDetails.material && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-[10px] text-gray-400 uppercase font-bold">
                            Material
                          </p>
                          <p className="text-sm font-semibold text-gray-800 mt-0.5">
                            {partDetails.material}
                          </p>
                        </div>
                      )}
                      {partDetails.operationType && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-[10px] text-gray-400 uppercase font-bold">
                            Operation
                          </p>
                          <p className="text-sm font-semibold text-gray-800 mt-0.5">
                            {partDetails.operationType}
                          </p>
                        </div>
                      )}
                    </div>
                    {partDetails.description && (
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[10px] text-gray-400 uppercase font-bold">
                          Description
                        </p>
                        <p className="text-sm text-gray-700 mt-0.5">
                          {partDetails.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dimensions */}
                  {partDetails.dimensions && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers size={13} /> Dimensions
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {(['width', 'length', 'height'] as const).map((dim) => (
                          <div
                            key={dim}
                            className="bg-gray-50 rounded-lg p-3 text-center"
                          >
                            <p className="text-[10px] text-gray-400 uppercase font-bold">
                              {dim}
                            </p>
                            <p className="text-sm font-semibold text-gray-800 mt-0.5">
                              {partDetails.dimensions![dim]}{' '}
                              <span className="text-xs text-gray-400">
                                {partDetails.dimensions!.unit}
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Timing */}
                  {(partDetails.cycleTime || partDetails.setupTime) && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={13} /> Timing
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        {partDetails.cycleTime && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-[10px] text-gray-400 uppercase font-bold">
                              Cycle Time
                            </p>
                            <p className="text-sm font-semibold text-gray-800 mt-0.5">
                              {partDetails.cycleTime}
                            </p>
                          </div>
                        )}
                        {partDetails.setupTime && (
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-[10px] text-gray-400 uppercase font-bold">
                              Setup Time
                            </p>
                            <p className="text-sm font-semibold text-gray-800 mt-0.5">
                              {partDetails.setupTime}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Documents */}
                  {(partDetails.setupSheet ||
                    partDetails.engineeringDrawing ||
                    partDetails.ncProgramFileUrl) && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText size={13} /> Documents
                      </h3>
                      <div className="flex flex-col gap-2">
                        {partDetails.setupSheet && (
                          <a
                            href={partDetails.setupSheet}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#4f46e5] hover:bg-indigo-100 transition-colors"
                          >
                            <FileText size={14} />
                            View Setup Sheet
                          </a>
                        )}
                        {partDetails.engineeringDrawing && (
                          <a
                            href={partDetails.engineeringDrawing}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#4f46e5] hover:bg-indigo-100 transition-colors"
                          >
                            <FileText size={14} />
                            View Engineering Drawing
                          </a>
                        )}
                        {partDetails.ncProgramFileUrl && (
                          <a
                            href={partDetails.ncProgramFileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2.5 text-sm font-semibold text-[#4f46e5] hover:bg-indigo-100 transition-colors"
                          >
                            <Download size={14} />
                            Download NC Program
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  Part details not available.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShiftJobProgressCard;
