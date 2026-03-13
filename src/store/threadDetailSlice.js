import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  apiGetThreadDetail,
  apiCreateComment,
  apiUpVoteThread,
  apiDownVoteThread,
  apiNeutralVoteThread,
  apiUpVoteComment,
  apiDownVoteComment,
  apiNeutralVoteComment,
} from '../api';

export const fetchThreadDetail = createAsyncThunk(
  'threadDetail/fetchThreadDetail',
  async (threadId, { rejectWithValue }) => {
    try {
      const res = await apiGetThreadDetail(threadId);
      return res.data.data.detailThread;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Gagal memuat thread',
      );
    }
  },
);

export const createComment = createAsyncThunk(
  'threadDetail/createComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      const res = await apiCreateComment(threadId, content);
      return res.data.data.comment;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Gagal membuat komentar',
      );
    }
  },
);

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState: {
    detail: null,
    loading: false,
    error: null,
  },
  reducers: {
    optimisticVoteThreadDetail(state, action) {
      if (!state.detail) return;
      const { userId, voteType } = action.payload;
      state.detail.upVotesBy = state.detail.upVotesBy.filter(
        (id) => id !== userId,
      );
      state.detail.downVotesBy = state.detail.downVotesBy.filter(
        (id) => id !== userId,
      );
      if (voteType === 1) state.detail.upVotesBy.push(userId);
      else if (voteType === -1) state.detail.downVotesBy.push(userId);
    },
    rollbackVoteThreadDetail(state, action) {
      if (!state.detail) return;
      const { upVotesBy, downVotesBy } = action.payload;
      state.detail.upVotesBy = upVotesBy;
      state.detail.downVotesBy = downVotesBy;
    },
    optimisticVoteComment(state, action) {
      if (!state.detail) return;
      const { commentId, userId, voteType } = action.payload;
      const comment = state.detail.comments.find((c) => c.id === commentId);
      if (!comment) return;
      comment.upVotesBy = comment.upVotesBy.filter((id) => id !== userId);
      comment.downVotesBy = comment.downVotesBy.filter((id) => id !== userId);
      if (voteType === 1) comment.upVotesBy.push(userId);
      else if (voteType === -1) comment.downVotesBy.push(userId);
    },
    rollbackVoteComment(state, action) {
      if (!state.detail) return;
      const { commentId, upVotesBy, downVotesBy } = action.payload;
      const comment = state.detail.comments.find((c) => c.id === commentId);
      if (!comment) return;
      comment.upVotesBy = upVotesBy;
      comment.downVotesBy = downVotesBy;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.detail = null;
      })
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload;
      })
      .addCase(fetchThreadDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        if (state.detail) state.detail.comments.push(action.payload);
      });
  },
});

export const voteThreadDetail =
  (threadId, voteType) => async (dispatch, getState) => {
    const {
      auth: { authedUser },
      threadDetail: { detail },
    } = getState();
    if (!authedUser || !detail) return;
    const userId = authedUser.id;
    const prevUpVotes = [...detail.upVotesBy];
    const prevDownVotes = [...detail.downVotesBy];
    const isUpVoted = detail.upVotesBy.includes(userId);
    const isDownVoted = detail.downVotesBy.includes(userId);
    let actualVoteType = voteType;
    if (voteType === 1 && isUpVoted) actualVoteType = 0;
    if (voteType === -1 && isDownVoted) actualVoteType = 0;
    dispatch(
      threadDetailSlice.actions.optimisticVoteThreadDetail({
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
        threadDetailSlice.actions.rollbackVoteThreadDetail({
          upVotesBy: prevUpVotes,
          downVotesBy: prevDownVotes,
        }),
      );
    }
  };

export const voteComment =
  (threadId, commentId, voteType) => async (dispatch, getState) => {
    const {
      auth: { authedUser },
      threadDetail: { detail },
    } = getState();
    if (!authedUser || !detail) return;
    const userId = authedUser.id;
    const comment = detail.comments.find((c) => c.id === commentId);
    if (!comment) return;
    const prevUpVotes = [...comment.upVotesBy];
    const prevDownVotes = [...comment.downVotesBy];
    const isUpVoted = comment.upVotesBy.includes(userId);
    const isDownVoted = comment.downVotesBy.includes(userId);
    let actualVoteType = voteType;
    if (voteType === 1 && isUpVoted) actualVoteType = 0;
    if (voteType === -1 && isDownVoted) actualVoteType = 0;
    dispatch(
      threadDetailSlice.actions.optimisticVoteComment({
        commentId,
        userId,
        voteType: actualVoteType,
      }),
    );
    try {
      if (actualVoteType === 1) await apiUpVoteComment(threadId, commentId);
      else if (actualVoteType === -1)
        await apiDownVoteComment(threadId, commentId);
      else await apiNeutralVoteComment(threadId, commentId);
    } catch {
      dispatch(
        threadDetailSlice.actions.rollbackVoteComment({
          commentId,
          upVotesBy: prevUpVotes,
          downVotesBy: prevDownVotes,
        }),
      );
    }
  };

export default threadDetailSlice.reducer;
