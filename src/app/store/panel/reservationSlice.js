import { createSlice } from "@reduxjs/toolkit";
import { action } from "mobx";

const reservationSlice = createSlice({
  name: "reservation",
  initialState: {
    data: [],
  },
  reducers: {
    addReserve: (state, action) => {
      console.log("action.payload", action.payload);
      const newItem = action.payload;
      state.data.push(newItem);
      console.log("new data", state.data);
    },
  },
});

export const { addReserve } = reservationSlice.actions;
export default reservationSlice.reducer;
