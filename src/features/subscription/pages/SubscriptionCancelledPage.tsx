import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/store/hooks';
import { Button } from '@/shared/components/ui/button';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';
import Navbar from '@/shared/components/custom/Navbar';
import { CreditCard, ArrowRight, LogOut } from 'lucide-react';

const SubscriptionCancelledPage = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="glass rounded-3xl p-12 text-center shadow-2xl animate-in fade-in zoom-in duration-500">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Subscription Cancelled
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            {isAdmin
              ? FRONTEND_MESSAGE_CONSTANTS.ERROR.SUBSCRIPTION_CANCELLED
              : FRONTEND_MESSAGE_CONSTANTS.ERROR.ACCESS_RESTRICTED_EMPLOYEE}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
            {isAdmin ? (
              <>
                <Button
                  size="lg"
                  variant="primary"
                  className="h-14 text-lg font-semibold shadow-lg bg-red-500 hover:bg-red-600 border-none"
                  onClick={() => navigate('/home')}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Renew Subscription
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 text-lg font-semibold"
                  onClick={() => navigate('/platform/login')}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  Login
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                variant="outline"
                className="col-span-full h-14 text-lg font-semibold"
                onClick={() => navigate('/platform/login')}
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Return to Login
              </Button>
            )}
          </div>

          <div className="mt-12 pt-12 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {isAdmin
                ? 'Your organization data is safe, but platform access is restricted until a new plan is activated.'
                : 'Your organization administrator has been notified. Please reach out to them for updates.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCancelledPage;
