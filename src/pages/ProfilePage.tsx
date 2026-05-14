import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { notifySuccess, notifyError } from "@/shared/utils/toasterUtils";
import { Button } from "@/shared/components/ui/button";
import Navbar from "@/shared/components/custom/Navbar";
import { profileService } from "@/services/profileService";
import { ImageCropper } from "@/shared/components/custom/ImageCropper";
import { Edit, Lock, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { updateUser } from "@/features/auth/authSlice";
import type { AxiosError } from "axios";

const ProfilePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profileImage, setProfileImage] = useState(user?.profileImage || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setProfileImage(user.profileImage || "");
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      const res = await profileService.updateProfile(name);
      dispatch(updateUser(res.data.data));
      notifySuccess("Profile updated successfully");
    } catch (error: unknown) {
      notifyError((error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImg(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropComplete = async (blob: Blob) => {
    try {
      setShowCropper(false);
      const res = await profileService.uploadProfileImage(blob);
      const url = res.data.data.url;
      setProfileImage(url);
      dispatch(updateUser({ profileImage: url }));
      notifySuccess("Profile image updated successfully");
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;

      notifyError(
        err.response?.data?.message || "Failed to upload image"
      );
    }
  };

  const handleResetPassword = () => {
    // Navigate to a separate page or show a modal
    // For now, let's assume we show a password change section or redirect
    navigate("/profile/change-password");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 p-6 md:p-12 flex flex-col items-center">
        <div className="max-w-xl w-full">
          <header className="mb-8 text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-500">Manage your personal information and security</p>
          </header>

          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 flex flex-col items-center relative overflow-hidden">
            {/* Glossy background detail */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none" />

            <div className="relative mb-8 group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-indigo-50 flex items-center justify-center">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-indigo-300">
                    {name?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>

              <label
                htmlFor="avatar-upload"
                className="absolute bottom-1 right-1 w-8 h-8 bg-indigo-900 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-indigo-800 transition-colors shadow-lg border-2 border-white"
              >
                <Edit size={14} />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>

            <button
              onClick={() => document.getElementById("avatar-upload")?.click()}
              className="text-xs font-bold text-indigo-900 uppercase tracking-widest mb-10 hover:text-indigo-700 transition-colors"
            >
              Upload Image
            </button>

            <div className="w-full space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-100 border-none rounded-xl p-4 text-gray-700 focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-gray-100 border-none rounded-xl p-4 text-gray-400 font-medium cursor-not-allowed pr-12"
                  />
                  <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                </div>
                <p className="text-[10px] text-gray-400 ml-1">
                  Email addresses are managed by your industrial administrator.
                </p>
              </div>

              <div className="pt-8 border-t border-gray-100 mt-10">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] text-center mb-8">
                  Security & Actions
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    onClick={handleResetPassword}
                    className="flex-1 rounded-2xl h-14 border-gray-200 text-indigo-900 font-bold"
                  >
                    <Lock size={18} className="mr-2" />
                    Reset Password
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="flex-1 rounded-2xl h-14 font-bold shadow-lg shadow-indigo-200"
                  >
                    <Save size={18} className="mr-2" />
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-8 text-center">
            <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
              Veltrex Industrial Forge • Version 4.4.2-B
            </p>
          </footer>
        </div>
      </main>

      {showCropper && selectedImg && (
        <ImageCropper
          imgSrc={selectedImg}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
