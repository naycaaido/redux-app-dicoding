import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiLogin, apiRegister, apiGetOwnProfile } from '../api';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const loginRes = await apiLogin({ email, password });
      const { token } = loginRes.data.data;
      localStorage.setItem('token', token);
      const profileRes = await apiGetOwnProfile();
      return { token, user: profileRes.data.data.user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login gagal');
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      await apiRegister({ name, email, password });
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registrasi gagal',
      );
    }
  },
);

export const initAuth = createAsyncThunk(
  'auth/initAuth',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('No token');
    try {
      const res = await apiGetOwnProfile();
      return { token, user: res.data.data.user };
    } catch {
      localStorage.removeItem('token');
      return rejectWithValue('Token tidak valid');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authedUser: null,
    token: null,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    logoutUser(state) {
      state.authedUser = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authedUser = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(initAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.authedUser = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(initAuth.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
      });
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
