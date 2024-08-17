import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Event as EventDataType, EventState } from "@/types";
import { getAccessToken } from "./authSlice";

const createHeaders = () => {
  const accessToken = getAccessToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
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

export const addEvent = createAsyncThunk(
  "events/addEvent",
  async (event: Omit<Event, "id">, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events`,
        {
          method: "POST",
          headers: createHeaders(),
          body: JSON.stringify(event),
        },
      );
      if (!response.ok) throw new Error("Failed to add events");
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const updateEvent = createAsyncThunk(
  "events/updateEvent",
  async (event: EventDataType, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${event.id}`,
        {
          method: "PATCH",
          headers: createHeaders(),
          body: JSON.stringify(event),
        },
      );
      if (!response.ok) throw new Error("Failed to update events");
      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const deleteEvent = createAsyncThunk(
  "events/deleteEvent",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${id}`,
        {
          method: "DELETE",
          headers: createHeaders(),
        },
      );
      if (!response.ok) throw new Error("Failed to delete events");
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

const initialEventState: EventState = {
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

const eventsSlice = createSlice({
  name: "events",
  initialState: initialEventState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        if (Array.isArray(state.events)) {
          state.events.push(action.payload);
        } else {
          state.events = [action.payload];
        }
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        if (Array.isArray(state.events)) {
          const index = state.events.findIndex(
            (event) => event.id === action.payload.id,
          );
          if (index !== -1) {
            state.events[index] = action.payload;
          }
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        if (Array.isArray(state.events)) {
          state.events = state.events.filter(
            (event) => event.id !== action.payload,
          );
        }
      });
  },
});

export default eventsSlice.reducer;
