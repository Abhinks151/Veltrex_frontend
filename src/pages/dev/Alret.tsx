import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { logoutUser } from "@/features/auth/authThunk";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';


const Alert = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  function handleAlert() {
    // Swal.fire({
    //   title: "Verification successfull",
    //   text: "You have been verified successfully",
    //   icon: "success",
    //   confirmButtonText: "Cancel"
    // });

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        actions: "flex gap-3",
        confirmButton: buttonVariants({
          variant: "primary",
          size: "lg",
        }),
        cancelButton: buttonVariants({
          variant: "destructive",
          size: "lg",
        }),
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        dispatch(logoutUser());

        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error"
        });
      }
    });
  }

  return (
    <div>
      <Button onClick={handleAlert}>Logout</Button>
      <Link to="/auth/login">
        <Button>Login</Button>
      </Link>
      <h1>{user?.email}</h1>
      <h1>{user?.role}</h1>
      <h1>{token}</h1>
    </div>
  );
};

export default Alert;