import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createComment } from '../store/threadDetailSlice';

const CommentForm = ({ threadId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authedUser } = useSelector((state) => state.auth);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!authedUser) {
    return (
      <div className='comment-form__login-prompt'>
        <p>
          <button
            type='button'
            className='btn btn--link'
            onClick={() => navigate('/login')}
          >
            Masuk
          </button>{' '}
          untuk meninggalkan komentar.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    await dispatch(createComment({ threadId, content: content.trim() }));
    setContent('');
    setSubmitting(false);
  };

  return (
    <form className='comment-form' onSubmit={handleSubmit}>
      <h3 className='comment-form__title'>Tambah Komentar</h3>
      <textarea
        className='comment-form__textarea'
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='Tulis komentar Anda...'
        rows={4}
        required
      />
      <button
        type='submit'
        className='btn btn--primary'
        disabled={submitting || !content.trim()}
      >
        {submitting ? 'Mengirim...' : 'Kirim Komentar'}
      </button>
    </form>
  );
};

CommentForm.propTypes = {
  threadId: PropTypes.string.isRequired,
};

export default CommentForm;
