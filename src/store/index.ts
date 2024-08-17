import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "@/slices/eventSlice";
import authReducer from "@/slices/authSlice";
import dashboardReducer from "@/slices/dashboardSlice";
import registrationReducer from "@/slices/registrationSlice";

export const store = configureStore({
  reducer: {
    event: eventReducer,
    auth: authReducer,
    dashboard: dashboardReducer,
    registration: registrationReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
