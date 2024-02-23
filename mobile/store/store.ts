import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";
import UserReducer from "./userSlice";
import activeUsersReducer from "./activeUsersSlice";
import chatsSlice from "./chatsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      ui: uiReducer,
      user: UserReducer,
      activeUsers: activeUsersReducer,
      chats: chatsSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export const store = makeStore();

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
