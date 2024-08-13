import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "@/slices/eventSlice";
import authReducer from "@/slices/authSlice";
import dashboardReducer from "@/slices/dashboardSlice";

export const store = configureStore({
  reducer: {
    event: eventReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
