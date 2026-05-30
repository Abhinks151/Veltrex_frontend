import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { planService, type Plan } from '@/services/planService';
import { paymentService } from '@/services/paymentService';
import { loadRazorpay } from '@/shared/utils/razorpayUtils';
import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { getSubscription } from '@/features/subscription/subscriptionThunk';
import { Button } from '@/shared/components/ui/button';
import { notifyError } from '@/shared/utils/toasterUtils';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import Navbar from '@/shared/components/custom/Navbar';
import Loader from '@/pages/Loader';
import axios from 'axios';
import { Check } from 'lucide-react';
import type {
  RazorpayOptions,
  RazorpayResponse,
  RazorpayErrorResponse,
} from '@/types/razorpay';

const PlansPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const { user } = useAppSelector((state) => state.auth);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const initializePage = async () => {
      setFetching(true);
      try {
        const subRes = await dispatch(getSubscription()).unwrap();

        let activeSub = false;
        if (
          subRes?.data?.status === 'ACTIVE' &&
          subRes.data.plan &&
          subRes.data.plan.price > 0
        ) {
          const endDate = subRes.data.endDate
            ? new Date(subRes.data.endDate)
            : null;
          if (endDate && endDate > new Date()) {
            activeSub = true;
            if (mode !== 'upgrade') navigate('/home');
          }
        }

        const res = await planService.getAllPlans();
        const allActivePlans = (res.data.data.plans || []).filter(
          (p: Plan) => !p.isBlocked,
        );

        const isTrialUsed = subRes?.data?.trialUsed || false;

        if (mode === 'upgrade' || activeSub || isTrialUsed) {
          setPlans(allActivePlans.filter((p: Plan) => p.price > 0));
        } else {
          setPlans(allActivePlans);
        }
      } catch {
        try {
          const res = await planService.getAllPlans();
          setPlans(
            (res.data.data.plans || []).filter((p: Plan) => !p.isBlocked),
          );
        } catch {
          notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.FAILED_FETCH_PLANS);
        }
      } finally {
        setFetching(false);
      }
    };

    initializePage();
  }, [dispatch, navigate, mode]);

  const handleSelectPlan = async (plan: Plan) => {
    if (loading) return;

    if (!user?.tenantId) {
      notifyError('Authentication session invalid. Please log in again.');
      return;
    }

    if (plan.price === 0) {
      try {
        setLoading(plan.id);

        await paymentService.activateFreePlan({
          tenantId: user.tenantId,
          planId: plan.id,
        });

        navigate('/payment-status?status=success');
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          notifyError(
            error.response?.data?.message ||
              'Could not activate free plan. Please try again.',
          );
        } else {
          notifyError('Could not activate free plan. Please try again.');
        }
      } finally {
        setLoading(null);
      }
      return;
    }

    await handlePay(plan);
  };

  const handlePay = async (plan: Plan) => {
    if (!user?.tenantId) {
      notifyError('Authentication session invalid. Please log in again.');
      return;
    }

    try {
      setLoading(plan.id);
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.RAZORPAY_LOAD_FAILED);
        return;
      }

      const orderRes = await paymentService.createOrder({
        tenantId: user.tenantId,
        planId: plan.id,
      });

      const { orderId, amount, currency, paymentId } = orderRes.data;

      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount,
        currency,
        name: 'Veltrex',
        description: `Plan: ${plan.name}`,
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
              navigate('/payment-status?status=success');
            })
            .catch(() => {
              setIsVerifying(false);
              navigate(
                '/payment-status?status=failure&reason=Verification failed',
              );
            });
        },
        theme: { color: '#4F46E5' },
        modal: {
          ondismiss: () => {
            setLoading(null);
            if (!isVerifying) {
              notifyError(
                'Payment was not completed. Please try again to activate your plan.',
              );
              navigate('/payment-status?status=failure&reason=User cancelled');
            }
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: RazorpayErrorResponse) => {
        const reason = response.error.description || 'Transaction failed';
        navigate(
          `/payment-status?status=failure&reason=${encodeURIComponent(reason)}`,
        );
      });
      rzp.open();
    } catch (error) {
      console.error('Checkout error:', error);
      notifyError('Could not initiate checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  if (isVerifying) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Choose the perfectplan for your shop
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {mode === 'upgrade'
              ? 'Scale your manufacturing with professional tools and priority support.'
              : 'Select a plan to unlock full access to machines, fixtures, and analytics.'}
          </p>
        </div>

        {fetching ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                className={`w-full max-w-sm glass card-hover rounded-3xl p-8 relative overflow-hidden flex flex-col ${
                  index === 1
                    ? 'border-primary ring-1 ring-primary shadow-xl shadow-primary/10'
                    : ''
                }`}
              >
                {index === 1 && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-xs font-bold rounded-bl-xl tracking-widest uppercase">
                    Recommended
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">
                      {plan.currency} {Number(plan.price).toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      /{plan.durationDays} days
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {[
                    'Unlimited Machine Management',
                    'Advanced Fixture Tracking',
                    'Real-time Analytics Dashboard',
                    'Priority Technical Support',
                  ].map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <div className="mt-1 bg-primary/10 text-primary rounded-full p-0.5">
                        <Check size={14} />
                      </div>
                      {feat}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.price === 0 ? 'outline' : 'primary'}
                  size="lg"
                  onClick={() => handleSelectPlan(plan)}
                  disabled={!!loading}
                  className="w-full"
                >
                  {loading === plan.id
                    ? 'Processing...'
                    : plan.price === 0
                      ? 'Start Free Trial'
                      : 'Choose Plan'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansPage;
