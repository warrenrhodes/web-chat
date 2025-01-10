import { Prisma } from "@prisma/client";

export interface User {
  authId: string;
  email: string;
  name: string;
  photoURL: string | null;
  createdAt: string;
  lastSeen?: string;
}

export interface Chat {
  participants: string[]; // Array of user IDs
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
}

export type IChat = Prisma.ChatGetPayload<{
  include: {
    messages: {
      orderBy: {
        createdAt: "desc";
      };
    };
  };
}>;
