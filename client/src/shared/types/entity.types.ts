// User

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Board

export interface Board {
  id: string;
  name: string;
  icon?: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardDetail extends Board {
  membersCount: number;
}

// Item

export interface Item {
  id: string;
  type: ItemType;
  boardId: string;
  createdById?: string;
  createdBy?: User;
  createdAt: string;
  updatedAt: string;
  note?: Note;
}

export type ItemType = "NOTE";

export interface Note {
  id: string;
  content: string;
}

export interface Invitation {
  id: string;
  status: InvitationStatus;
  boardId: string;
  senderId?: string;
  sender?: User;
  receiverId: string;
  receiver: User;
  createdAt: string;
  respondedAt?: string;
}

export type InvitationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface Notification {
  id: string;
  type: NotificationType;
  needsAction: boolean;
  payload: any;
  receiverId: string;
  invitationId?: string;
  invitation: Invitation;
  createdAt: string;
  readAt?: string;
}

export type NotificationType = "INVITATION_RECEIVED";
