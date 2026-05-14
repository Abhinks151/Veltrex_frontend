import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-vh-100 bg-light h-screen">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger">403</h1>
        <p className="fs-3"> <span className="text-danger">Opps!</span> Access Denied.</p>
        <p className="lead">
          You don't have permission to access this page.
        </p>
        <Link to="/"><Button variant="primary">Go Home</Button></Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
