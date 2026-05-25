import { useState, useEffect } from 'react';
import { planService, type Plan } from '@/services/planService';
import { Button } from '@/shared/components/ui/button';
import { notifyError } from '@/shared/utils/toasterUtils';

interface PlanStepProps {
  tenantName: string;
  onBack: () => void;
  onFinish: (planCode: string) => void;
}

const PlanStep = ({ tenantName, onBack, onFinish }: PlanStepProps) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await planService.getAllPlans();
        const activePlans: Plan[] = (res.data?.data || []).filter(
          (p: Plan) => !p.isBlocked,
        );
        setPlans(activePlans);
      } catch {
        notifyError('Failed to load plans. Please try again.');
      } finally {
        setFetching(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async () => {
    if (!selected) return;
    setLoading(true);
    onFinish(selected);
    setLoading(false);
  };

  const selectedPlan = plans.find((p) => p.code === selected);

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelected(plan.code)}
            className={`text-left rounded-xl p-5 border-2 transition-all focus:outline-none
              ${
                selected === plan.code
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-indigo-300'
              }`}
          >
            {plan.durationDays === null && (
              <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full mb-2 inline-block">
                BEST VALUE
              </span>
            )}
            <h3 className="font-semibold text-gray-800 mt-1">{plan.name}</h3>
            <div className="mt-1 mb-3">
              <span className="text-xl font-bold text-gray-900">
                {plan.currency} {Number(plan.price).toLocaleString()}
              </span>
              <span className="text-gray-400 text-xs ml-1">
                {plan.durationDays
                  ? `/ ${plan.durationDays} days`
                  : '/ lifetime'}
              </span>
            </div>
            {plan.description && (
              <p className="text-xs text-gray-500">{plan.description}</p>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={onBack}
        >
          ← Back
        </Button>

        <Button
          type="button"
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={!selected || loading}
          onClick={handleSubscribe}
        >
          {loading
            ? 'Processing…'
            : selectedPlan?.price === 0
              ? 'Start Free Trial'
              : 'Proceed to Payment'}
        </Button>
      </div>

      {tenantName && selected && (
        <p className="text-center text-xs text-gray-400">
          Setting up <strong>{tenantName}</strong> on the{' '}
          <strong>{selectedPlan?.name}</strong> plan.
        </p>
      )}
    </div>
  );
};

export default PlanStep;
