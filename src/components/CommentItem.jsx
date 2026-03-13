import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { voteComment } from '../store/threadDetailSlice';
import VoteButton from './VoteButton';
import { formatDate } from '../utils/helpers';

const CommentItem = ({ comment, threadId }) => {
  const dispatch = useDispatch();
  const { authedUser } = useSelector((state) => state.auth);

  const handleUpVote = () => {
    if (!authedUser) return;
    dispatch(voteComment(threadId, comment.id, 1));
  };

  const handleDownVote = () => {
    if (!authedUser) return;
    dispatch(voteComment(threadId, comment.id, -1));
  };

  return (
    <div className='comment-item'>
      <div className='comment-item__header'>
        <img
          src={comment.owner.avatar}
          alt={comment.owner.name}
          className='comment-item__avatar'
        />
        <div className='comment-item__author-info'>
          <span className='comment-item__author'>{comment.owner.name}</span>
          <span className='comment-item__date'>
            {formatDate(comment.createdAt)}
          </span>
        </div>
      </div>
      <div
        className='comment-item__content'
        dangerouslySetInnerHTML={{ __html: comment.content }}
      />
      <div className='comment-item__footer'>
        <VoteButton
          upVotesBy={comment.upVotesBy}
          downVotesBy={comment.downVotesBy}
          userId={authedUser?.id}
          onUpVote={handleUpVote}
          onDownVote={handleDownVote}
          size='sm'
        />
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    upVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    downVotesBy: PropTypes.arrayOf(PropTypes.string).isRequired,
    owner: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  threadId: PropTypes.string.isRequired,
};

export default CommentItem;
