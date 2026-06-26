import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@/app/store/hooks';
import { tenant } from '@/features/tenant/tenantThunk';
import { updateUser } from '@/features/auth/authSlice';
import { type tenantFormData } from '@/features/tenant/validators/tenant.schema';
import { tenantService } from '@/services/tenantService';

import Navbar from '@/shared/components/custom/Navbar';
import { notifySuccess, notifyError } from '@/shared/utils/toasterUtils';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import Loader from '@/pages/Loader';

import StepIndicator from '../components/onboarding/StepIndicator';
import TenantStep from '../components/onboarding/TenantStep';
import PlanStep from '../components/onboarding/PlanStep';
import { type Step } from '../components/onboarding/types';
import { type Plan } from '@/services/planService';
import { paymentService } from '@/services/paymentService';
import { loadRazorpay } from '@/shared/utils/razorpayUtils';

import type {
  RazorpayOptions,
  RazorpayResponse,
  RazorpayErrorResponse,
} from '@/types/razorpay';

const OnboardingPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);

  const [step, setStep] = useState<Step>('tenant');
  const [tenantName, setTenantName] = useState('');
  const [tenantSubdomain, setTenantSubdomain] = useState('');
  const [checkingName, setCheckingName] = useState(false);

  const handleTenantSubmit = async (data: tenantFormData) => {
    try {
      setCheckingName(true);

      // Check Name
      const nameRes = await tenantService.checkName(data.name);
      if (nameRes.data?.data?.isTaken) {
        notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.TENANT_NAME_TAKEN);
        return;
      }

      // Check Subdomain
      const subdomainRes = await tenantService.checkSubdomain(data.subdomain);
      if (subdomainRes.data?.data?.isTaken) {
        notifyError('Subdomain is already taken');
        return;
      }

      setTenantName(data.name);
      setTenantSubdomain(data.subdomain);
      setStep('plan');
    } catch {
      notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG);
    } finally {
      setCheckingName(false);
    }
  };

  const handlePlanFinish = async (selectedPlan: Plan) => {
    try {
      const tenantRes = await dispatch(
        tenant({
          name: tenantName,
          subdomain: tenantSubdomain,
          plan: selectedPlan.code,
        }),
      ).unwrap();

      const tenantId = tenantRes.data?.id;
      if (!tenantId) throw new Error('Tenant ID not returned');

      // Update auth store with new tenantId
      dispatch(updateUser({ tenantId }));

      if (selectedPlan.price > 0) {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
          notifyError('Razorpay SDK failed to load. Please try again.');
          return;
        }

        const orderRes = await paymentService.createOrder({
          tenantId,
          planId: selectedPlan.id,
        });

        const { orderId, amount, currency, paymentId } = orderRes.data;

        const options: RazorpayOptions = {
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount,
          currency,
          name: 'Veltrex',
          description: `Subscription: ${selectedPlan.name}`,
          order_id: orderId,
          handler: (response: RazorpayResponse) => {
            setIsVerifying(true);
            paymentService
              .verifyPayment({
                paymentId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              })
              .then(() => {
                notifySuccess('Payment successful! Welcome to Veltrex.');
                navigate('/payment-status?status=success');
              })
              .catch(() => {
                setIsVerifying(false);
                notifyError(
                  'Payment verification failed. Please contact support.',
                );
              });
          },
          prefill: {
            name: '',
            email: '',
          },
          theme: {
            color: '#4F46E5',
          },
          modal: {
            ondismiss: () => {
              if (paymentFailureReason) {
                notifyError(
                  `Payment failed: ${paymentFailureReason}. Please try again or contact support.`,
                );
                navigate(
                  `/payment-status?status=failure&reason=${encodeURIComponent(paymentFailureReason)}`,
                );
              } else {
                notifyError('Payment was not completed.');
                navigate(
                  '/payment-status?status=failure&reason=User cancelled',
                );
              }
            },
          },
        };

        let paymentFailureReason = '';
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response: RazorpayErrorResponse) => {
          paymentFailureReason =
            response.error.description ||
            response.error.reason ||
            'Unknown error';
        });
        rzp.open();
      } else {
        notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.TENANT_CREATED);
        navigate('/home');
      }
    } catch (error) {
      notifyError(
        (error as string) ||
          FRONTEND_MESSAGE_CONSTANTS.ERROR.TENANT_CREATION_FAILED,
      );
    }
  };

  if (isVerifying) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12 flex gap-12 items-start">
        <aside className="hidden lg:flex flex-col w-72 shrink-0 gap-8">
          <div className="bg-gradient-to-br from-indigo-800 to-indigo-600 text-white rounded-2xl p-6 shadow-md">
            <h2 className="text-lg font-bold mb-1">Welcome to Veltrex</h2>
            <p className="text-white/75 text-sm">
              You're just two steps away from managing your shop floor smarter.
            </p>

            <div className="mt-6 flex items-end gap-2 h-20">
              <div className="w-5 h-8 bg-white/30 rounded" />
              <div className="w-5 h-12 bg-orange-400 rounded" />
              <div className="w-5 h-9 bg-white/30 rounded" />
              <div className="w-5 h-16 bg-white/50 rounded" />
              <div className="w-5 h-8 bg-white/30 rounded" />
              <div className="w-5 h-20 bg-orange-500 rounded" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              What you'll unlock
            </p>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">⚙</span>
                Machine &amp; job scheduling dashboard
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">📊</span>
                Real-time production analytics
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">👥</span>
                Team member management
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-0.5">🔔</span>
                Priority technical support
              </li>
            </ul>
          </div>
        </aside>

        <main className="flex-1 max-w-2xl">
          <StepIndicator current={step} />

          {step === 'tenant' ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                Step 1 of 2
              </p>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Set up your organization
              </h1>
              <p className="text-gray-500 text-sm mb-7">
                Create your workspace so your team can start scheduling jobs.
              </p>

              <TenantStep
                onNext={handleTenantSubmit}
                isLoading={checkingName}
                defaultName={tenantName}
              />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">
                Step 2 of 2
              </p>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Choose a subscription plan
              </h1>
              <p className="text-gray-500 text-sm mb-7">
                {tenantName
                  ? `Almost done, ${tenantName}! Pick the plan that works for you.`
                  : 'Pick the plan that works best for your team.'}
              </p>

              <PlanStep
                tenantName={tenantName}
                onBack={() => setStep('tenant')}
                onFinish={handlePlanFinish}
              />
            </div>
          )}

          <p className="text-center text-xs text-gray-400 mt-6">
            Already have an organization?{' '}
            <a href="/home" className="text-indigo-600 hover:underline">
              Go to dashboard
            </a>
          </p>
        </main>
      </div>
    </div>
  );
};

export default OnboardingPage;
