import { useState } from "react";
import { notifySuccess, notifyError } from "@/shared/utils/toasterUtils";
import { Button } from "@/shared/components/ui/button";
import Navbar from "@/shared/components/custom/Navbar";
import { profileService } from "@/services/profileService";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const navigate = useNavigate();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      notifyError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      notifyError("Password must be at least 8 characters long");
      return;
    }

    try {
      setIsUpdating(true);
      await profileService.changePassword({ currentPassword, newPassword, confirmPassword });
      notifySuccess("Password changed successfully");
      navigate("/profile");
    } catch (error: unknown) {
      notifyError((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to change password");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 md:p-12 flex flex-col items-center">
        <div className="max-w-xl w-full">
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Security</h1>
              <p className="text-gray-500">Update your account password</p>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          </header>

          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none" />

            <div className="flex items-center justify-center mb-10">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <ShieldCheck size={32} />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-gray-100 border-none rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-100 border-none rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-100 border-none rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-6">
                <Button
                  variant="primary"
                  onClick={handleChangePassword}
                  disabled={isUpdating}
                  className="w-full rounded-2xl h-14 font-bold shadow-lg shadow-indigo-200 mt-4"
                >
                  {isUpdating ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangePasswordPage;
