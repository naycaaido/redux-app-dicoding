import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetAllUsers } from '../api';

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiGetAllUsers();
      return res.data.data.users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Gagal memuat pengguna',
      );
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
