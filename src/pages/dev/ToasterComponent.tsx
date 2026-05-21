import { Button } from '@/shared/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';
import { FRONTEND_MESSAGE_CONSTANTS } from '@/shared/constants/messageConstants';

const notify = () =>
  toast.error(FRONTEND_MESSAGE_CONSTANTS.VALIDATION.VALIDATION_ERROR);

const ToasterComponent = () => {
  return (
    <div>
      <Button variant={'default'} onClick={notify}>
        Make me a toast
      </Button>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default ToasterComponent;
