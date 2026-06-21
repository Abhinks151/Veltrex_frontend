import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCcw,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import Navbar from '@/shared/components/custom/Navbar';
import { useAppSelector } from '@/app/store/hooks';

const PaymentStatusSplash = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'success' | 'failure' | 'loading'>(
    'loading',
  );
  const { status: subStatus } = useAppSelector((state) => state.subscription);

  const isSuccess = searchParams.get('status') === 'success';
  const reason =
    searchParams.get('reason') || 'Transaction could not be completed';

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(isSuccess ? 'success' : 'failure');
    }, 1500);
    return () => clearTimeout(timer);
  }, [isSuccess]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <RefreshCcw size={48} className="text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">
          Finalizing your payment...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="glass rounded-3xl p-10 text-center shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          {status === 'success' ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="text-3xl font-extrabold mb-2">Welcome Aboard!</h1>
              <p className="text-muted-foreground mb-8 text-lg">
                Your subscription is now active. All platform features have been
                unlocked.
              </p>
              <Button
                size="lg"
                variant="primary"
                className="w-full hover:opacity-90 h-12 text-lg"
                onClick={() => navigate('/home')}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-destructive/10 text-destructive rounded-full mb-6">
                <XCircle size={40} />
              </div>
              <h1 className="text-3xl font-extrabold mb-2">Payment Failed</h1>
              <p className="text-muted-foreground mb-8 text-lg">{reason}</p>
              <div className="space-y-3">
                <Button
                  size="lg"
                  variant="primary"
                  className="w-full h-12 text-lg"
                  onClick={() => navigate('/plans')}
                >
                  <RefreshCcw className="mr-2 h-5 w-5" />
                  Try Again
                </Button>

                {subStatus === 'ACTIVE' && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-12 text-lg"
                    onClick={() => navigate('/home')}
                  >
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    Return to Dashboard
                  </Button>
                )}

                <button
                  onClick={() => navigate('/plans')}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors block w-full text-center"
                >
                  Choose a different plan
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentStatusSplash;
