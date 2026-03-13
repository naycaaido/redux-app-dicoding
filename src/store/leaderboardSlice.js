import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetLeaderboards } from '../api';

export const fetchLeaderboard = createAsyncThunk(
  'leaderboard/fetchLeaderboard',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiGetLeaderboards();
      return res.data.data.leaderboards;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Gagal memuat leaderboard',
      );
    }
  },
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    leaderboards: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.leaderboards = action.payload;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default leaderboardSlice.reducer;
