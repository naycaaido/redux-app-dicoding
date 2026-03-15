/*
Skenario pengujian komponen CategoryFilter:
- Tombol kategori mengubah kategori aktif di state.
*/

import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryFilter from '../components/CategoryFilter';
import threadsReducer from '../store/threadsSlice';

describe('CategoryFilter', () => {
  it('should toggle active category button', async () => {
    const store = configureStore({
      reducer: {
        threads: threadsReducer,
      },
    });

    render(
      <Provider store={store}>
        <CategoryFilter categories={['react', 'redux']} />
      </Provider>,
    );

    const allButton = screen.getByRole('button', { name: 'Semua' });
    const reactButton = screen.getByRole('button', { name: '#react' });

    expect(allButton).toHaveClass('category-filter__btn--active');

    await userEvent.click(reactButton);
    expect(reactButton).toHaveClass('category-filter__btn--active');

    await userEvent.click(reactButton);
    expect(allButton).toHaveClass('category-filter__btn--active');
  });
});
