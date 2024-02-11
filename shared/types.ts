export interface User {
  id: number;
  username: string;
  createdAt: string;
}

export interface LoggedInUser extends User {
  token: string;
}

export interface Chat {
  chatId: number;
  name: string;
  type: "PRIVATE" | "GROUP";
  createdAt: string;
}

export interface PrivateChat extends Chat {
  receipient: string;
}

export interface GroupChat extends Chat {
  users: User[];
}
