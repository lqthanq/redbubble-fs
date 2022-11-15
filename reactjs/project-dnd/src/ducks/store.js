import { combineReducers, configureStore } from "@reduxjs/toolkit";

import * as reducer from "./index";

const store = configureStore({
  reducer: combineReducers(reducer),
});
export default store;
