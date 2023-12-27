import { combineReducers } from "@reduxjs/toolkit";
import reservation from "./reservationSlice.js";

const panelReducers = combineReducers({
  reservation,
});

export default panelReducers;
