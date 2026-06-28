import { useEffect, useState, useCallback, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/custom/DataTable';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { fetchJobs, createJob, updateJob, deleteJob } from '../jobThunk';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { DEBOUNCE_DELAY, PAGINATION_LIMIT } from '@/shared/constants/constant';
import { Input } from '@/shared/components/ui/input';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import { Plus, Search, RefreshCcw, Filter } from 'lucide-react';
import ReusableModal from '@/shared/components/custom/ReusableModal';
import JobForm from '../components/JobForm';
import type { Job, JobRequest } from '../types';
import { JobPriority, JobStatus } from '../types';
import type { JobFormData } from '../validators/jobValidator';
import Swal from 'sweetalert2';

const columnHelper = createColumnHelper<Job>();

const JobDashBoard = () => {
  const dispatch = useAppDispatch();
  const { jobs, total, loading } = useAppSelector((state) => state.job);

  const [pageSize, setPageSize] = useState(PAGINATION_LIMIT);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);
  const [currentPage, setCurrentPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      actions: 'flex gap-3',
      confirmButton: buttonVariants({
        variant: 'primary',
        size: 'lg',
      }),
      cancelButton: buttonVariants({
        variant: 'destructive',
        size: 'lg',
      }),
    },
    buttonsStyling: false,
  });

  const loadData = useCallback(() => {
    dispatch(
      fetchJobs({
        page: currentPage + 1,
        limit: pageSize,
        search: debouncedSearch,
        status: statusFilter === 'all' ? undefined : statusFilter,
        priority: priorityFilter === 'all' ? undefined : priorityFilter,
      }),
    );
  }, [
    dispatch,
    currentPage,
    pageSize,
    debouncedSearch,
    statusFilter,
    priorityFilter,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, statusFilter, priorityFilter]);

  const handleAddJob = async (data: JobFormData) => {
    try {
      setIsSubmitting(true);
      const result = await dispatch(createJob(data as JobRequest)).unwrap();
      if (result.success) {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.JOB_CREATED);
        setIsAddModalOpen(false);
        loadData();
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(
        errorMessage || FRONTEND_MESSAGE_CONSTANTS.ERROR.JOB_CREATION_FAILED,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditJob = async (data: JobFormData) => {
    if (!selectedJob) return;
    try {
      setIsSubmitting(true);
      const result = await dispatch(
        updateJob({ id: selectedJob.id, data: data as JobRequest }),
      ).unwrap();
      if (result.success) {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.JOB_UPDATED);
        setIsEditModalOpen(false);
        setSelectedJob(null);
      }
    } catch (error) {
      const errorMessage =
        (error as { message?: string })?.message || (error as string);
      notifyError(
        errorMessage || FRONTEND_MESSAGE_CONSTANTS.ERROR.JOB_UPDATE_FAILED,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this job!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteJob(id)).unwrap();
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.JOB_DELETED);
        if (jobs.length === 1 && currentPage > 0) {
          setCurrentPage((prev) => prev - 1);
        } else {
          loadData();
        }
      } catch (error) {
        const errorMessage =
          (error as { message?: string })?.message || (error as string);
        notifyError(errorMessage || 'Failed to delete job');
      }
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('partId', {
        header: 'Part',
        cell: (info) => {
          const part = info.row.original.part;
          return (
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">
                {part?.name || 'Unknown Part'}
              </span>
              <span className="text-[10px] text-gray-500 font-mono">
                {part?.partNumber || info.getValue().substring(0, 8)}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor('quantity', {
        header: 'Qty',
      }),
      columnHelper.accessor('priority', {
        header: 'Priority',
        cell: (info) => {
          const priority = info.getValue();
          const colors = {
            [JobPriority.LOW]: 'bg-gray-100 text-gray-700',
            [JobPriority.MEDIUM]: 'bg-blue-100 text-blue-700',
            [JobPriority.HIGH]: 'bg-orange-100 text-orange-700',
            [JobPriority.URGENT]: 'bg-red-100 text-red-700',
          };
          return (
            <span
              className={`px-2 py-1 rounded-md text-xs font-medium uppercase ${colors[priority]}`}
            >
              {priority}
            </span>
          );
        },
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => {
          const status = info.getValue();
          const colors = {
            [JobStatus.PENDING]: 'bg-yellow-100 text-yellow-700',
            [JobStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700',
            [JobStatus.COMPLETED]: 'bg-green-100 text-green-700',
            [JobStatus.CANCELLED]: 'bg-red-100 text-red-700',
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}
            >
              {status.replace('_', ' ')}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => {
          const job = info.row.original;
          return (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedJob(job);
                  setIsEditModalOpen(true);
                }}
                className="h-8 px-3 text-xs font-semibold"
              >
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleDelete(job.id)}
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Job Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track and manage manufacturing jobs
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Plus size={18} />
          <span>Add Job</span>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs by part name..."
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={100}>100 per page</option>
              <option value={10000}>All</option>
            </select>
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-[#4f46e5] focus:border-[#4f46e5]"
            >
              <option value="all">All Status</option>
              {Object.values(JobStatus).map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-[#4f46e5] focus:border-[#4f46e5]"
            >
              <option value="all">All Priorities</option>
              {Object.values(JobPriority).map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <Button
            variant="secondary"
            onClick={() => loadData()}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-[#4f46e5]/30 border-t-[#4f46e5] rounded-full animate-spin" />
          </div>
        )}
        <DataTable
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          columns={columns as unknown as any[]}
          data={jobs}
          manualPagination
          pageCount={Math.ceil(total / pageSize)}
          pageIndex={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </div>

      <ReusableModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Job"
        maxWidth="max-w-2xl"
      >
        <JobForm onSubmit={handleAddJob} loading={isSubmitting} />
      </ReusableModal>

      <ReusableModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedJob(null);
        }}
        title="Edit Job"
        maxWidth="max-w-2xl"
      >
        {selectedJob && (
          <JobForm
            initialData={selectedJob as unknown as JobFormData}
            onSubmit={handleEditJob}
            loading={isSubmitting}
          />
        )}
      </ReusableModal>
    </div>
  );
};

export default JobDashBoard;
