import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../store/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, authedUser } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (authedUser) navigate('/');
    return () => {
      dispatch(clearAuthError());
    };
  }, [authedUser, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (result.meta.requestStatus === 'fulfilled') navigate('/');
  };

  return (
    <main className='page page--auth'>
      <Helmet>
        <title>Forum Diskusi - Masuk</title>
      </Helmet>
      <div className='auth-card'>
        <h1 className='auth-card__title'>Masuk</h1>
        <p className='auth-card__subtitle'>Selamat datang kembali!</p>

        {error && <div className='alert alert--error'>{error}</div>}

        <form className='auth-form' onSubmit={handleSubmit}>
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
              placeholder='Masukkan password'
              required
            />
          </div>

          <button
            type='submit'
            className='btn btn--primary btn--block'
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p className='auth-card__footer'>
          Belum punya akun?{' '}
          <Link to='/register' className='auth-card__link'>
            Daftar sekarang
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;
