import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

import type { PrivateChat, GroupChat, Message } from "../../shared/types";

interface chats {
  [key: string]: PrivateChat | GroupChat;
}

const initialState = {
  chats: {} as chats,
  activeChatID: -1,
  activeChat: {} as PrivateChat | GroupChat | undefined,
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    addChat: (state, action: PayloadAction<GroupChat | PrivateChat>) => {
      state.chats = {
        ...state.chats,
        [action.payload.chatId]: action.payload,
      };
    },

    selectChat: (state, action: PayloadAction<number>) => {
      state.activeChatID = action.payload;
    },

    addMessageToChat: (state, action: PayloadAction<Message>) => {
      const chat = state.chats[action.payload.chatId];

      if (chat) {
        chat.messages.push(action.payload);
      }

      state.chats = {
        ...state.chats,
        [action.payload.chatId]: chat,
      };
    },
  },
});

export const { setChats, addChat, selectChat, addMessageToChat } =
  chatsSlice.actions;
export const selectChats = (state: RootState) => state.chats.chats;
// export const getSelectedChat = (state: RootState) =>
//   state.chats.chats.filter((chat) => (chat.chatId = state.chats.activeChat))[0];

export default chatsSlice.reducer;
