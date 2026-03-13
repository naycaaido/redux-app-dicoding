import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchThreadDetail,
  voteThreadDetail,
} from '../store/threadDetailSlice';
import VoteButton from '../components/VoteButton';
import CommentItem from '../components/CommentItem';
import CommentForm from '../components/CommentForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/helpers';

const ThreadDetailPage = () => {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { detail, loading, error } = useSelector((state) => state.threadDetail);
  const { authedUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchThreadDetail(threadId));
  }, [dispatch, threadId]);

  const handleUpVote = () => {
    if (!authedUser) {
      navigate('/login');
      return;
    }
    dispatch(voteThreadDetail(threadId, 1));
  };

  const handleDownVote = () => {
    if (!authedUser) {
      navigate('/login');
      return;
    }
    dispatch(voteThreadDetail(threadId, -1));
  };

  if (loading) return <LoadingSpinner fullPage />;

  if (error) {
    return (
      <main className='page'>
        <div className='container'>
          <div className='error-state'>
            <p>Error: {error}</p>
            <button
              type='button'
              className='btn btn--primary'
              onClick={() => navigate(-1)}
            >
              Kembali
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!detail) return null;

  return (
    <main className='page'>
      <div className='container'>
        <div className='thread-detail'>
          <div className='thread-detail__card'>
            <div className='thread-detail__header'>
              <span className='thread-card__category'>{`#${detail.category}`}</span>
              <h1 className='thread-detail__title'>{detail.title}</h1>
              <div className='thread-detail__meta'>
                <img
                  src={detail.owner.avatar}
                  alt={detail.owner.name}
                  className='thread-card__avatar'
                />
                <span className='thread-detail__owner'>
                  {detail.owner.name}
                </span>
                <span className='thread-card__dot'>·</span>
                <span className='thread-detail__date'>
                  {formatDate(detail.createdAt)}
                </span>
              </div>
            </div>

            <div
              className='thread-detail__body'
              dangerouslySetInnerHTML={{ __html: detail.body }}
            />

            <div className='thread-detail__votes'>
              <VoteButton
                upVotesBy={detail.upVotesBy}
                downVotesBy={detail.downVotesBy}
                userId={authedUser?.id}
                onUpVote={handleUpVote}
                onDownVote={handleDownVote}
              />
            </div>
          </div>

          <section className='comments-section'>
            <h2 className='comments-section__title'>
              Komentar ({detail.comments.length})
            </h2>
            <CommentForm threadId={detail.id} />
            <div className='comments-list'>
              {detail.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  threadId={detail.id}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ThreadDetailPage;
