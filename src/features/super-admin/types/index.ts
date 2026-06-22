export type Tenant = {
  id: string;
  name: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  isDeleted: boolean;

  profileImage?: string;
  profileImageKey?: string;

  createdAt: string;
  updatedAt: string;
};
