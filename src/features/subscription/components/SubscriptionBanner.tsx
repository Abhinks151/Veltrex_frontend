import { useAppSelector } from '@/app/store/hooks';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Sparkles, AlertCircle, Clock } from 'lucide-react';

const SubscriptionBanner = () => {
  const navigate = useNavigate();
  const { plan, status, endDate } = useAppSelector(
    (state) => state.subscription,
  );
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';

  if (!plan || status !== 'ACTIVE') return null;

  const isTrial = plan.price === 0;
  const daysLeft = endDate
    ? Math.ceil(
        (new Date(endDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  if (daysLeft === null || daysLeft > 7) return null;

  return (
    <div
      className={`w-full py-2 px-4 flex items-center justify-center gap-4 text-sm font-medium animate-in slide-in-from-top duration-500 ${
        isTrial ? 'bg-indigo-600 text-white' : 'bg-amber-500 text-white'
      }`}
    >
      <div className="flex items-center gap-2">
        {isTrial ? <Sparkles size={16} /> : <Clock size={16} />}
        <span>
          {isTrial
            ? `Free trial ending in ${daysLeft} days. Unblock now to avoid platform access interruption.`
            : `Platform access expires in ${daysLeft} days.`}
        </span>
      </div>

      {isAdmin && (
        <Button
          variant="secondary"
          size="sm"
          className="h-7 px-3 text-xs bg-white text-indigo-700 hover:bg-white/90"
          onClick={() => navigate('/home?tab=billing')}
        >
          Get Full Access
        </Button>
      )}

      {!isAdmin && daysLeft <= 1 && (
        <div className="flex items-center gap-1 text-[10px] opacity-90 uppercase tracking-wider">
          <AlertCircle size={12} />
          Please contact admin
        </div>
      )}
    </div>
  );
};

export default SubscriptionBanner;
