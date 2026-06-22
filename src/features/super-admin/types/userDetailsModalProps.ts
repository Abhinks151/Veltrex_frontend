import type { User } from '../types';

export interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}
