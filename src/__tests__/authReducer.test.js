import { describe, it, expect } from 'vitest';
import authReducer, { logoutUser, clearAuthError } from '../store/authSlice';

// Pengujian untuk fungsi authReducer
describe('authReducer', () => {
  it('should handle logoutUser', () => {
    // Arrange (Persiapan data atau render komponen)
    const initialState = {
      authedUser: { id: 'user-1', name: 'User 1' },
      token: 'fake-token',
      loading: false,
      error: null,
      initialized: true,
    };

    // Act (Aksi yang dilakukan, seperti interaksi user atau dispatch thunk)
    const result = authReducer(initialState, logoutUser());

    // Assert (Verifikasi hasil yang diharapkan)
    expect(result.authedUser).toBe(null);
    expect(result.token).toBe(null);
  });

  it('should handle clearAuthError', () => {
    // Arrange (Persiapan data atau render komponen)
    const initialState = {
      authedUser: null,
      token: null,
      loading: false,
      error: 'Login failed',
      initialized: true,
    };

    // Act (Aksi yang dilakukan, seperti interaksi user atau dispatch thunk)
    const result = authReducer(initialState, clearAuthError());

    // Assert (Verifikasi hasil yang diharapkan)
    expect(result.error).toBe(null);
  });
});
