import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FetchDataParams, RegistrationState } from '@/types';

export const fetchRegistrations = createAsyncThunk(
  'registrations/fetchRegistrations',
  async ({ page, limit, sortField, sortOrder, search }: FetchDataParams) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user-signup?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}&search=${search}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch registrations');
    }
    return response.json();
  },
);

export const cancelRegistration = createAsyncThunk(
  'registrations/cancelRegistration',
  async (id: string) => {
    console.log('cancelRegistration:', id);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-signup/${id}/cancel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to cancel registration');
    }

    return response.json();
  },
);

const initialRegistrationState: RegistrationState = {
  registrations: [],
  status: 'idle',
  error: null,
  total: 0,
  currentPage: 1,
  limit: 10,
  sortField: 'createdAt',
  sortOrder: 'desc',
  searchTerm: '',
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState: initialRegistrationState,
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
      .addCase(fetchRegistrations.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRegistrations.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.registrations = action.payload.registrations;
        state.total = action.payload.total;
        // state.limit = action.payload.limit;
      })
      .addCase(fetchRegistrations.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch registrations';
      });
  },
});

export const { setSearchTerm, setSortField, setSortOrder, setCurrentPage, setLimit } =
  registrationSlice.actions;

export default registrationSlice.reducer;
