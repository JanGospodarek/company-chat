import { createSlice } from "@reduxjs/toolkit";

import type { User } from "../../shared/types";

const initialState = {
  users: [] as User[],
};

const activeUsersSlice = createSlice({
  name: "activeUsers",
  initialState,
  reducers: {
    setActiveUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setActiveUsers } = activeUsersSlice.actions;

export default activeUsersSlice.reducer;
