import { useEffect, useState } from 'react';
import Navbar from '@/shared/components/custom/Navbar';
import { Button } from '@/shared/components/ui/button';
import { paymentService } from '@/services/paymentService';
import { useNavigate } from 'react-router-dom';

interface TenantRestrictedViewProps {
  reason?: 'blocked' | 'expired';
}

const TenantRestrictedView = ({
  reason = 'blocked',
}: TenantRestrictedViewProps) => {
  const isExpired = reason === 'expired';
  const navigate = useNavigate();
  const [pendingPaymentId, setPendingPaymentId] = useState<string | null>(null);

  useEffect(() => {
    if (isExpired) {
      paymentService.getLatestPending().then((res) => {
        if (res.data?.id) {
          setPendingPaymentId(res.data.id);
        }
      });
    }
  }, [isExpired]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex items-center justify-center px-6 py-24">
        <div className="glass max-w-xl w-full p-10 rounded-[2.5rem] shadow-2xl text-center animate-in fade-in zoom-in duration-500">
          <div className="mb-8">
            <h1
              className={`text-4xl font-extrabold tracking-tight ${isExpired ? 'text-amber-500' : 'text-destructive'}`}
            >
              Access <span className="text-foreground">Restricted</span>
            </h1>
            <p className="text-muted-foreground text-lg mt-3 max-w-md mx-auto">
              {isExpired
                ? "Your access period has concluded. Let's get you back on track."
                : 'Your organization access is currently suspended.'}
            </p>
          </div>

          <div
            className={`rounded-2xl p-5 text-sm mb-10 flex items-center gap-3 text-left ${
              isExpired
                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-600'
                : 'bg-destructive/10 border border-destructive/20 text-destructive'
            }`}
          >
            <div className="h-2 w-2 rounded-full bg-current animate-pulse shrink-0" />
            <p>
              {isExpired
                ? 'Choose a premium plan to instantly unblock all machines and analytics features.'
                : 'Access to the platform is restricted. This could be due to policy violations or administrative action.'}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {pendingPaymentId ? (
              <>
                <Button
                  size="lg"
                  className="premium-gradient hover:opacity-90 h-14 text-lg font-bold shadow-lg"
                  onClick={() => navigate(`/payment/retry/${pendingPaymentId}`)}
                >
                  Complete Pending Payment
                </Button>
                <button
                  onClick={() => navigate('/plans')}
                  className="text-sm text-blue-500 hover:text-primary transition-colors mt-2"
                >
                  Choose a different plan instead
                </button>
              </>
            ) : (
              <Button
                size="lg"
                className="premium-gradient hover:opacity-90 h-14 text-lg font-bold shadow-lg"
                onClick={() => navigate('/plans')}
              >
                {isExpired ? 'Browse Premium Plans' : 'Contact Support'}
              </Button>
            )}

            <Button
              variant="outline"
              className="h-14 text-lg font-semibold mt-4"
              onClick={() => navigate('/login')}
            >
              Log Out and Change Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantRestrictedView;
