import { setAccessToken } from "@/app/api/axios";
import store from "@/app/store/store";
import { setAuth, setInitialized } from "./authSlice";
import { authService } from "@/services/authServices";

export const initAuth = async () => {
  try {
    // const refreshRes = await axiosInstance.post("/auth/refresh", {});
    const refreshRes = await authService.refresh();
    const { access_token } = refreshRes.data.data;

    setAccessToken(access_token);

    // const profileRes = await axiosInstance.get("/auth/profile");
    const profileRes = await authService.profile();
    const user = profileRes.data.data;

    store.dispatch(setAuth({ user, token: access_token }));
  } catch (error) {
    console.debug("Silent auth failed", error);
    setAccessToken(null);
  } finally {
    store.dispatch(setInitialized());
  }
};
