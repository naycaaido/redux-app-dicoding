/*
Skenario pengujian thunk threads:
- fetchThreads menyimpan daftar thread saat API sukses.
- voteThread melakukan upvote dan memanggil API terkait.
*/

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import threadsReducer, {
  fetchThreads,
  voteThread,
} from '../store/threadsSlice';
import authReducer from '../store/authSlice';
import {
  apiGetAllThreads,
  apiUpVoteThread,
  apiDownVoteThread,
  apiNeutralVoteThread,
} from '../api';

vi.mock('../api', () => ({
  apiGetAllThreads: vi.fn(),
  apiUpVoteThread: vi.fn(),
  apiDownVoteThread: vi.fn(),
  apiNeutralVoteThread: vi.fn(),
}));

const makeStore = (preloadedState) =>
  configureStore({
    reducer: {
      auth: authReducer,
      threads: threadsReducer,
    },
    preloadedState,
  });

describe('threads thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should store threads from fetchThreads', async () => {
    apiGetAllThreads.mockResolvedValue({
      data: {
        data: {
          threads: [
            {
              id: 'thread-1',
              title: 'Thread pertama',
              category: 'react',
              createdAt: '2024-01-01T00:00:00.000Z',
              totalComments: 0,
              upVotesBy: [],
              downVotesBy: [],
            },
          ],
        },
      },
    });

    const store = makeStore({
      threads: {
        threads: [],
        filteredCategory: null,
        loading: false,
        error: null,
      },
      auth: {
        authedUser: null,
        token: null,
        loading: false,
        error: null,
        initialized: true,
      },
    });

    await store.dispatch(fetchThreads());

    expect(store.getState().threads.threads).toHaveLength(1);
    expect(store.getState().threads.threads[0].id).toBe('thread-1');
  });

  it('should upvote thread using voteThread', async () => {
    apiUpVoteThread.mockResolvedValue({});

    const store = makeStore({
      threads: {
        threads: [
          {
            id: 'thread-1',
            title: 'Thread pertama',
            category: 'react',
            createdAt: '2024-01-01T00:00:00.000Z',
            totalComments: 0,
            upVotesBy: [],
            downVotesBy: [],
          },
        ],
        filteredCategory: null,
        loading: false,
        error: null,
      },
      auth: {
        authedUser: {
          id: 'user-1',
          name: 'User 1',
          avatar: 'https://example.com/avatar.png',
        },
        token: 'token',
        loading: false,
        error: null,
        initialized: true,
      },
    });

    await store.dispatch(voteThread('thread-1', 1));

    expect(apiUpVoteThread).toHaveBeenCalledWith('thread-1');
    expect(store.getState().threads.threads[0].upVotesBy).toEqual(['user-1']);
  });
});
