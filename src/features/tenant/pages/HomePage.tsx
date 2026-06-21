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

const HomePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTenant());
    dispatch(getSubscription());
  }, [dispatch]);

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
        text: `Do you want to ${status === 'ACTIVE' ? 'cancel' : 'activate'} your subscription?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Yes, ${status === 'ACTIVE' ? 'cancel' : 'activate'} it!`,
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          dispatch(toggleSubscriptionStatus(id));

          swalWithBootstrapButtons.fire({
            title: `${status === 'ACTIVE' ? 'Cancelled' : 'Activated'}!`,
            text: `Your subscription has been ${status === 'ACTIVE' ? 'cancelled' : 'activated'}.`,
            icon: 'success',
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: `${status === 'ACTIVE' ? 'Cancelled' : 'Activated'}`,
            text: `Your subscription is not ${status === 'ACTIVE' ? 'cancelled' : 'activated'} :)`,
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SubscriptionBanner />
      <Navbar />

      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Welcome to Veltrex</h1>
        <p className="text-gray-500 mb-8">
          Manage your subscription and set up your organization to get started.
        </p>

        <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 text-white rounded-xl p-6 flex justify-between items-center shadow-md mb-6">
          <div>
            <h2 className="text-lg font-semibold">
              Initialize Your Operations
            </h2>
            <p className="text-sm text-white/80 mt-1">
              Ready to deploy your first production workflow.
            </p>
          </div>

          {/* <Button className="bg-white text-indigo-700 hover:bg-gray-100"> */}
          <Link to="/platform/login">
            <Button variant={'primary'}>Go to Veltrex</Button>
          </Link>
        </div>

        {name && (
          <div className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center mb-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">ACTIVE ORGANIZATION</p>
              <h2 className="text-lg font-semibold">{name}</h2>
              <p className="text-gray-500 text-sm mt-1">
                Manage your organization assets, team members, and monitor
                industrial output.
              </p>
            </div>

            <Link to="/tenant/update">
              <Button variant="primary">Edit Organization</Button>
            </Link>
          </div>
        )}

        {!name && (
          <div className="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center mb-6">
            <div>
              <p className="text-xs text-gray-400 mb-1">SETUP REQUIRED</p>
              <h2 className="text-lg font-semibold">Organization Setup</h2>
              <p className="text-gray-500 text-sm mt-1">
                Create your organization to start using the platform.
              </p>
            </div>

            <Link to="/tenant/create">
              <Button>Create Organization</Button>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Subscription */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Subscription</h3>
              <div className="flex items-center gap-2">
                {isTrialActive && (
                  <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-600">
                    Free Trial
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-1 rounded ${status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}
                >
                  {status || 'INACTIVE'}
                </span>
              </div>
            </div>

            {isTrialActive && endDate && (
              <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
                Your free trial ends on{' '}
                <strong>
                  {new Date(endDate).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </strong>
                . Upgrade before it expires to avoid interruption.
              </div>
            )}

            <div className="text-sm text-gray-500 space-y-2">
              <p>
                Plan: {plan ? `${plan.name} Subscription` : 'No Active Plan'}
              </p>
              <p>
                Billing:{' '}
                {plan
                  ? plan.price === 0
                    ? 'Free Trial'
                    : `${plan.currency} ${plan.price.toLocaleString()} / ${plan.durationDays ? `${plan.durationDays} days` : 'lifetime'}`
                  : 'N/A'}
              </p>
              {!isTrialPlan && plan?.durationDays && (
                <p>
                  Next Billing:{' '}
                  {endDate
                    ? new Date(endDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'N/A'}
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {isTrialActive && (
                <Button
                  variant="primary"
                  className="w-full hover:opacity-90 transition-all font-semibold"
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
                    ? 'Cancel Subscription'
                    : 'Reactivate Subscription'}
              </button>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold mb-4">Next Steps</h3>

            <ul className="space-y-4 text-sm text-gray-600">
              <li>
                <strong>01</strong> Create your organization
              </li>
              <li>
                <strong>02</strong> Add machines and team members
              </li>
              <li>
                <strong>03</strong> Start scheduling jobs
              </li>
            </ul>

            <Link to="/docs">
              <Button variant="primary">View Documentation</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
