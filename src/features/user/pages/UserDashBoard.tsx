// import { Button } from "@/shared/components/ui/button"
// import { useAppDispatch } from "@/app/store/hooks"
// import { logoutUser } from "@/features/auth/authThunk"
// import { Link } from "react-router-dom"
// import { notifyError, notifySuccess } from "@/shared/utils/toasterUtils"
// import { FRONTEND_MESSAGE_CONSTANTS } from '../../../shared/constants/messageConstants';

// const UserDashBoard = () => {
//   const dispatch = useAppDispatch()

//   function handleLogout() {
//     try {
//       dispatch(logoutUser());
//       notifySuccess(FRONTEND_MESSAGE_CONSTANTS.SUCCESS.LOGOUT)
//     } catch (error) {
//       notifyError(error as string || FRONTEND_MESSAGE_CONSTANTS.ERROR.LOGOUT_FAILED)
//     }
//   }

//   return (
//     <div className="flex flex-col justify-center align-center text-center text-3xl font-bold h-screen">
//       <h1>User Dashboard</h1>
//       <Link to="/home" ><Button className="w-fit mx-auto mt-4" variant="secondary">Go to Home</Button></Link>
//       <Button className="w-fit mx-auto mt-4" onClick={handleLogout} variant="primary">Logout</Button>
//     </div>
//   )
// }

// export default UserDashBoard
import { useAppSelector } from "@/app/store/hooks"

const UserDashBoard = () => {

  const { user } = useAppSelector((state) => state.auth)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <p className="text-gray-600">Welcome <span className="font-semibold text-gray-900">{user?.name}</span></p>
        <p className="text-gray-600 mt-2">Your role is <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4f46e5]/10 text-[#4f46e5] capitalize">{user?.role}</span></p>
      </div>
    </div>
  )
}

export default UserDashBoard