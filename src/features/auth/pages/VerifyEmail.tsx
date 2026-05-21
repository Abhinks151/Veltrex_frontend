import { authService } from '@/services/authServices';
import { Button } from '@/shared/components/ui/button';
import { notifyError, notifySuccess } from '@/shared/utils/toasterUtils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');

  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      if (!token) {
        notifyError(FRONTEND_MESSAGE_CONSTANTS.ERROR.TOKEN_REQUIRED);
        navigate('/auth/check-email');
        return;
      }
      const response = await authService.verifyEmail(token);
      // console.log(response.data);
      notifySuccess(response.data.message);
      navigate('/auth/login');
    } catch (error: unknown) {
      notifyError(
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message || FRONTEND_MESSAGE_CONSTANTS.ERROR.SOMETHING_WENT_WRONG,
      );
      navigate('/auth/check-email');
      console.log(error);
    }
  };

  return (
    // <div>
    //   <h1>Verify Email</h1>
    //   <h1>Token: {token}</h1>
    //   <Button variant={"primary"} onClick={handleVerify}>Verify</Button>
    // </div>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Verify Your Email
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Click the button below to verify your account
        </p>

        {/* <div className="bg-gray-100 rounded-lg p-3 mb-6 break-all">
          <span className="text-xs text-gray-400">Token</span>
          <p className="text-sm text-gray-700 mt-1">{token}</p>
        </div> */}

        <Button
          variant="primary"
          className=""
          size={'xl'}
          onClick={handleVerify}
        >
          Verify Email
        </Button>
      </div>
    </div>
  );
};

export default VerifyEmail;
