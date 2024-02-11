export interface User {
  id: number;
  username: string;
  createdAt: string | Date;
}

export interface LoggedInUser extends User {
  token: string;
}

export interface Chat {
  chatId: number;
  name: string;
  type: "PRIVATE" | "GROUP";
  createdAt: string | Date;
  messages: Message[];
}

export interface PrivateChat extends Chat {
  receipient: string;
}

export interface GroupChat extends Chat {
  users: User[];
}

export interface Message {
  messageId: number;
  content: string;
  attachment: string | null;
  createdAt: string | Date;
  sender: User;
}
