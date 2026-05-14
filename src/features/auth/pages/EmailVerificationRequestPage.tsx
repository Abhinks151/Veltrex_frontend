// import { axiosInstance } from "@/app/api/axios";
// import { Button } from "@/shared/components/ui/button";
// import { useState } from "react";
// import { useLocation } from "react-router-dom";

// const EmailVerificationRequestPage = () => {

//   const [message, setMessage] = useState<string | null>(null)
//   const location = useLocation();
//   const email = location.state?.email;
//   async function handleResendVerificationEmail() {
//     try {
//       const response = await axiosInstance.post('/auth/resend', { email });
//       setMessage(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.VERIFICATION_EMAIL_SENT);
//       console.log(response);
//     } catch (err) {
//       setMessage(FRONTEND_MESSAGE_CONSTANTS.ERROR.FAILED_RESEND_EMAIL);
//     }
//   }


//   return (
//     <div className="flex flex-col w-screen h-screen justify-center items-center text-center gap-4">
//       <h1 className="text-2xl font-bold">Email sent to registered email address</h1>
//       <p className="max-w-md">Please check your email and click on the verification link to verify your email address.</p>
//       <Button onClick={handleResendVerificationEmail} variant="outline">Resend Verification Email</Button>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default EmailVerificationRequestPage;


import { authService } from "@/services/authServices";
import { Button } from "@/shared/components/ui/button";
import { RESEND_EMAIL_COOLDOWN } from "@/shared/constants/constant";
import { notifyError, notifySuccess } from "@/shared/utils/toasterUtils";
import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FRONTEND_MESSAGE_CONSTANTS } from '../../../shared/constants/messageConstants';

const EmailVerificationRequestPage = () => {
  // const [message, setMessage] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(RESEND_EMAIL_COOLDOWN);
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (timer > 0) {
      const timerId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [timer]);

  async function handleResendVerificationEmail() {
    if (!email) {
      // setMessage(FRONTEND_MESSAGE_CONSTANTS.ERROR.SESSION_EXPIRED);
      notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.SESSION_EXPIRED);
      return;
    }

    try {
      // await axiosInstance.post('/auth/resend', { email });
      await authService.resendVerificationEmail(email);
      // setMessage(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.VERIFICATION_EMAIL_SENT);
      notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.VERIFICATION_EMAIL_SENT);
      setTimer(RESEND_EMAIL_COOLDOWN);
    } catch {
      // setMessage(FRONTEND_MESSAGE_CONSTANTS.ERROR.FAILED_RESEND_EMAIL);
      notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.FAILED_RESEND_EMAIL);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-md p-8 w-[400px] text-center">
        <h2 className="text-xl font-semibold mb-1">Verify Your Email</h2>

        <p className="text-sm text-gray-500 mb-6">
          We’ve sent a verification link to your email address.
          Please check your inbox and click the link to activate your account.
        </p>

        {email && (
          <p className="text-sm text-gray-700 mb-4">
            <span className="font-medium">Email:</span> {email}
          </p>
        )}

        <Button
          onClick={handleResendVerificationEmail}
          variant="outline"
          disabled={timer > 0}
          size="xl"
          className="w-full hover:cursor-pointer active:bg-blue-300 active:border-blue-300 active:scale-95"
        >
          {timer > 0 ? `Resend in ${timer}s` : "Resend Verification Email"}
        </Button>

        {/* {message && (
          <p className="text-sm mt-4 text-gray-600">
            {message}
          </p>
        )} */}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Already verified?{" "}
            <Link to="/auth/login" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationRequestPage;