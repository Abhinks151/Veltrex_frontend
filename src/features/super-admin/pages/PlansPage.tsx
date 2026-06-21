import { useEffect, useState, useCallback, useMemo } from 'react';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/custom/DataTable';
import { planService, type Plan } from '@/services/planService';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { Input } from '@/shared/components/ui/input';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import ReusableModal from '@/shared/components/custom/ReusableModal';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { DEBOUNCE_DELAY, PAGINATION_LIMIT } from '@/shared/constants/constant';

interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const columnHelper = createColumnHelper<Plan>();

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

const PlansPage = () => {
  const [data, setData] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'blocked'
  >('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    price: 0,
    currency: 'INR',
    durationDays: '' as string | number,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await planService.getAllPlans({
        page: currentPage + 1,
        limit: PAGINATION_LIMIT,
        search: debouncedSearch,
        status: statusFilter,
      });
      const { plans, total } = res.data?.data || { plans: [], total: 0 };
      setData(plans);
      setTotalCount(total);
    } catch {
      notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.FAILED_FETCH_PLANS);
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, statusFilter]);

  const handleOpenModal = (plan: Plan | null = null) => {
    if (plan) {
      setSelectedPlan(plan);
      setFormData({
        code: plan.code,
        name: plan.name,
        description: plan.description || '',
        price: plan.price,
        currency: plan.currency,
        durationDays: plan.durationDays ?? '',
      });
    } else {
      setSelectedPlan(null);
      setFormData({
        code: '',
        name: '',
        description: '',
        price: 0,
        currency: 'INR',
        durationDays: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleToggleBlock = useCallback(
    async (id: string, currentlyBlocked: boolean) => {
      try {
        await planService.toggleBlock(id);
        setData((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, isBlocked: !p.isBlocked } : p,
          ),
        );
        notifySuccess(
          currentlyBlocked
            ? FRONTEND_MESSAGE_CONSTANTS.SUCCESS.PLAN_BLOCK_TOGGLED
            : FRONTEND_MESSAGE_CONSTANTS.SUCCESS.PLAN_BLOCK_TOGGLED,
        );
      } catch (error: unknown) {
        const message =
          (error as AxiosError)?.response?.data?.message ||
          FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG;
        notifyError(message);
      }
    },
    [],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const result = await swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      });

      if (result.isConfirmed) {
        try {
          await planService.deletePlan(id);
          setData((prev) => prev.filter((p) => p.id !== id));
          notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.PLAN_DELETED);

          if (data.length === 1 && currentPage > 0) {
            setCurrentPage((prev) => prev - 1);
          } else {
            fetchData();
          }
        } catch (error: unknown) {
          const message =
            (error as AxiosError)?.response?.data?.message ||
            FRONTEND_MESSAGE_CONSTANTS.ERROR.FAILED_DELETE_PLAN;
          notifyError(message);
        }
      }
    },
    [data.length, currentPage, fetchData],
  );

  const handleSubmit = async () => {
    if (formData.price < 0) {
      notifyError('Price cannot be negative');
      return;
    }

    if (formData.durationDays !== '' && Number(formData.durationDays) < 0) {
      notifyError('Duration days cannot be negative');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        durationDays:
          formData.durationDays === '' ? null : Number(formData.durationDays),
        price: Number(formData.price),
      };

      if (selectedPlan) {
        await planService.updatePlan(selectedPlan.id, payload);
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.PLAN_UPDATED);
      } else {
        await planService.createPlan(payload);
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.PLAN_CREATED);
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error: unknown) {
      const message =
        (error as AxiosError)?.response?.data?.message ||
        FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG;
      notifyError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<Plan, unknown>[] = useMemo(
    () => [
      columnHelper.display({
        id: 'name',
        header: 'Name',
        cell: (info) =>
          (
            <div className="flex flex-col">
              <span className="font-bold text-gray-900">
                {info.row.original.name}
              </span>
              <span className="text-xs text-gray-500 font-mono">
                {info.row.original.code}
              </span>
            </div>
          ) as React.ReactNode,
      }) as ColumnDef<Plan, unknown>,
      columnHelper.display({
        id: 'price',
        header: 'Pricing',
        cell: (info) =>
          (
            <div className="font-semibold text-indigo-600">
              {info.row.original.currency}{' '}
              {info.row.original.price.toLocaleString()}
            </div>
          ) as React.ReactNode,
      }) as ColumnDef<Plan, unknown>,
      columnHelper.display({
        id: 'durationDays',
        header: 'Duration',
        cell: (info) => {
          const days = info.row.original.durationDays;
          return (
            <span className="text-sm text-gray-700">
              {days ? `${days} Days` : 'Lifetime'}
            </span>
          ) as React.ReactNode;
        },
      }) as ColumnDef<Plan, unknown>,
      columnHelper.display({
        id: 'isBlocked',
        header: 'Status',
        cell: (info) => {
          const isBlocked = info.row.original.isBlocked;
          return (
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isBlocked
                  ? 'bg-red-100 text-red-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {isBlocked ? 'Blocked' : 'Active'}
            </span>
          ) as React.ReactNode;
        },
      }) as ColumnDef<Plan, unknown>,
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const plan = row.original;
          return (
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleBlock(plan.id, plan.isBlocked)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  plan.isBlocked
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                }`}
              >
                {plan.isBlocked ? 'Unblock' : 'Block'}
              </button>

              <button
                onClick={() => handleOpenModal(plan)}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md text-xs font-semibold transition-colors"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(plan.id)}
                className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md text-xs font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          ) as React.ReactNode;
        },
      }) as ColumnDef<Plan, unknown>,
    ],
    [handleToggleBlock, handleDelete],
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Subscription Plans
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage tiered access and pricing for your tenants.
          </p>
        </div>
        <Button
          onClick={() => handleOpenModal()}
          variant="primary"
          size="lg"
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Create New Plan</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between px-6 py-4 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex gap-2 flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Search plans by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
          <Button
            size="lg"
            variant="outline"
            className="shrink-0"
            onClick={() => setSearch('')}
          >
            Clear
          </Button>
        </div>

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as 'all' | 'active' | 'blocked')
          }
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
        >
          <option value="all">All Status</option>
          <option value="active">Active Plans</option>
          <option value="blocked">Blocked Plans</option>
        </select>
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex justify-center items-center bg-white/50 backdrop-blur-[1px] rounded-2xl">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <DataTable
            columns={columns}
            data={data}
            manualPagination={true}
            pageCount={Math.ceil(totalCount / PAGINATION_LIMIT)}
            pageIndex={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <ReusableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPlan ? 'Edit Plan' : 'Create New Plan'}
        showFooter
        onSubmit={handleSubmit}
        submitText={selectedPlan ? 'Update Plan' : 'Create Plan'}
        loading={submitting}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Code (Unique identifier)
              </label>
              <Input
                disabled={!!selectedPlan}
                placeholder="e.g. TRIAL, PREMIUM"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Name
              </label>
              <Input
                placeholder="e.g. Free Trial"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm min-h-[80px]"
              placeholder="What's included in this plan?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Price
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Currency
              </label>
              <Input
                placeholder="INR"
                value={formData.currency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currency: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Duration (Days)
              </label>
              <Input
                type="number"
                placeholder="Leave empty for lifetime"
                value={formData.durationDays}
                onChange={(e) =>
                  setFormData({ ...formData, durationDays: e.target.value })
                }
              />
            </div>
          </div>
          <p className="text-[11px] text-gray-400 italic">
            * Duration in days. Set to 0 or leave empty for a
            "lifetime/unlimited" plan.
          </p>
        </div>
      </ReusableModal>
    </div>
  );
};

export default PlansPage;
