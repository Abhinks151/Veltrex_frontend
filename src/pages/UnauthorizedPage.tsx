import { Button } from '@/shared/components/ui/button';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/app/store/hooks';
import { Roles } from '@/shared/constants/rolesEnum';

const UnauthorizedPage = () => {
  const user = useAppSelector((state) => state.auth.user);

  const getHomeRoute = () => {
    if (!user) return '/';
    if (user.role === Roles.SUPER_ADMIN) return '/super-admin';
    if ([Roles.ADMIN, Roles.MACHINIST, Roles.MAINTENANCE].includes(user.role))
      return '/platform';
    return '/home';
  };

  return (
    <div className="flex flex-col items-center justify-center min-vh-100 bg-light h-screen">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger">403</h1>
        <p className="fs-3">
          {' '}
          <span className="text-danger">Opps!</span> Access Denied.
        </p>
        <p className="lead">You don't have permission to access this page.</p>
        <Link to={getHomeRoute()}>
          <Button variant="primary">Go Back</Button>
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
