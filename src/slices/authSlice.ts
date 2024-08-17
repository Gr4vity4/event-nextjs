import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface AuthState {
  status: string;
  error: string | null;
  user: any | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  status: 'idle',
  error: null,
  user: null,
  accessToken: null,
};

// Helper function to set the access token
const setAccessToken = (token: string) => {
  Cookies.set('accessToken', token, { expires: 7 }); // expires in 7 days
};

// Helper function to get the access token
export const getAccessToken = (): string | null => {
  return Cookies.get('accessToken') || null;
};

// Helper function to remove the access token
const removeAccessToken = () => {
  Cookies.remove('accessToken');
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // Required for cookies
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      setAccessToken(data.accessToken);
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'An unexpected error occurred');
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include', // Required for cookies
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    removeAccessToken();
    return null;
  } catch (error) {
    return rejectWithValue((error as Error).message || 'An unexpected error occurred');
  }
});

export const getProfileUser = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    const accessToken = getAccessToken();
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    return await response.json();
  } catch (error) {
    return rejectWithValue((error as Error).message || 'An unexpected error occurred');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.error = null;
      state.status = 'idle';
      state.user = null;
      state.accessToken = null;
      removeAccessToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(getProfileUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getProfileUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(getProfileUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.user = null;
        state.accessToken = null;
        removeAccessToken();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
