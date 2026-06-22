import ReusableModal from '@/shared/components/custom/ReusableModal';
import type { UserDetailsModalProps } from '../types/userDetailsModalProps';

const Detail = ({
  label,
  value,
}: {
  label: string;
  value: string | boolean;
}) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-900">
      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
    </p>
  </div>
);

const UserDetailsModal = ({ isOpen, onClose, user }: UserDetailsModalProps) => {
  if (!user) return null;

  return (
    <ReusableModal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      maxWidth="max-w-2xl"
    >
      <div className="grid grid-cols-2 gap-6">
        <div className="flex justify-center mb-6">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-28 h-28 rounded-full object-cover border"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center text-3xl font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <Detail label="Name" value={user.name} />
        <Detail label="Email" value={user.email} />

        <Detail label="Role" value={user.role} />
        <Detail label="Verified" value={user.isVerified} />

        <Detail label="Blocked" value={user.isBlocked} />
        <Detail label="Deleted" value={user.isDeleted} />

        <Detail
          label="Created At"
          value={new Date(user.createdAt).toLocaleString()}
        />
        <Detail
          label="Updated At"
          value={new Date(user.updatedAt).toLocaleString()}
        />

        {/* <Detail label="UUID" value={user.uuid} /> */}
        {/* <Detail label="User ID" value={user.userId} /> */}
      </div>
    </ReusableModal>
  );
};

export default UserDetailsModal;
