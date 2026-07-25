import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { getTenant } from '@/features/tenant/tenantThunk';
import {
  getSubscription,
  toggleSubscriptionStatus,
} from '@/features/subscription/subscriptionThunk';
import { Link, useNavigate } from 'react-router-dom';
import { Button, buttonVariants } from '@/shared/components/ui/button';
import Navbar from '@/shared/components/custom/Navbar';
import TenantRestrictedView from '@/features/tenant/components/TenantRestrictedView';
import Loader from '@/pages/Loader';
import SubscriptionBanner from '@/features/subscription/components/SubscriptionBanner';
import Swal from 'sweetalert2';
import { getSubdomain, getSubdomainUrl } from '@/shared/utils/subdomain';

const formatDate = (date: string | number | Date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const Panel = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </div>
);

const StatusPill = ({
  tone,
  children,
}: {
  tone: 'blue' | 'green' | 'orange';
  children: React.ReactNode;
}) => {
  const toneStyles: Record<typeof tone, string> = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
  };
  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded ${toneStyles[tone]}`}
    >
      {children}
    </span>
  );
};

const OrganizationPanel = ({ name }: { name?: string | null }) => (
  <Panel className="p-6">
    <div className="flex items-start justify-between gap-6">
      <div>
        <p className="text-xs font-semibold tracking-wide text-gray-400 mb-1">
          {name ? 'ACTIVE ORGANIZATION' : 'SETUP REQUIRED'}
        </p>
        <h2 className="text-lg font-semibold text-gray-900">
          {name || 'Organization Setup'}
        </h2>
        <p className="text-gray-500 text-sm mt-1 max-w-md">
          {name
            ? 'Manage your organization assets, team members, and monitor industrial output.'
            : 'Create your organization to start using the platform.'}
        </p>
      </div>

      <Link
        to={name ? '/tenant/update' : '/tenant/create'}
        className="shrink-0"
      >
        <Button variant="primary">
          {name ? 'Edit Organization' : 'Create Organization'}
        </Button>
      </Link>
    </div>
  </Panel>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const subdomain = getSubdomain();
    if (subdomain) {
      navigate('/platform');
      return;
    }
    dispatch(getTenant());
    dispatch(getSubscription());
  }, [dispatch, navigate]);

  const {
    name,
    isBlocked,
    isDeleted,
    loading: tenantLoading,
  } = useAppSelector((state) => state.tenant);
  const {
    plan,
    status,
    endDate,
    loading: subLoading,
    toggling,
    id,
  } = useAppSelector((state) => state.subscription);
  const { user } = useAppSelector((state) => state.auth);

  const isTrialPlan = !plan || plan.price === 0;
  const isTrialActive = status === 'ACTIVE' && isTrialPlan;

  function handleCancelSubscription() {
    if (!id) return;

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
    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: `Do you want to ${status === 'ACTIVE' ? 'block access to platform' : 'unblock access to platform'}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Yes, ${status === 'ACTIVE' ? 'block access to platform' : 'unblock access to platform'}!`,
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(toggleSubscriptionStatus(id));

          swalWithBootstrapButtons.fire({
            title: `${status === 'ACTIVE' ? 'Blocked' : 'Unblocked'}!`,
            text: `Your subscription has been ${status === 'ACTIVE' ? 'blocked' : 'unblocked'}.`,
            icon: 'success',
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: `${status === 'ACTIVE' ? 'Blocked' : 'Unblocked'}`,
            text: `Your subscription is not ${status === 'ACTIVE' ? 'blocked' : 'unblocked'}`,
            icon: 'error',
          });
        }
      });
  }

  if (tenantLoading || subLoading) {
    return <Loader />;
  }

  if (isBlocked || isDeleted) {
    return <TenantRestrictedView />;
  }

  const isAdmin = user?.role === 'ADMIN';
  const isExpired = endDate && new Date(endDate) < new Date();

  if (status === 'CANCELLED' && !isAdmin && user?.role !== 'SUPER_ADMIN') {
    return <TenantRestrictedView reason="expired" />;
  }

  const isRestricted =
    status === 'EXPIRED' ||
    !id ||
    (status === 'ACTIVE' && isExpired) ||
    (status === 'CANCELLED' && isExpired);

  if (isRestricted && user?.role !== 'SUPER_ADMIN') {
    return <TenantRestrictedView reason="expired" />;
  }

  const platformUrl = user?.subdomain
    ? getSubdomainUrl(user.subdomain, '/platform')
    : '/platform';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SubscriptionBanner />
      <Navbar />

      <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-10 md:px-8 md:py-12">
        {/* Page header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Veltrex
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your subscription and set up your organization to get
            started.
          </p>
        </header>

        {/* Primary action banner */}
        <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 text-white rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md mb-8">
          <div>
            <h2 className="text-lg font-semibold">
              Initialize Your Operations
            </h2>
            <p className="text-sm text-white/80 mt-1">
              Ready to deploy your first production workflow.
            </p>
          </div>

          <Link
            to={platformUrl}
            onClick={(e) => {
              if (user?.subdomain) {
                e.preventDefault();
                window.location.assign(platformUrl);
              }
            }}
            className="shrink-0"
          >
            <Button variant="primary">Go to Veltrex</Button>
          </Link>
        </div>

        {/* Organization status */}
        <div className="mb-6">
          <OrganizationPanel name={name} />
        </div>

        {/* Subscription + Next steps */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Subscription */}
          <Panel className="p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Subscription</h3>
              <div className="flex items-center gap-2">
                {isTrialActive && (
                  <StatusPill tone="blue">Free Trial</StatusPill>
                )}
                <StatusPill tone={status === 'ACTIVE' ? 'green' : 'orange'}>
                  {status || 'INACTIVE'}
                </StatusPill>
              </div>
            </div>

            {isTrialActive && endDate && (
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                Your free trial ends on <strong>{formatDate(endDate)}</strong>.
                Upgrade before it expires to avoid interruption.
              </div>
            )}

            <dl className="text-sm text-gray-500 grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 mb-4">
              <div className="flex gap-1">
                <dt className="text-gray-400">Plan:</dt>
                <dd>{plan ? `${plan.name} Subscription` : 'No Active Plan'}</dd>
              </div>
              <div className="flex gap-1">
                <dt className="text-gray-400">Billing:</dt>
                <dd>
                  {plan
                    ? plan.price === 0
                      ? 'Free Trial'
                      : `${plan.currency} ${plan.price.toLocaleString()} / ${plan.durationDays ? `${plan.durationDays} days` : 'lifetime'}`
                    : 'N/A'}
                </dd>
              </div>
              {!isTrialPlan && plan?.durationDays && (
                <div className="flex gap-1">
                  <dt className="text-gray-400">Next Billing:</dt>
                  <dd>{endDate ? formatDate(endDate) : 'N/A'}</dd>
                </div>
              )}
            </dl>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-gray-100">
              {isTrialActive && (
                <Button
                  variant="primary"
                  className="sm:w-auto font-semibold hover:opacity-90 transition-all"
                  onClick={() => navigate('/plans?mode=upgrade')}
                >
                  Upgrade to Pro
                </Button>
              )}
              <button
                onClick={handleCancelSubscription}
                disabled={!id || !status || toggling}
                className="text-red-500 text-sm hover:cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-left"
              >
                {toggling
                  ? 'Updating...'
                  : status === 'ACTIVE'
                    ? 'Block access to platform'
                    : 'Unblock access to platform'}
              </button>
            </div>
          </Panel>

          {/* Next Steps */}
          <Panel className="p-6 flex flex-col">
            <h3 className="font-semibold text-gray-900 mb-4">Next Steps</h3>

            <ol className="space-y-4 text-sm text-gray-600 flex-1">
              <li className="flex gap-3">
                <span className="font-semibold text-indigo-600">01</span>
                <span>Create your organization</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-indigo-600">02</span>
                <span>Add machines and team members</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-indigo-600">03</span>
                <span>Start scheduling jobs</span>
              </li>
            </ol>

            <Link to="/docs" className="mt-6">
              <Button variant="primary" className="w-full">
                View Documentation
              </Button>
            </Link>
          </Panel>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
