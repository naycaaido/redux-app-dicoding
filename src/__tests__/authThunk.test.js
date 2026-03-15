import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loginUser } from '../store/authSlice';
import { apiLogin, apiGetOwnProfile } from '../api';

vi.mock('../api', () => ({
  apiLogin: vi.fn(),
  apiGetOwnProfile: vi.fn(),
  apiRegister: vi.fn(),
}));

const makeStore = (preloadedState) =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  });

// Pengujian untuk fungsi auth thunks
describe('auth thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should dispatch loginUser successfully', async () => {
    // Arrange (Persiapan data atau render komponen)
    const mockToken = 'fake-token';
    const mockUser = { id: 'user-1', name: 'John Doe', email: 'john@example.com' };

    apiLogin.mockResolvedValue({
      data: { data: { token: mockToken } },
    });
    apiGetOwnProfile.mockResolvedValue({
      data: { data: { user: mockUser } },
    });

    const store = makeStore({
      auth: {
        authedUser: null,
        token: null,
        loading: false,
        error: null,
        initialized: false,
      },
    });

    // Act (Aksi yang dilakukan, seperti interaksi user atau dispatch thunk)
    await store.dispatch(loginUser({ email: 'john@example.com', password: 'password123' }));

    // Assert (Verifikasi hasil yang diharapkan)
    const state = store.getState().auth;
    expect(apiLogin).toHaveBeenCalledWith({ email: 'john@example.com', password: 'password123' });
    expect(apiGetOwnProfile).toHaveBeenCalled();
    expect(state.token).toBe(mockToken);
    expect(state.authedUser).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  it('should handle loginUser failure', async () => {
    // Arrange (Persiapan data atau render komponen)
    apiLogin.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } },
    });

    const store = makeStore({
      auth: {
        authedUser: null,
        token: null,
        loading: false,
        error: null,
        initialized: false,
      },
    });

    // Act (Aksi yang dilakukan, seperti interaksi user atau dispatch thunk)
    await store.dispatch(loginUser({ email: 'wrong@example.com', password: 'wrongpassword' }));

    // Assert (Verifikasi hasil yang diharapkan)
    const state = store.getState().auth;
    expect(state.token).toBeNull();
    expect(state.authedUser).toBeNull();
    expect(state.error).toBe('Invalid credentials');
  });
});
