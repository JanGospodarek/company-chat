import { createSlice } from "@reduxjs/toolkit";

interface initialStateType {
  fontSize: "normal" | "large";
  isInitial: boolean;
  theme: "normal" | "highContrast";
}

const initialState: initialStateType = {
  fontSize: "normal",
  isInitial: true,
  theme: "normal",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
      state.isInitial = false;
    },
    setTheme: (state, action) => {
      action.payload === "normal"
        ? (state.theme = "normal")
        : (state.theme = "highContrast");
      console.log(state.theme);
    },
  },
});

export const { setFontSize, setTheme } = uiSlice.actions;

export default uiSlice.reducer;
