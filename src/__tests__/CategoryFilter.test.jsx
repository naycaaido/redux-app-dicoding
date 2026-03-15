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

// Pengujian untuk komponen CategoryFilter
describe('CategoryFilter', () => {
  it('should toggle active category button', async () => {
    // Arrange (Persiapan data atau render komponen)
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

    // Assert (Verifikasi hasil yang diharapkan) - Inisial State
    expect(allButton).toHaveClass('category-filter__btn--active');

    // Act (Aksi yang dilakukan, seperti interaksi user atau dispatch thunk)
    await userEvent.click(reactButton);
    // Assert (Verifikasi hasil yang diharapkan)
    expect(reactButton).toHaveClass('category-filter__btn--active');

    // Act (Aksi yang dilakukan, seperti interaksi user atau dispatch thunk) - Toggle off
    await userEvent.click(reactButton);
    // Assert (Verifikasi hasil yang diharapkan)
    expect(allButton).toHaveClass('category-filter__btn--active');
  });
});
