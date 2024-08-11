import { configureStore } from "@reduxjs/toolkit";
import eventSlice from "@/slices/eventSlice";

export const store = configureStore({
  reducer: {
    event: eventSlice,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
