import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLeaderboard } from '../store/leaderboardSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const LeaderboardPage = () => {
  const dispatch = useDispatch();
  const { leaderboards, loading, error } = useSelector(
    (state) => state.leaderboard,
  );

  useEffect(() => {
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  return (
    <main className='page'>
      <div className='container'>
        <div className='leaderboard'>
          <div className='leaderboard__header'>
            <h1 className='leaderboard__title'>🏆 Leaderboard</h1>
            <p className='leaderboard__subtitle'>
              Pengguna paling aktif bulan ini
            </p>
          </div>

          {loading && <LoadingSpinner />}
          {error && <div className='alert alert--error'>{error}</div>}

          {!loading && leaderboards.length > 0 && (
            <div className='leaderboard__list'>
              {leaderboards.map((item, index) => (
                <div
                  key={item.user.id}
                  className={`leaderboard__item ${index < 3 ? `leaderboard__item--rank-${index + 1}` : ''}`}
                >
                  <div className='leaderboard__rank'>
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && <span>{index + 1}</span>}
                  </div>
                  <img
                    src={item.user.avatar}
                    alt={item.user.name}
                    className='leaderboard__avatar'
                  />
                  <div className='leaderboard__user-info'>
                    <span className='leaderboard__user-name'>
                      {item.user.name}
                    </span>
                  </div>
                  <div className='leaderboard__score'>
                    <span className='leaderboard__score-value'>
                      {item.score}
                    </span>
                    <span className='leaderboard__score-label'>poin</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default LeaderboardPage;
