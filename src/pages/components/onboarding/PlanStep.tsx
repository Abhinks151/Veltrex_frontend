import { useState } from "react";
import { PlanType } from "@/features/subscription/types";
import { PLANS } from "@/shared/constants/plans";
import { Button } from "@/shared/components/ui/button";

interface PlanStepProps {
  tenantName: string;
  onBack: () => void;
  onFinish: (planId: PlanType) => void;
}

const PlanStep = ({
  tenantName,
  onBack,
  onFinish,
}: PlanStepProps) => {
  const [selected, setSelected] = useState<PlanType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!selected) return;
    setLoading(true);

    if (selected === PlanType.PRO) {
      console.log("PRO plan selected for tenant:", tenantName);
    }

    onFinish(selected);
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setSelected(plan.id)}
            className={`text-left rounded-xl p-5 border-2 transition-all focus:outline-none
              ${selected === plan.id
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 bg-white hover:border-indigo-300"
              }`}
          >
            {plan.highlighted && (
              <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded-full mb-2 inline-block">
                MOST POPULAR
              </span>
            )}
            <h3 className="font-semibold text-gray-800 mt-1">{plan.title}</h3>
            <div className="mt-1 mb-3">
              <span className="text-xl font-bold text-gray-900">
                {plan.price}
              </span>
              <span className="text-gray-400 text-xs ml-1">{plan.duration}</span>
            </div>
            <ul className="space-y-1 text-xs text-gray-500">
              {plan.features.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>
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
            ? "Processing…"
            : selected === PlanType.PRO
              ? "Proceed to Payment"
              : "Start Free Trial"}
        </Button>
      </div>
    </div>
  );
};

export default PlanStep;
