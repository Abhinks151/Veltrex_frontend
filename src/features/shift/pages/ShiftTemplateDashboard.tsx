import { useEffect, useState, useCallback, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/custom/DataTable';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import {
  fetchShiftTemplates,
  createShiftTemplate,
  updateShiftTemplate,
  deleteShiftTemplate,
  generateProductionShift,
} from '../shiftThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { PAGINATION_LIMIT } from '@/shared/constants/constant';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Plus, RefreshCcw, Zap } from 'lucide-react';
import ReusableModal from '@/shared/components/custom/ReusableModal';
import ShiftTemplateForm from '../components/ShiftTemplateForm';
import type { ShiftTemplate } from '../types';
import { ShiftType, ShiftRepeatType } from '../types';
import type { ShiftTemplateFormData } from '../validators/shiftValidator';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper<ShiftTemplate>();

const shiftTypeColors: Record<ShiftType, string> = {
  [ShiftType.MORNING]: 'bg-amber-100 text-amber-700',
  [ShiftType.EVENING]: 'bg-purple-100 text-purple-700',
  [ShiftType.NIGHT]: 'bg-slate-100 text-slate-700',
};

const ShiftTemplateDashboard = () => {
  const dispatch = useAppDispatch();
  const { templates, totalTemplates, loading } = useAppSelector(
    (state) => state.shift,
  );

  const [pageSize, setPageSize] = useState(PAGINATION_LIMIT);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ShiftTemplate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const swal = Swal.mixin({
    customClass: {
      actions: 'flex gap-3',
      confirmButton: buttonVariants({ variant: 'primary', size: 'lg' }),
      cancelButton: buttonVariants({ variant: 'destructive', size: 'lg' }),
    },
    buttonsStyling: false,
  });

  const loadData = useCallback(() => {
    dispatch(fetchShiftTemplates({ page: currentPage + 1, limit: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (data: ShiftTemplateFormData) => {
    try {
      setIsSubmitting(true);
      const result = await dispatch(createShiftTemplate(data)).unwrap();
      if (result.success) {
        notifySuccess('Shift template created successfully');
        setIsAddModalOpen(false);
        loadData();
      }
    } catch (error) {
      notifyError((error as string) || 'Failed to create shift template');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (data: ShiftTemplateFormData) => {
    if (!selectedTemplate) return;
    try {
      setIsSubmitting(true);
      const result = await dispatch(
        updateShiftTemplate({ id: selectedTemplate.id, data }),
      ).unwrap();
      if (result.success) {
        notifySuccess('Shift template updated successfully');
        setIsEditModalOpen(false);
        setSelectedTemplate(null);
        loadData();
      }
    } catch (error) {
      notifyError((error as string) || 'Failed to update shift template');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await swal.fire({
      title: 'Delete Template?',
      text: 'This will remove the shift template. Active production shifts will remain.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        await dispatch(deleteShiftTemplate(id)).unwrap();
        notifySuccess('Shift template deleted');
        if (templates.length === 1 && currentPage > 0) {
          setCurrentPage((p) => p - 1);
        } else {
          loadData();
        }
      } catch (error) {
        notifyError((error as string) || 'Failed to delete shift template');
      }
    }
  };

  const handleGenerateNow = async (templateId: string) => {
    try {
      const result = await dispatch(
        generateProductionShift(templateId),
      ).unwrap();
      if (result.success) {
        notifySuccess('Production shift generated for today!');
      }
    } catch (error) {
      notifyError((error as string) || 'Failed to generate production shift');
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('employeeId', {
        header: 'Employee',
        cell: (info) => {
          const emp = info.row.original.employee;
          return (
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">
                {emp?.name || '—'}
              </span>
              <span className="text-xs text-gray-400">{emp?.email}</span>
            </div>
          );
        },
      }),
      columnHelper.accessor('shiftType', {
        header: 'Shift',
        cell: (info) => {
          const type = info.getValue();
          return (
            <span
              className={`px-2 py-1 rounded-md text-xs font-semibold ${shiftTypeColors[type]}`}
            >
              {type}
            </span>
          );
        },
      }),
      columnHelper.accessor('repeatType', {
        header: 'Repeat',
        cell: (info) => (
          <span
            className={`px-2 py-1 rounded-md text-xs font-semibold ${
              info.getValue() === ShiftRepeatType.DAILY
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {info.getValue() === ShiftRepeatType.DAILY ? 'Daily' : 'One-time'}
          </span>
        ),
      }),
      columnHelper.accessor('startDate', {
        header: 'Dates',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex flex-col text-xs">
              <span className="text-gray-700">
                From: {new Date(row.startDate).toLocaleDateString()}
              </span>
              {row.endDate && (
                <span className="text-gray-400">
                  To: {new Date(row.endDate).toLocaleDateString()}
                </span>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor('templateJobs', {
        header: 'Jobs',
        cell: (info) => {
          const jobs = info.getValue() || [];
          return (
            <span className="text-sm font-medium text-gray-700">
              {jobs.length} job{jobs.length !== 1 ? 's' : ''}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const template = info.row.original;
          return (
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleGenerateNow(template.id)}
                className="h-8 px-3 text-xs font-semibold text-indigo-600 flex items-center gap-1"
              >
                <Zap size={12} />
                Generate Now
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedTemplate(template);
                  setIsEditModalOpen(true);
                }}
                className="h-8 px-3 text-xs font-semibold"
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDelete(template.id)}
                className="h-8 px-3 text-xs font-semibold text-red-600"
              >
                Delete
              </Button>
            </div>
          );
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Shift Templates
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Define recurring or one-time shift schedules for machinists
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 shadow-lg"
          >
            <Plus size={18} />
            New Template
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <label className="text-sm text-gray-500">Show</label>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={1000}>All</option>
        </select>
        <span className="text-sm text-gray-500">entries</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#4f46e5]/30 border-t-[#4f46e5] rounded-full animate-spin" />
          </div>
        )}
        <DataTable
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          columns={columns as unknown as any[]}
          data={templates}
          manualPagination
          pageCount={Math.ceil(totalTemplates / pageSize)}
          pageIndex={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Create Modal */}
      <ReusableModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Shift Template"
        maxWidth="max-w-3xl"
      >
        <ShiftTemplateForm onSubmit={handleCreate} loading={isSubmitting} />
      </ReusableModal>

      {/* Edit Modal */}
      <ReusableModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTemplate(null);
        }}
        title="Edit Shift Template"
        maxWidth="max-w-3xl"
      >
        {selectedTemplate && (
          <ShiftTemplateForm
            initialData={{
              employeeId: selectedTemplate.employeeId,
              shiftType: selectedTemplate.shiftType,
              repeatType: selectedTemplate.repeatType,
              startDate: selectedTemplate.startDate?.split('T')[0],
              endDate: selectedTemplate.endDate?.split('T')[0],
              jobs:
                selectedTemplate.templateJobs?.map((j) => ({
                  jobId: j.jobId,
                  assignedQuantity: j.assignedQuantity,
                  sequence: j.sequence,
                })) || [],
            }}
            onSubmit={handleEdit}
            loading={isSubmitting}
          />
        )}
      </ReusableModal>
    </div>
  );
};

export default ShiftTemplateDashboard;
