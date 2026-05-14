import Navbar from "@/shared/components/custom/Navbar";
import { Button } from "@/shared/components/ui/button";

const TenantRestrictedView = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex items-center justify-center px-6 py-20">
        <div className="bg-white max-w-xl w-full p-8 rounded-xl shadow-md text-center">

          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-red-600">
              Access Restricted
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Your organization has been temporarily restricted.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 mb-6">
            You currently don’t have access to the Veltrex platform.
            This could be due to billing issues or policy restrictions.
          </div>

          <div className="space-y-3">
            <Button variant={"primary"} className="w-full">
              Contact Sales
            </Button>

            <Button variant="outline" className="w-full">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantRestrictedView;
