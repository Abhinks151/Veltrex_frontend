import { type Step } from './types';

interface StepIndicatorProps {
  current: Step;
}

const StepIndicator = ({ current }: StepIndicatorProps) => (
  <div className="flex items-center gap-3 mb-10">
    <div className="flex items-center gap-2">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all
          bg-indigo-700 border-indigo-700 text-white`}
      >
        {current === 'plan' ? '✓' : '1'}
      </div>
      <span
        className={`text-sm font-medium ${
          current === 'tenant' ? 'text-indigo-700' : 'text-gray-400'
        }`}
      >
        Organization
      </span>
    </div>

    <div className="flex-1 h-px bg-gray-200 max-w-[60px]" />

    <div className="flex items-center gap-2">
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all
          ${
            current === 'plan'
              ? 'bg-indigo-700 border-indigo-700 text-white'
              : 'bg-gray-200 border-gray-200 text-gray-400'
          }`}
      >
        2
      </div>
      <span
        className={`text-sm font-medium ${
          current === 'plan' ? 'text-indigo-700' : 'text-gray-400'
        }`}
      >
        Subscription
      </span>
    </div>
  </div>
);

export default StepIndicator;
