import { getSubdomain } from '@/shared/utils/subdomain';
import { Navigate } from 'react-router-dom';

interface SubdomainGateProps {
  subdomainElement: React.ReactNode;
  rootElement: React.ReactNode;
}

const SubdomainGate = ({
  subdomainElement,
  rootElement,
}: SubdomainGateProps) => {
  const subdomain = getSubdomain();
  return subdomain ? <>{subdomainElement}</> : <>{rootElement}</>;
};

export const RootDomainOnly = ({ children }: { children: React.ReactNode }) => {
  const subdomain = getSubdomain();
  if (subdomain) {
    return <Navigate to="/platform" replace />;
  }
  return <>{children}</>;
};

export const SubdomainOnly = ({ children }: { children: React.ReactNode }) => {
  const subdomain = getSubdomain();
  if (!subdomain) {
    return <Navigate to="/platform/login" replace />;
  }
  return <>{children}</>;
};

export default SubdomainGate;
