import { createSlice } from "@reduxjs/toolkit";

interface initialStateType {
  fontSize: 1 | 1.2 | 1.4;
  theme: "normal" | "highContrast";
}

const initialState: initialStateType = {
  fontSize: 1,
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
      action.payload === "normal"
        ? (state.theme = "normal")
        : (state.theme = "highContrast");
      console.log(state.theme);
    },
  },
});

export const { setFontSize, setTheme } = uiSlice.actions;

export default uiSlice.reducer;
