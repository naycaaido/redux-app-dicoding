import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { voteThread } from '../store/threadsSlice';
import VoteButton from './VoteButton';
import { formatDate, truncateText } from '../utils/helpers';

const ThreadCard = ({ thread, owner }) => {
  const dispatch = useDispatch();
  const { authedUser } = useSelector((state) => state.auth);

  const handleUpVote = () => {
    if (!authedUser) return;
    dispatch(voteThread(thread.id, 1));
  };

  const handleDownVote = () => {
    if (!authedUser) return;
    dispatch(voteThread(thread.id, -1));
  };

  return (
    <article className='thread-card'>
      <div className='thread-card__header'>
        <span className='thread-card__category'>{`#${thread.category}`}</span>
      </div>

      <Link to={`/threads/${thread.id}`} className='thread-card__title-link'>
        <h2 className='thread-card__title'>{thread.title}</h2>
      </Link>

      {thread.body && (
        <p className='thread-card__body'>{truncateText(thread.body)}</p>
      )}

      <div className='thread-card__footer'>
        <div className='thread-card__meta'>
          <div className='thread-card__owner'>
            {owner?.avatar && (
              <img
                src={owner.avatar}
                alt={owner.name}
                className='thread-card__avatar'
              />
            )}
            <span className='thread-card__owner-name'>
              {owner?.name || 'Anonim'}
            </span>
          </div>
          <span className='thread-card__dot'>·</span>
          <span className='thread-card__date'>
            {formatDate(thread.createdAt)}
          </span>
          <span className='thread-card__dot'>·</span>
          <span className='thread-card__comments'>
            💬 {thread.totalComments}
          </span>
        </div>

        <VoteButton
          upVotesBy={thread.upVotesBy}
          downVotesBy={thread.downVotesBy}
          userId={authedUser?.id}
          onUpVote={handleUpVote}
          onDownVote={handleDownVote}
          size='sm'
        />
      </div>
    </article>
  );
};

ThreadCard.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string,
    category: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    totalComments: PropTypes.number.isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  owner: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.string,
  }),
};

ThreadCard.defaultProps = {
  owner: null,
};

export default ThreadCard;
