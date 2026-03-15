/*
Skenario pengujian komponen VoteButton:
- Menampilkan jumlah vote dan memanggil handler saat tombol diklik.
*/

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VoteButton from '../components/VoteButton';

// Pengujian untuk komponen VoteButton
describe('VoteButton', () => {
  it('should render counts and call handlers', async () => {
    // Arrange (Persiapan data atau render komponen)
    const onUpVote = vi.fn();
    const onDownVote = vi.fn();

    render(
      <VoteButton
        upVotesBy={['user-1']}
        downVotesBy={['user-2', 'user-3']}
        userId='user-4'
        onUpVote={onUpVote}
        onDownVote={onDownVote}
        size='sm'
      />,
    );

    // Assert (Verifikasi hasil yang diharapkan) - Inisial State
    expect(screen.getByLabelText('Upvote')).toHaveTextContent('1');
    expect(screen.getByLabelText('Downvote')).toHaveTextContent('2');

    // Act (Aksi yang dilakukan, seperti interaksi user atau dispatch thunk)
    await userEvent.click(screen.getByLabelText('Upvote'));
    await userEvent.click(screen.getByLabelText('Downvote'));

    // Assert (Verifikasi hasil yang diharapkan)
    expect(onUpVote).toHaveBeenCalledTimes(1);
    expect(onDownVote).toHaveBeenCalledTimes(1);
  });

  it('should not call handlers when userId is not provided (user not logged in)', async () => {
    // Arrange (Persiapan data atau render komponen)
    const onUpVote = vi.fn();
    const onDownVote = vi.fn();

    render(
      <VoteButton
        upVotesBy={['user-1']}
        downVotesBy={['user-2', 'user-3']}
        userId={null}
        onUpVote={onUpVote}
        onDownVote={onDownVote}
        size='sm'
      />,
    );

    // Act (Aksi yang dilakukan, seperti interaksi user atau dispatch thunk)
    await userEvent.click(screen.getByLabelText('Upvote'));
    await userEvent.click(screen.getByLabelText('Downvote'));

    // Assert (Verifikasi hasil yang diharapkan)
    expect(onUpVote).not.toHaveBeenCalled();
    expect(onDownVote).not.toHaveBeenCalled();
  });
});
