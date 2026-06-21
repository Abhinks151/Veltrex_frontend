import React from 'react';
import { LogOut, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/features/auth/authSlice';
import { setAccessToken } from '@/app/api/axios';
import { useAppDispatch } from '@/app/store/hooks';

const TenantBlocked: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    setAccessToken(null);
    navigate('/platform/login');
  };

  function handleTryagain() {
    window.location.href = '/platform';
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl">
        <div className="mb-6 inline-flex p-4 rounded-2xl bg-red-50 border border-red-100">
          <ShieldAlert className="w-12 h-12 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
          Access Restricted
        </h1>

        <p className="text-slate-600 mb-8 leading-relaxed">
          Your organization's access to Veltrex has been suspended. Please
          contact your system administrator for more information or to resolve
          this issue.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogOut className="w-5 h-5" />
            Back to Login
          </button>

          <button
            onClick={handleTryagain}
            className="w-full py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-2xl transition-all duration-300 border border-slate-200"
          >
            Try Again
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-slate-500 text-sm">
            Veltrex Enterprise Security Protocol
          </p>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-100 rounded-full blur-[120px] -z-10" />
    </div>
  );
};

export default TenantBlocked;
