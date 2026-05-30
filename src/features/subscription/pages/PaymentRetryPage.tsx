import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { paymentService } from '@/services/paymentService';
import { loadRazorpay } from '@/shared/utils/razorpayUtils';
import { notifyError } from '@/shared/utils/toasterUtils';
import Navbar from '@/shared/components/custom/Navbar';
import Loader from '@/pages/Loader';
import { Button } from '@/shared/components/ui/button';

import type {
  RazorpayOptions,
  RazorpayResponse,
  RazorpayErrorResponse,
} from '@/types/razorpay';

const PaymentRetryPage = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!paymentId) {
      navigate('/subscription-expired');
    } else {
      setLoading(false);
    }
  }, [paymentId, navigate]);

  const handleRetry = async () => {
    if (!paymentId) return;

    try {
      setRetrying(true);
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        notifyError('Razorpay SDK failed to load');
        return;
      }

      const res = await paymentService.retryPayment(paymentId);
      const { orderId, amount, currency, paymentId: newPaymentId } = res.data;

      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount,
        currency,
        name: 'Veltrex',
        description: 'Complete Subscription Payment',
        order_id: orderId,
        handler: (response: RazorpayResponse) => {
          setIsVerifying(true);
          paymentService
            .verifyPayment({
              paymentId: newPaymentId,
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
            setRetrying(false);
            if (!isVerifying) {
              notifyError('Payment was not completed.');
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
    } catch {
      notifyError('Failed to initiate retry');
    } finally {
      setRetrying(false);
    }
  };

  if (loading || isVerifying) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">💳</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Complete Payment
          </h1>
          <p className="text-gray-500 mb-8 text-sm">
            You have a pending subscription payment. Please complete it to
            unlock your organization's full features.
          </p>

          <Button
            variant="primary"
            className="w-full h-12 text-lg"
            onClick={handleRetry}
            disabled={retrying}
          >
            {retrying ? 'Processing...' : 'Pay Now'}
          </Button>

          <button
            onClick={() => navigate('/plans')}
            className="mt-4 text-gray-400 text-xs hover:text-indigo-600 transition-colors"
          >
            Choose a different plan instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentRetryPage;
