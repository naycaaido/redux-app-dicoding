import VoteButton from './VoteButton';

export default {
  title: 'Components/VoteButton',
  component: VoteButton,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md'],
    },
    onUpVote: { action: 'upVoted' },
    onDownVote: { action: 'downVoted' },
  },
};

export const Default = {
  args: {
    upVotesBy: ['user-1', 'user-2'],
    downVotesBy: ['user-3'],
    userId: 'user-4',
    size: 'md',
  },
};

export const ActiveUpVote = {
  args: {
    upVotesBy: ['user-1', 'user-4'],
    downVotesBy: ['user-3'],
    userId: 'user-4',
    size: 'md',
  },
};

export const ActiveDownVote = {
  args: {
    upVotesBy: ['user-1'],
    downVotesBy: ['user-3', 'user-4'],
    userId: 'user-4',
    size: 'md',
  },
};

export const Unauthenticated = {
  args: {
    upVotesBy: ['user-1', 'user-2'],
    downVotesBy: ['user-3'],
    userId: null,
    size: 'md',
  },
};
