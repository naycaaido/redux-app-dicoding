import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ThreadCard from '../components/ThreadCard';
import authReducer from '../store/authSlice';
import threadsReducer from '../store/threadsSlice';

// Pengujian untuk komponen ThreadCard
describe('ThreadCard', () => {
  const mockThread = {
    id: 'thread-1',
    title: 'Testing React Components',
    body: 'This is a test thread body with some length to visually test truncate.',
    category: 'testing',
    createdAt: '2024-03-15T10:00:00.000Z',
    totalComments: 5,
    upVotesBy: ['user-2'],
    downVotesBy: [],
  };

  const mockOwner = {
    name: 'Jane Doe',
    avatar: 'https://example.com/jane.png',
  };

  const makeStore = (authedUser = null) =>
    configureStore({
      reducer: {
        auth: authReducer,
        threads: threadsReducer,
      },
      preloadedState: {
        auth: {
          authedUser,
          token: authedUser ? 'token' : null,
          loading: false,
          error: null,
          initialized: true,
        },
      },
    });

  it('should render thread card correctly', () => {
    // Arrange (Persiapan data atau render komponen)
    const store = makeStore({ id: 'user-1', name: 'John Doe' });

    // Act (Aksi yang dilakukan, seperti interaksi user atau dispatch thunk)
    render(
      <Provider store={store}>
        <MemoryRouter>
          <ThreadCard thread={mockThread} owner={mockOwner} />
        </MemoryRouter>
      </Provider>
    );

    // Assert (Verifikasi hasil yang diharapkan)
    // Verify Title
    expect(screen.getByText('Testing React Components')).toBeVisible();
    // Verify Category (has # prefix)
    expect(screen.getByText('#testing')).toBeVisible();
    // Verify Owner Name
    expect(screen.getByText('Jane Doe')).toBeVisible();
    // Verify comments count
    expect(screen.getByText('💬 5')).toBeVisible();
  });
});
