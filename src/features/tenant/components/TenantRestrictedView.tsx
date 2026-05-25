import Navbar from '@/shared/components/custom/Navbar';
import { Button } from '@/shared/components/ui/button';

interface TenantRestrictedViewProps {
  reason?: 'blocked' | 'expired';
}

const TenantRestrictedView = ({
  reason = 'blocked',
}: TenantRestrictedViewProps) => {
  const isExpired = reason === 'expired';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex items-center justify-center px-6 py-20">
        <div className="bg-white max-w-xl w-full p-8 rounded-xl shadow-md text-center">
          <div className="mb-4">
            <h1
              className={`text-2xl font-semibold ${isExpired ? 'text-amber-600' : 'text-red-600'}`}
            >
              {isExpired ? 'Subscription Expired' : 'Access Restricted'}
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              {isExpired
                ? 'Your trial or subscription period has ended.'
                : 'Your organization has been temporarily restricted.'}
            </p>
          </div>

          <div
            className={`${isExpired ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-red-50 border-red-200 text-red-700'} border rounded-lg p-4 text-sm mb-6`}
          >
            {isExpired
              ? 'Please upgrade your plan to continue using Veltrex features.'
              : 'You currently don’t have access to the platform. This could be due to billing issues or policy restrictions.'}
          </div>

          <div className="space-y-3">
            <Button
              variant={isExpired ? 'primary' : 'primary'}
              className="w-full"
              onClick={() => (window.location.href = '/')} // Or specific upgrade page
            >
              {isExpired ? 'Upgrade Now' : 'Contact Support'}
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantRestrictedView;
