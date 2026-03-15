import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import leaderboardReducer, { fetchLeaderboard } from '../store/leaderboardSlice';
import { apiGetLeaderboards } from '../api';

vi.mock('../api', () => ({
  apiGetLeaderboards: vi.fn(),
}));

const makeStore = (preloadedState) =>
  configureStore({
    reducer: {
      leaderboard: leaderboardReducer,
    },
    preloadedState,
  });

describe('leaderboard thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch fetchLeaderboard successfully', async () => {
    const mockLeaderboards = [
      { user: { id: 'user-1', name: 'John Doe', email: 'john@example.com', avatar: 'https://example.com/avatar.png' }, score: 100 },
      { user: { id: 'user-2', name: 'Jane Doe', email: 'jane@example.com', avatar: 'https://example.com/avatar2.png' }, score: 50 },
    ];

    apiGetLeaderboards.mockResolvedValue({
      data: { data: { leaderboards: mockLeaderboards } },
    });

    const store = makeStore({
      leaderboard: {
        leaderboards: [],
        loading: false,
        error: null,
      },
    });

    await store.dispatch(fetchLeaderboard());

    const state = store.getState().leaderboard;
    expect(apiGetLeaderboards).toHaveBeenCalled();
    expect(state.leaderboards).toEqual(mockLeaderboards);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle fetchLeaderboard failure', async () => {
    apiGetLeaderboards.mockRejectedValue({
      response: { data: { message: 'Failed to fetch' } },
    });

    const store = makeStore({
      leaderboard: {
        leaderboards: [],
        loading: false,
        error: null,
      },
    });

    await store.dispatch(fetchLeaderboard());

    const state = store.getState().leaderboard;
    expect(state.leaderboards).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch');
  });
});
