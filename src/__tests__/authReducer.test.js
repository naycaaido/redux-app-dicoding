import { describe, it, expect } from 'vitest';
import authReducer, { logoutUser, clearAuthError } from '../store/authSlice';

describe('authReducer', () => {
  it('should handle logoutUser', () => {
    const initialState = {
      authedUser: { id: 'user-1', name: 'User 1' },
      token: 'fake-token',
      loading: false,
      error: null,
      initialized: true,
    };

    const result = authReducer(initialState, logoutUser());

    expect(result.authedUser).toBe(null);
    expect(result.token).toBe(null);
  });

  it('should handle clearAuthError', () => {
    const initialState = {
      authedUser: null,
      token: null,
      loading: false,
      error: 'Login failed',
      initialized: true,
    };

    const result = authReducer(initialState, clearAuthError());

    expect(result.error).toBe(null);
  });
});
