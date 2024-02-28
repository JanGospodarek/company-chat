export interface User {
  id: number;
  username: string;
  name: string;
  surname: string;
}

interface Chat {
  chatId: number;
  name: string;
  type: "PRIVATE" | "GROUP";
  createdAt: string | Date;
  messages: Message[];
}

export interface PrivateChat extends Chat {
  receipient: User;
}

export interface GroupChat extends Chat {
  users: User[];
}

export interface Message {
  chatId: number;
  messageId: number;
  content: string;
  attachment: string | null;
  createdAt: string | Date;
  user: User;
  readBy: User[];
}

export interface Attachment {
  id: number;
  uuid: string;
  path: string;
  type: string;
  name: string;
}
