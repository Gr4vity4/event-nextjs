import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event as EventDataType, EventState, FetchDataParams } from '@/types';
import { getAccessToken } from './authSlice';

const createHeaders = () => {
  const accessToken = getAccessToken();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async ({ page, limit, sortField, sortOrder, search }: FetchDataParams) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/events?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}&search=${search}`,
    );

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return response.json();
  },
);

export const fetchEventById = createAsyncThunk('events/fetchEventById', async (id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  return response.json();
});

export const addEvent = createAsyncThunk(
  'events/addEvent',
  async (event: Omit<Event, 'id'>, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
        method: 'POST',
        headers: createHeaders(),
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('Failed to add events');

      return response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async (event: EventDataType, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${event.id}`, {
        method: 'PATCH',
        headers: createHeaders(),
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('Failed to update events');

      return response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id: string, { dispatch, getState, rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: createHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete events');

      return response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

const initialEventState: EventState = {
  events: [],
  status: 'idle',
  error: null,
  total: 0,
  currentPage: 1,
  limit: 10,
  sortField: 'createdAt',
  sortOrder: 'desc',
  searchTerm: '',
};

const dashboardSlice = createSlice({
  name: 'events',
  initialState: initialEventState,
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
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.events = action.payload.events;
        state.total = action.payload.total;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.status = 'failed';
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
          const index = state.events.findIndex((event) => event.id === action.payload.id);
          if (index !== -1) {
            state.events[index] = action.payload;
          }
        }
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        if (Array.isArray(state.events)) {
          state.events = state.events.filter((event) => event.id !== action.payload);
        }
      });
  },
});

export const { setSearchTerm, setSortField, setSortOrder, setCurrentPage, setLimit } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
