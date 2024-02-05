import { configureStore } from "@reduxjs/toolkit";
import FontReducer from "./fontSlice";
export const makeStore = () => {
  return configureStore({
    reducer: {
      font: FontReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
