import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  apiGetAllThreads,
  apiCreateThread,
  apiUpVoteThread,
  apiDownVoteThread,
  apiNeutralVoteThread,
} from '../api';

export const fetchThreads = createAsyncThunk(
  'threads/fetchThreads',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiGetAllThreads();
      return res.data.data.threads;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Gagal memuat thread',
      );
    }
  },
);

export const createThread = createAsyncThunk(
  'threads/createThread',
  async ({ title, body, category }, { rejectWithValue }) => {
    try {
      const res = await apiCreateThread({ title, body, category });
      return res.data.data.thread;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Gagal membuat thread',
      );
    }
  },
);

const threadsSlice = createSlice({
  name: 'threads',
  initialState: {
    threads: [],
    filteredCategory: null,
    loading: false,
    error: null,
  },
  reducers: {
    setFilteredCategory(state, action) {
      state.filteredCategory = action.payload;
    },
    optimisticVoteThread(state, action) {
      const { threadId, userId, voteType } = action.payload;
      const thread = state.threads.find((t) => t.id === threadId);
      if (!thread) return;
      thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId);
      thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId);
      if (voteType === 1) thread.upVotesBy.push(userId);
      else if (voteType === -1) thread.downVotesBy.push(userId);
    },
    rollbackVoteThread(state, action) {
      const { threadId, upVotesBy, downVotesBy } = action.payload;
      const thread = state.threads.find((t) => t.id === threadId);
      if (!thread) return;
      thread.upVotesBy = upVotesBy;
      thread.downVotesBy = downVotesBy;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.loading = false;
        state.threads = action.payload;
      })
      .addCase(fetchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createThread.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.loading = false;
        state.threads.unshift(action.payload);
      })
      .addCase(createThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilteredCategory, optimisticVoteThread, rollbackVoteThread } =
  threadsSlice.actions;

export const voteThread =
  (threadId, voteType) => async (dispatch, getState) => {
    const {
      auth: { authedUser },
      threads: { threads },
    } = getState();
    if (!authedUser) return;
    const thread = threads.find((t) => t.id === threadId);
    if (!thread) return;
    const userId = authedUser.id;
    const prevUpVotes = [...thread.upVotesBy];
    const prevDownVotes = [...thread.downVotesBy];
    const isUpVoted = thread.upVotesBy.includes(userId);
    const isDownVoted = thread.downVotesBy.includes(userId);
    let actualVoteType = voteType;
    if (voteType === 1 && isUpVoted) actualVoteType = 0;
    if (voteType === -1 && isDownVoted) actualVoteType = 0;
    dispatch(
      threadsSlice.actions.optimisticVoteThread({
        threadId,
        userId,
        voteType: actualVoteType,
      }),
    );
    try {
      if (actualVoteType === 1) await apiUpVoteThread(threadId);
      else if (actualVoteType === -1) await apiDownVoteThread(threadId);
      else await apiNeutralVoteThread(threadId);
    } catch {
      dispatch(
        threadsSlice.actions.rollbackVoteThread({
          threadId,
          upVotesBy: prevUpVotes,
          downVotesBy: prevDownVotes,
        }),
      );
    }
  };

export default threadsSlice.reducer;
