/*
Skenario pengujian reducer threads:
- setFilteredCategory menyimpan kategori yang dipilih.
- optimisticVoteThread memperbarui daftar vote secara optimistis.
*/

import { describe, it, expect } from 'vitest';
import threadsReducer, {
  setFilteredCategory,
  optimisticVoteThread,
} from '../store/threadsSlice';

const baseState = {
  threads: [
    {
      id: 'thread-1',
      title: 'Thread pertama',
      category: 'react',
      createdAt: '2024-01-01T00:00:00.000Z',
      totalComments: 0,
      upVotesBy: [],
      downVotesBy: ['user-2'],
    },
  ],
  filteredCategory: null,
  loading: false,
  error: null,
};

describe('threadsReducer', () => {
  it('should set filtered category', () => {
    const result = threadsReducer(baseState, setFilteredCategory('react'));

    expect(result.filteredCategory).toBe('react');
  });

  it('should apply optimistic vote updates', () => {
    const result = threadsReducer(
      baseState,
      optimisticVoteThread({
        threadId: 'thread-1',
        userId: 'user-1',
        voteType: 1,
      }),
    );

    expect(result.threads[0].upVotesBy).toEqual(['user-1']);
    expect(result.threads[0].downVotesBy).toEqual(['user-2']);
  });
});
