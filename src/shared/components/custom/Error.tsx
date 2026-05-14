import { AlertTriangle } from "lucide-react"

const Error = ({ message }: { message: string | undefined }) => {
  return (
    // <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded relative" role="alert">
    // <strong className="font-bold">Error!</strong>
    <div>
      <div className="flex items-center gap-2 ">
        <span><AlertTriangle className="text-red-500" /></span>
        <span className="block text-red-500 text-sm">{message}</span>
      </div>
    </div>
    // </div>
  )
}

export default Error