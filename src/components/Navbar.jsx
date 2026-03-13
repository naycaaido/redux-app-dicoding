import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authedUser } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav className='navbar'>
      <div className='navbar__inner'>
        <Link to='/' className='navbar__logo'>
          <span className='navbar__logo-icon'>💬</span>
          <span>Forum Diskusi</span>
        </Link>

        <div className='navbar__links'>
          <Link to='/' className='navbar__link'>
            Beranda
          </Link>
          <Link to='/leaderboard' className='navbar__link'>
            Leaderboard
          </Link>
        </div>

        <div className='navbar__auth'>
          {authedUser ? (
            <>
              <div className='navbar__user'>
                <img
                  src={authedUser.avatar}
                  alt={authedUser.name}
                  className='navbar__avatar'
                />
                <span className='navbar__username'>{authedUser.name}</span>
              </div>
              <button
                type='button'
                className='logout-btn btn btn--outline'
                onClick={handleLogout}
              >
                Keluar
              </button>
            </>
          ) : (
            <>
              <Link to='/login' className='btn btn--ghost'>
                Masuk
              </Link>
              <Link to='/register' className='btn btn--primary'>
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
