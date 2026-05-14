import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const SuperAdminLayout = () => {
  return (
    <div className="flex bg-white min-h-screen">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden bg-white">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
