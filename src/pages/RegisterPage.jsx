import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearAuthError } from '../store/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(
    () => () => {
      dispatch(clearAuthError());
    },
    [dispatch],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(registerUser({ name, email, password }));
    if (result.meta.requestStatus === 'fulfilled') navigate('/login');
  };

  return (
    <main className='page page--auth'>
      <div className='auth-card'>
        <h1 className='auth-card__title'>Daftar</h1>
        <p className='auth-card__subtitle'>
          Buat akun baru dan mulai berdiskusi!
        </p>

        {error && <div className='alert alert--error'>{error}</div>}

        <form className='auth-form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='name' className='form-label'>
              Nama
            </label>
            <input
              id='name'
              type='text'
              className='form-input'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Nama lengkap'
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='email' className='form-label'>
              Email
            </label>
            <input
              id='email'
              type='email'
              className='form-input'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='email@contoh.com'
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <input
              id='password'
              type='password'
              className='form-input'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Minimal 6 karakter'
              minLength={6}
              required
            />
          </div>

          <button
            type='submit'
            className='btn btn--primary btn--block'
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <p className='auth-card__footer'>
          Sudah punya akun?{' '}
          <Link to='/login' className='auth-card__link'>
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
