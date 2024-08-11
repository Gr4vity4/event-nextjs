import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Event } from "@/types";

interface EventState {
  events: Event[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: EventState = {
  events: [],
  status: "idle",
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async ({
    page,
    limit,
    sortField,
    sortOrder,
  }: {
    page: number;
    limit: number;
    sortField: string;
    sortOrder: string;
  }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    return response.json();
  },
);

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchEvents.fulfilled,
        (
          state,
          action: PayloadAction<{
            events: Event[];
            total: number;
            page: number;
            limit: number;
          }>,
        ) => {
          state.status = "succeeded";
          state.events = action.payload.events;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.limit = action.payload.limit;
        },
      )
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch events";
      });
  },
});

export default eventSlice.reducer;
