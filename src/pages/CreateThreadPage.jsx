import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createThread } from '../store/threadsSlice';

const CreateThreadPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.threads);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      createThread({
        title: title.trim(),
        body: body.trim(),
        category: category.trim(),
      }),
    );
    if (result.meta.requestStatus === 'fulfilled') {
      navigate(`/threads/${result.payload.id}`);
    }
  };

  return (
    <main className='page'>
      <div className='container'>
        <div className='create-thread'>
          <h1 className='create-thread__title'>Buat Thread Baru</h1>

          {error && <div className='alert alert--error'>{error}</div>}

          <form className='create-thread__form' onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor='title' className='form-label'>
                Judul Thread
              </label>
              <input
                id='title'
                type='text'
                className='form-input'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Judul thread yang menarik'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='category' className='form-label'>
                Kategori
              </label>
              <input
                id='category'
                type='text'
                className='form-input'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder='contoh: general, programming, tanya-jawab'
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='body' className='form-label'>
                Isi Thread
              </label>
              <textarea
                id='body'
                className='form-input form-textarea'
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='Ceritakan lebih lanjut...'
                rows={10}
                required
              />
            </div>

            <div className='create-thread__actions'>
              <button
                type='button'
                className='btn btn--ghost'
                onClick={() => navigate(-1)}
              >
                Batal
              </button>
              <button
                type='submit'
                className='btn btn--primary'
                disabled={loading}
              >
                {loading ? 'Memposting...' : 'Posting Thread'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CreateThreadPage;
