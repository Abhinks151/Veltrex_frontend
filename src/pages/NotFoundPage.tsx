import { Link, useLocation } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { useAppSelector } from "@/app/store/hooks";
import { Roles } from "@/shared/constants/rolesEnum";

const NotFoundPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();
  return (
    <div className="min-h-screen bg-gray-50">

      <div className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>

        <h2 className="mt-4 text-xl font-semibold text-gray-700">
          Page not found
        </h2>

        <p className="mt-2 text-gray-500 max-w-md">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <Link to={
          user?.role === Roles.SUPER_ADMIN ? "/super-admin" :
            user?.role === Roles.MACHINIST || user?.role === Roles.MAINTENANCE ? "/platform" :
              location.pathname.includes("/platform") ? "/platform" : "/home"
        }>
          <Button variant={"secondary"} className="mt-6">
            Go back home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;