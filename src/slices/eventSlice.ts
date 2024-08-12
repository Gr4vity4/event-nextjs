import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Event } from "@/types";

interface EventState {
  events: Event[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  total: number;
  currentPage: number;
  limit: number;
  sortField: string;
  sortOrder: string;
  searchTerm: string;
}

const initialState: EventState = {
  events: [],
  status: "idle",
  error: null,
  total: 0,
  currentPage: 1,
  limit: 10,
  sortField: "eventDate",
  sortOrder: "desc",
  searchTerm: "",
};

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async ({
    page,
    limit,
    sortField,
    sortOrder,
    search,
  }: {
    page: number;
    limit: number;
    sortField: string;
    sortOrder: string;
    search: string;
  }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}&search=${search}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    return response.json();
  },
);

export const fetchEventById = createAsyncThunk(
  "events/fetchEventById",
  async (id: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,
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
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSortField: (state, action: PayloadAction<string>) => {
      state.sortField = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<string>) => {
      state.sortOrder = action.payload;
    },
  },
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
          state.currentPage = action.payload.page;
          state.limit = action.payload.limit;
        },
      )
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch events";
      })
      .addCase(fetchEventById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchEventById.fulfilled,
        (state, action: PayloadAction<Event>) => {
          state.status = "succeeded";
          state.events = [action.payload];
        },
      )
      .addCase(fetchEventById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch events";
      });
  },
});

export const { setSearchTerm, setSortField, setSortOrder } = eventSlice.actions;

export default eventSlice.reducer;
