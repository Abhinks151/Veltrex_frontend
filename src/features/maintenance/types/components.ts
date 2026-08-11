import type { MaintenanceTicket } from '.';

export interface OpenTicketItemProps {
  ticket: MaintenanceTicket;
  actionLoading: boolean;
  onAssign: (id: string) => void;
}

export interface ActiveTicketItemProps {
  ticket: MaintenanceTicket;
  actionLoading: boolean;
  onRelease: (id: string) => void;
  onClose: (id: string) => void;
}

export interface CloseTicketModalProps {
  ticketId: string | null;
  onClose: () => void;
  onSubmit: (id: string, reason: string, duration?: number) => Promise<void>;
  actionLoading: boolean;
}
