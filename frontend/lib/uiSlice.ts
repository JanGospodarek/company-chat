import { createSlice } from "@reduxjs/toolkit";

interface initialStateType {
  fontSize: "normal" | "large";
  theme: "normal" | "high-contrast";
}

const initialState: initialStateType = {
  fontSize: "normal",
  theme: "normal",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload ? "high-contrast" : "normal";
    },
  },
});

export const { setFontSize, setTheme } = uiSlice.actions;

export default uiSlice.reducer;
