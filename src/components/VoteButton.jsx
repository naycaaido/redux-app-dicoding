import React from 'react';
import PropTypes from 'prop-types';

const VoteButton = ({
  upVotesBy,
  downVotesBy,
  userId = null, // Mengganti defaultProps dengan default parameter
  onUpVote,
  onDownVote,
  size = 'md', // Mengganti defaultProps dengan default parameter
}) => {
  const isUpVoted = userId && upVotesBy.includes(userId);
  const isDownVoted = userId && downVotesBy.includes(userId);

  return (
    <div className={`vote-buttons vote-buttons--${size}`}>
      <button
        type='button'
        className={`vote-btn vote-btn--up ${isUpVoted ? 'vote-btn--active-up' : ''}`}
        onClick={(e) => userId && onUpVote(e)} // Hanya panggil onUpVote jika ada userId
        title='Upvote'
        aria-label='Upvote'
      >
        <span className='vote-btn__icon'>▲</span>
        <span className='vote-btn__count'>{upVotesBy.length}</span>
      </button>
      <button
        type='button'
        className={`vote-btn vote-btn--down ${isDownVoted ? 'vote-btn--active-down' : ''}`}
        onClick={(e) => userId && onDownVote(e)} // Hanya panggil onDownVote jika ada userId
        title='Downvote'
        aria-label='Downvote'
      >
        <span className='vote-btn__icon'>▼</span>
        <span className='vote-btn__count'>{downVotesBy.length}</span>
      </button>
    </div>
  );
};

VoteButton.propTypes = {
  upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  userId: PropTypes.string,
  onUpVote: PropTypes.func.isRequired,
  onDownVote: PropTypes.func.isRequired,
  size: PropTypes.oneOf(['sm', 'md']),
};

export default VoteButton;