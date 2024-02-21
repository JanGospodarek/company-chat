import { createSlice } from "@reduxjs/toolkit";

interface initialStateType {
  fontSize: "normal" | "large";
  isInitial: boolean;
}

const initialState: initialStateType = {
  fontSize: "normal",
  isInitial: true,
};

const fontSlice = createSlice({
  name: "font",
  initialState,
  reducers: {
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
      state.isInitial = false;
    },
  },
});

export const { setFontSize } = fontSlice.actions;

export default fontSlice.reducer;
